import { IReactCMConfig } from "./cfg";
import { IReactCMConfigFinder } from "./config_finder";
export interface IReactCMConfigLoader {
    loadCfg(): Promise<IReactCMConfig>;
}
export declare class ReactCMConfigLoader implements IReactCMConfigLoader {
    protected finder: IReactCMConfigFinder;
    constructor(finder: IReactCMConfigFinder);
    loadCfg(): Promise<IReactCMConfig>;
}
