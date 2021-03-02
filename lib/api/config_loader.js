"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCMConfigLoader = void 0;
const chooseArg_1 = require("./chooseArg");
const external_json_parser_1 = require("./external_json_parser");
const paths = require("./paths");
class ReactCMConfigLoader {
    constructor(finder) {
        this.fields = [
            {
                name: "cTemplate",
            },
            {
                name: "fnTemplate",
            },
            {
                name: "components",
                default: paths.componentsPath,
            }
        ];
        this.configFinder = finder;
    }
    addDefaultFields(config) {
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            if (config[field.name])
                continue;
            if (field.isRequired)
                config[field.name] = undefined;
            if (field.default == null || field.default == undefined)
                continue;
            config[field.name] = field.default;
        }
        return config;
    }
    verifyConfig(config) {
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
            if (field.chooses)
                chooseArg_1.validateChooseArg(config[field.name], field.chooses);
            if (!field.isRequired)
                continue;
            if (!config[field.name])
                throw `Config must contain ${field.name} field`;
        }
    }
    async loadCfg() {
        try {
            const cfgPath = await this.configFinder.findConfig();
            if (cfgPath == paths.packagePath) {
                const cfg = (await external_json_parser_1.parseExternalJSON(cfgPath)).reactCM;
            }
            const cfg = cfgPath == paths.packagePath ? (await external_json_parser_1.parseExternalJSON(cfgPath)).reactCM : await external_json_parser_1.parseExternalJSON(cfgPath);
            this.addDefaultFields(cfg);
            this.verifyConfig(cfg);
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
