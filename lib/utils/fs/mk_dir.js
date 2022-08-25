"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mkDirIfNotExists = void 0;
const fs = require("fs");
async function mkDirIfNotExists(path) {
    try {
        await fs.promises.access(path);
    }
    catch (e) {
        if (e.code == 'ENOENT') {
            return await fs.promises.mkdir(path, { recursive: true });
        }
    }
}
exports.mkDirIfNotExists = mkDirIfNotExists;
