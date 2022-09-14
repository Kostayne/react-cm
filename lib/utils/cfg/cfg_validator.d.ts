import { IReactCMConfig } from "../../types/cfg.type";
export interface IReactCMConfigValidator {
    validateReactCMConfig(cgf: IReactCMConfig): string | undefined;
}
export declare class ReactCMConfigValidator implements IReactCMConfigValidator {
    validateReactCMConfig(cfg: IReactCMConfig): string | undefined;
}
