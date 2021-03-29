/// <reference types="node" />
import { IReactCMConfigLoader } from "../api/config_loader";
import { IReactCMConfig } from "../api/cfg";
import * as fs from "fs";
export interface CreateBackendArgs {
    name: string;
    basedOn: string;
}
export interface ICreateComponentBackend {
    createComponent(): void;
}
export declare class CreateComponentBackend implements ICreateComponentBackend {
    protected cfgLoader: IReactCMConfigLoader;
    protected args: CreateBackendArgs;
    protected templatePath: string;
    protected cfg: IReactCMConfig | null;
    constructor(cfgLoader: IReactCMConfigLoader, args: CreateBackendArgs);
    createComponent(): Promise<void>;
    protected handleDir(dirFullPath: string): Promise<void>;
    protected handleFile(fileFullPath: string): Promise<void>;
    protected getCopyBaseName(fileFullPath: string): string;
    protected getFilePath(fileFullPath: string, baseName: string): string;
    protected mkDirIfNotExists(path: string): Promise<void>;
    protected isComponentExists(templateStat: fs.Stats): Promise<boolean>;
}
