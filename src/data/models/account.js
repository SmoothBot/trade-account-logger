"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Account = void 0;
const influx2_1 = require("../influx2");
const name = 'account_v1';
exports.Account = new influx2_1.Measurement(name);
