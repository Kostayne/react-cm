"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCMConfigLoader = void 0;
const paths = require("../../paths");
const external_json_parser_1 = require("../external_json_parser");
class ReactCMConfigLoader {
    constructor(finder) {
        this.finder = finder;
    }
    async loadCfg() {
        try {
            const cfgPath = await this.finder.findConfigPath();
            const cfgJson = await (0, external_json_parser_1.parseExternalJSON)(cfgPath);
            return cfgPath == paths.packagePath ? cfgJson.reactCM : cfgJson;
        }
        catch (e) {
            if (e.code == 'ENOENT') {
                console.error('config does\'nt exist');
                throw (e);
            }
            return Promise.reject(e);
        }
    }
}
exports.ReactCMConfigLoader = ReactCMConfigLoader;
