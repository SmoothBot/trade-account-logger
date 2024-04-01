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
exports.Gate = void 0;
const settings_1 = require("../utils/settings");
const ccxt_1 = require("ccxt");
class Gate {
    constructor() {
        this.client = new ccxt_1.gate({
            apiKey: settings_1.Settings.get('GATE_IO_KEY'),
            secret: settings_1.Settings.get('GATE_IO_SECRET'),
        });
    }
    static create() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Gate();
        });
    }
    name() {
        return 'Gate';
    }
    totalAssets() {
        return __awaiter(this, void 0, void 0, function* () {
            const gateBalance = yield this.client.privateWalletGetTotalBalance();
            return parseFloat(gateBalance.total.amount);
        });
    }
}
exports.Gate = Gate;
