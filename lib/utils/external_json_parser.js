"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseExternalJSON = void 0;
const fs = require("fs");
async function parseExternalJSON(path) {
    try {
        const data = await (await fs.promises.readFile(path)).toString();
        const parsedData = JSON.parse(data);
        return parsedData;
    }
    catch (e) {
        console.error(e);
        throw e;
    }
}
exports.parseExternalJSON = parseExternalJSON;
