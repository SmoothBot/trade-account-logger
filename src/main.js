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
require("dotenv/config");
const gate_1 = require("./exchanges/gate");
const bybit_1 = require("./exchanges/bybit");
const logger_1 = require("./logger");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const gate = yield gate_1.Gate.create();
    const bybit = yield bybit_1.Bybit.create();
    const gateBal = yield gate.totalAssets();
    const bybitBal = yield bybit.totalAssets();
    const logger = new logger_1.Logger([gate, bybit]);
    yield logger.start();
    // console.log('Gate:  ', gateBal)
    // console.log('Bybit: ', bybitBal)
    // console.log(gateBal + bybitBal)
});
main();
