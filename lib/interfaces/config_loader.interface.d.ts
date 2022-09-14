import { IReactCMConfig } from "../types/cfg.type";
export interface IReactCMConfigLoader {
    loadCfg(): Promise<IReactCMConfig>;
}
