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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
const account_1 = require("./data/models/account");
const summary_1 = require("./data/models/summary");
const fetchAssets = (client) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        name: client.name(),
        assets: yield client.totalAssets()
    };
});
class Logger {
    constructor(clients) {
        this.clients = clients;
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.log();
            setInterval(this.log.bind(this), 10000);
        });
    }
    log() {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const points = (yield Promise.all(this.clients.map(fetchAssets)))
                .map(assets => ({
                tags: {
                    exchange: assets.name
                },
                fields: {
                    assets: assets.assets
                },
                timestamp: now
            }));
            const sum = points.reduce((acc, curr) => acc + curr.fields.assets, 0);
            account_1.Account.writePoints(points);
            summary_1.Summary.writePoint({
                tags: {},
                fields: {
                    total_assets: sum
                },
                timestamp: now
            });
            // console.log(data)
            console.log('Total: ', sum);
        });
    }
}
exports.Logger = Logger;
