"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Measurement = exports.AsyncQueue = exports.TimeSeriesDB = exports.Schema = void 0;
const influxdb_client_1 = require("@influxdata/influxdb-client");
const influxdb_client_apis_1 = require("@influxdata/influxdb-client-apis");
const async_await_queue_1 = require("async-await-queue");
const settings_1 = require("../utils/settings");
class Schema {
}
exports.Schema = Schema;
class TimeSeriesDB {
    constructor() {
        const url = settings_1.Settings.get('INFLUX2_URL');
        const token = settings_1.Settings.get('INFLUX2_TOKEN');
        TimeSeriesDB.db = new influxdb_client_1.InfluxDB({
            url,
            token,
            timeout: 1000 * 15, // 15 seconds
        });
    }
    static connect() {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    static disconnect() {
        // delete this.instance.db
    }
    static get instance() {
        if (this.inst === undefined) {
            this.inst = new TimeSeriesDB();
            this.connected = this.connect();
        }
        return this.connected;
    }
}
exports.TimeSeriesDB = TimeSeriesDB;
class AsyncQueue {
    constructor() {
        this.queue = new async_await_queue_1.Queue(2, 100);
        this.count = 0;
    }
    queueTask(task_1) {
        return __awaiter(this, arguments, void 0, function* (task, priority = 0) {
            const id = this.count++;
            yield this.queue
                .wait(id, priority)
                .then(task)
                .finally(() => this.queue.end(id));
        });
    }
}
exports.AsyncQueue = AsyncQueue;
class Measurement {
    constructor(measurement) {
        this.throttle = new AsyncQueue();
        this.timeseriesDB = TimeSeriesDB.db;
        this.name = measurement;
        this.org = settings_1.Settings.get('INFLUX2_ORG');
        this.bucket = settings_1.Settings.get('INFLUX2_BUCKET');
        this.writeApi = this.timeseriesDB.getWriteApi(this.org, settings_1.Settings.get('INFLUX2_BUCKET'));
        this.queryApi = this.timeseriesDB.getQueryApi(this.org);
    }
    convertToPoint(point) {
        const newPoint = new influxdb_client_1.Point(this.name);
        for (const tag in point.tags) {
            if (typeof point.tags[tag] === 'boolean')
                newPoint.tag(tag, point.tags[tag] ? 'true' : 'false');
            else
                newPoint.tag(tag, point.tags[tag]);
        }
        for (const field in point.fields) {
            if (typeof point.fields[field] === 'boolean')
                newPoint.booleanField(field, point.fields[field]);
            else if (typeof point.fields[field] === 'number')
                newPoint.floatField(field, point.fields[field]);
            else
                newPoint.stringField(field, point.fields[field]);
        }
        newPoint.timestamp(point.timestamp);
        return newPoint;
    }
    writePoints(points) {
        return __awaiter(this, void 0, void 0, function* () {
            const newPoints = points.map((e) => this.convertToPoint(e));
            yield this.throttle.queueTask(() => __awaiter(this, void 0, void 0, function* () {
                this.writeApi.writePoints(newPoints);
                yield this.writeApi.flush();
            }));
        });
    }
    writePoint(point) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.writePoints([point]);
        });
    }
    query(options_1) {
        return __awaiter(this, arguments, void 0, function* (options, retries = 0) {
            const queryTask = () => __awaiter(this, void 0, void 0, function* () {
                var _a, e_1, _b, _c;
                let query = `
      from(bucket: "${this.bucket}")
        |> range(start: ${options.start.toISOString()}, stop: ${options.end.toISOString()})
        |> filter(fn: (r) => r._measurement == "${this.name}")\n      `;
                for (const tag in options.where) {
                    query += `|> filter(fn: (r) => r.${tag} == "${options.where[tag]}")`;
                }
                const data = [];
                try {
                    // Influx2 is unlike influx1, so we must merge fields with the same timestamp
                    for (var _d = true, _e = __asyncValues(this.queryApi.iterateRows(query)), _f; _f = yield _e.next(), _a = _f.done, !_a; _d = true) {
                        _c = _f.value;
                        _d = false;
                        const { values, tableMeta } = _c;
                        const o = tableMeta.toObject(values);
                        const field = data.find((e) => e.time === o._time);
                        if (field) {
                            field[o._field] = o._value;
                        }
                        else {
                            data.push({
                                time: o._time,
                                timestamp: new Date(o._time),
                                [o._field]: o._value,
                            });
                        }
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (!_d && !_a && (_b = _e.return)) yield _b.call(_e);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
                return data;
            });
            while (retries + 1 > 0) {
                try {
                    return yield queryTask();
                }
                catch (e) {
                    console.log('Error querying - retrying', e);
                    retries--;
                }
            }
        });
    }
    dropMeasurement() {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteApi = new influxdb_client_apis_1.DeleteAPI(this.timeseriesDB);
            yield deleteApi.postDelete({
                org: this.org,
                bucket: this.bucket,
                body: {
                    start: new Date(0).toISOString(),
                    stop: new Date('2100-1-1').toISOString(),
                    predicate: `_measurement="${this.name}"`,
                },
            });
        });
    }
    dropSeries(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteApi = new influxdb_client_apis_1.DeleteAPI(this.timeseriesDB);
            yield deleteApi.postDelete({
                org: this.org,
                bucket: this.bucket,
                body: {
                    start: new Date(0).toISOString(),
                    stop: new Date('2100-1-1').toISOString(),
                    predicate: `_measurement="${this.name}" AND ${options.where}`,
                },
            });
        });
    }
}
exports.Measurement = Measurement;
exports.default = TimeSeriesDB.instance;
