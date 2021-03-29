export interface IReactCMConfigFinder {
    findConfig(): Promise<string>;
}
export declare class ReactCMConfigFinder implements IReactCMConfigFinder {
    protected isCfgInNpmPackage(): Promise<boolean>;
    findConfig(): Promise<string>;
}
