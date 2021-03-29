import { IReactCMConfig } from "../api/cfg";
import { IReactCMConfigLoader } from "../api/config_loader";
export interface IRemoveBackend {
    removeComponent(): void;
}
export interface RemoveBackendArgs {
    name: string;
}
export declare class RemoveBackend implements IRemoveBackend {
    protected cfgLoader: IReactCMConfigLoader;
    protected args: RemoveBackendArgs;
    protected cfg: IReactCMConfig | null;
    constructor(cfgLoader: IReactCMConfigLoader, args: RemoveBackendArgs);
    removeComponent(): Promise<void>;
    protected toGlobSlashes(pattern: string): string;
}
