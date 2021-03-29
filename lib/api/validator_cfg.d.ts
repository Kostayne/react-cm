import { IReactCMConfig } from "./cfg";
export interface IReactCMConfigValidator<C extends IReactCMConfig> {
    verifyReactCMConfig(cgf: C): void;
}
export declare class ReactCMConfigValidator<C extends IReactCMConfig> implements IReactCMConfigValidator<C> {
    verifyReactCMConfig(cfg: C): void;
    protected checkBaseFields(cfg: C): void;
    protected checkTemplates(cfg: C): void;
}
