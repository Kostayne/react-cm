"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCMConfigLoader = void 0;
const external_json_parser_1 = require("./utils/external_json_parser");
const paths = require("./paths");
class ReactCMConfigLoader {
    constructor(finder) {
        this.finder = finder;
    }
    async loadCfg() {
        try {
            const cfgPath = await this.finder.findConfig();
            const cfgJson = await (0, external_json_parser_1.parseExternalJSON)(cfgPath);
            const cfg = cfgPath == paths.packagePath ? cfgJson.reactCM : cfgJson;
            return cfg;
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
