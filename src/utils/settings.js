"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Settings = void 0;
require("dotenv/config");
class Settings {
    static get(setting) {
        if (!process.env[setting]) {
            throw new Error(`ENV: ${setting} not configured`);
        }
        return process.env[setting];
    }
}
exports.Settings = Settings;
