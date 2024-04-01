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
exports.Bybit = void 0;
const settings_1 = require("../utils/settings");
const ccxt_1 = require("ccxt");
class Bybit {
    constructor() {
        this.client = new ccxt_1.bybit({
            apiKey: settings_1.Settings.get('BYBIT_KEY'),
            secret: settings_1.Settings.get('BYBIT_SECRET'),
        });
    }
    static create() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Bybit();
        });
    }
    name() {
        return 'Bybit';
    }
    totalAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            const bybitBalance = yield this.client.privateGetV5AccountWalletBalance({
                accountType: 'UNIFIED'
            });
            return parseFloat(bybitBalance.result.list[0].totalEquity);
        });
    }
}
exports.Bybit = Bybit;
