import { IReactCMConfigFinder } from "../../interfaces/config_finder.interface";
export declare class ReactCMConfigFinder implements IReactCMConfigFinder {
    protected isCfgInNpmPackage(): Promise<boolean>;
    findConfigPath(): Promise<string>;
}
