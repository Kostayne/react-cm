import { IReactCMConfig, IReactCMconfigField } from "./cfg";
import { validateChooseArg } from "./chooseArg";
import { parseExternalJSON } from "./external_json_parser";
import { IReactCMConfigFinder } from "./config_finder";
import * as paths from "./paths";

export interface IReactCMConfigLoader {
    loadCfg(): Promise<IReactCMConfig>;
}

export class ReactCMConfigLoader implements IReactCMConfigLoader {
    protected configFinder: IReactCMConfigFinder;

    constructor(finder: IReactCMConfigFinder) {
        this.configFinder = finder;
    }

    protected fields: IReactCMconfigField<any>[] = [
        {
            name: "cTemplate",
            default: paths.cTemplatePath
        },
        {
            name: "fnTemplate",
            default: paths.fnTemplatePath
        },
        {
            name: "components",
            default: paths.componentsPath,
        }
    ]

    protected addDefaultFields(config: any): IReactCMConfig {
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
    
            if (config[field.name]) continue;
            if (field.isRequired) config[field.name] = undefined;
            if (field.default == null || field.default == undefined) continue;
    
            config[field.name] = field.default;
        }
    
        return config;
    }
    
    protected verifyConfig(config: any) {
        for (let i = 0; i < this.fields.length; i++) {
            const field = this.fields[i];
    
            if (field.chooses) validateChooseArg(config[field.name], field.chooses);
    
            if (!field.isRequired) continue;
            if (!config[field.name]) throw `Config must contain ${field.name} field`;
        }
    }

    public async loadCfg(): Promise<IReactCMConfig> {
        try {
            const cfgPath = await this.configFinder.findConfig();

            if (cfgPath == paths.packagePath) {
                const cfg = (await parseExternalJSON(cfgPath)).reactPM;
            }

            const cfg = cfgPath == paths.packagePath? (await parseExternalJSON(cfgPath)).reactPM : await parseExternalJSON(cfgPath);
            this.addDefaultFields(cfg);
            this.verifyConfig(cfg);
            return cfg;
        }
    
        catch(e) {
            if (e.code == "ENOENT") {
                console.error("config does'nt exist");
                throw(e);
            }

            return Promise.reject(e);
        }
    }
}