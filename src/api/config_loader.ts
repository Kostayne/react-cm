import { IReactPMConfig, IReactPMconfigField } from "./cfg";
import { validateChooseArg } from "./chooseArg";
import { parseExternalJSON } from "./external_json_parser";
import { IReactPMConfigFinder } from "./config_finder";
import * as paths from "./paths";

export interface IReactPMConfigLoader {
    loadCfg(): Promise<IReactPMConfig>;
}

export class ReactPMConfigLoader implements IReactPMConfigLoader {
    protected configFinder: IReactPMConfigFinder;

    constructor(finder: IReactPMConfigFinder) {
        this.configFinder = finder;
    }

    protected fields: IReactPMconfigField<any>[] = [
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

    protected addDefaultFields(config: any): IReactPMConfig {
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

    public async loadCfg(): Promise<IReactPMConfig> {
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
    
            console.error(e);
            throw e;
        }
    }
}