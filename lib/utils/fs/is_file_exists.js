"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFileExists = void 0;
const fs = require("fs");
async function isFileExists(path) {
    try {
        await fs.promises.access(path);
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isFileExists = isFileExists;
