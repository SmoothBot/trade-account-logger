"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Summary = void 0;
const influx2_1 = require("../influx2");
const name = 'summary_v1';
exports.Summary = new influx2_1.Measurement(name);
