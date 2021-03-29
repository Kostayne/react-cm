"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCMConfigLoader = void 0;
const external_json_parser_1 = require("./external_json_parser");
const paths = require("./paths");
class ReactCMConfigLoader {
    constructor(finder, validator) {
        this.defaultFields = {
            components: paths.componentsPath
        };
        this.finder = finder;
        this.validator = validator;
    }
    addDefaultFields(config) {
        return Object.assign(Object.assign({}, this.defaultFields), config);
    }
    async loadCfg() {
        try {
            const cfgPath = await this.finder.findConfig();
            if (cfgPath == paths.packagePath) {
                const cfg = (await external_json_parser_1.parseExternalJSON(cfgPath)).reactCM;
            }
            const cfg = cfgPath == paths.packagePath ? (await external_json_parser_1.parseExternalJSON(cfgPath)).reactCM : await external_json_parser_1.parseExternalJSON(cfgPath);
            this.addDefaultFields(cfg);
            this.validator.verifyReactCMConfig(cfg);
            return cfg;
        }
        catch (e) {
            if (e.code == "ENOENT") {
                console.error("config does'nt exist");
                throw (e);
            }
            return Promise.reject(e);
        }
    }
}
exports.ReactCMConfigLoader = ReactCMConfigLoader;
