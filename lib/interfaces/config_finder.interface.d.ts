export interface IReactCMConfigFinder {
    findConfigPath(): Promise<string>;
}
