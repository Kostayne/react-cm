import { IReactCMConfig } from "../cfg";
export interface IReactCMConfigValidator {
    verifyReactCMConfig(cgf: IReactCMConfig): ValidationRes;
}
export interface ValidationRes {
    ok: boolean;
    errMsg?: string | any;
}
export declare class ReactCMConfigValidator implements IReactCMConfigValidator {
    verifyReactCMConfig(cfg: IReactCMConfig): ValidationRes;
}
