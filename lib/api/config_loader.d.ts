import { IReactCMConfig, IReactCMconfigField } from "./cfg";
import { IReactCMConfigFinder } from "./config_finder";
export interface IReactCMConfigLoader {
    loadCfg(): Promise<IReactCMConfig>;
}
export declare class ReactCMConfigLoader implements IReactCMConfigLoader {
    protected configFinder: IReactCMConfigFinder;
    constructor(finder: IReactCMConfigFinder);
    protected fields: IReactCMconfigField<any>[];
    protected addDefaultFields(config: any): IReactCMConfig;
    protected verifyConfig(config: any): void;
    loadCfg(): Promise<IReactCMConfig>;
}
