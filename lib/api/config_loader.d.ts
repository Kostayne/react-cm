import { IReactCMConfig } from "./cfg";
import { IReactCMConfigValidator } from "./validator_cfg";
import { IReactCMConfigFinder } from "./config_finder";
export interface IReactCMConfigLoader {
    loadCfg(): Promise<IReactCMConfig>;
}
export declare class ReactCMConfigLoader implements IReactCMConfigLoader {
    protected finder: IReactCMConfigFinder;
    protected validator: IReactCMConfigValidator<IReactCMConfig>;
    protected defaultFields: {
        components: string;
    };
    constructor(finder: IReactCMConfigFinder, validator: IReactCMConfigValidator<IReactCMConfig>);
    protected addDefaultFields(config: any): IReactCMConfig;
    loadCfg(): Promise<IReactCMConfig>;
}
