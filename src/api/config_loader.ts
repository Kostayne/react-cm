import { IReactCMConfig } from "./cfg";
import { IReactCMConfigValidator } from "./validator_cfg";
import { parseExternalJSON } from "./external_json_parser";
import { IReactCMConfigFinder } from "./config_finder";
import * as paths from "./paths";

export interface IReactCMConfigLoader {
    loadCfg(): Promise<IReactCMConfig>;
}

export class ReactCMConfigLoader implements IReactCMConfigLoader {
    protected finder: IReactCMConfigFinder;
    protected validator: IReactCMConfigValidator<IReactCMConfig>;
    protected defaultFields = {
        components: paths.componentsPath
    };

    constructor(finder: IReactCMConfigFinder, validator: IReactCMConfigValidator<IReactCMConfig>) {
        this.finder = finder;
        this.validator = validator;
    }

    protected addDefaultFields(config: any): IReactCMConfig {
        return { ...this.defaultFields, ...config };
    }

    public async loadCfg(): Promise<IReactCMConfig> {
        try {
            const cfgPath = await this.finder.findConfig();

            if (cfgPath == paths.packagePath) {
                const cfg = (await parseExternalJSON(cfgPath)).reactCM;
            }

            const cfg = cfgPath == paths.packagePath? (await parseExternalJSON(cfgPath)).reactCM : await parseExternalJSON(cfgPath);
            this.addDefaultFields(cfg);
            this.validator.verifyReactCMConfig(cfg);
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