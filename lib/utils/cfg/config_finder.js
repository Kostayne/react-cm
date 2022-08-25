"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCMConfigFinder = void 0;
const paths = require("../../paths");
const is_file_exists_1 = require("../fs/is_file_exists");
const external_json_parser_1 = require("../external_json_parser");
class ReactCMConfigFinder {
    async isCfgInNpmPackage() {
        const userPackage = await (0, external_json_parser_1.parseExternalJSON)(paths.packagePath);
        return userPackage.reactCM != null && userPackage.reactCM != undefined && typeof userPackage.reactCM == "object";
    }
    async findConfigPath() {
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
