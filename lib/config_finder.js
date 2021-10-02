"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCMConfigFinder = void 0;
const is_file_exists_1 = require("./utils/is_file_exists");
const external_json_parser_1 = require("./utils/external_json_parser");
const paths = require("./paths");
class ReactCMConfigFinder {
    async isCfgInNpmPackage() {
        const userPackage = await (0, external_json_parser_1.parseExternalJSON)(paths.packagePath);
        return userPackage.reactCM != null && userPackage.reactCM != undefined && typeof userPackage.reactCM == "object";
    }
    async findConfig() {
        const seperateCfgExists = await (0, is_file_exists_1.isFileExists)(paths.configPath);
        const npmPackageCfgExists = await this.isCfgInNpmPackage();
        if (seperateCfgExists)
            return paths.configPath;
        if (npmPackageCfgExists)
            return paths.packagePath;
        return Promise.reject(new Error("Config not found"));
    }
}
exports.ReactCMConfigFinder = ReactCMConfigFinder;
