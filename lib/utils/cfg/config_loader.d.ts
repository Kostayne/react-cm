import { IReactCMConfig } from "../../types/cfg.type";
import { IReactCMConfigFinder } from "../../interfaces/config_finder.interface";
import { IReactCMConfigLoader } from "../../interfaces/config_loader.interface";
export declare class ReactCMConfigLoader implements IReactCMConfigLoader {
    protected finder: IReactCMConfigFinder;
    constructor(finder: IReactCMConfigFinder);
    loadCfg(): Promise<IReactCMConfig>;
}
