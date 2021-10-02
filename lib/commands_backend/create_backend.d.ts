/// <reference types="node" />
import { IReactCMConfig } from "../cfg";
import { CmdFlag } from '../types';
import * as fs from "fs";
export interface CreateBackendArgs {
    name: string;
    template: string;
}
export interface ICreateComponentBackend {
    createComponent(): void;
}
export declare class CreateComponentBackend implements ICreateComponentBackend {
    protected args: CreateBackendArgs;
    protected templatePath: string;
    protected outDir: string;
    protected cfg: IReactCMConfig | null;
    protected flags: CmdFlag;
    constructor(cfg: IReactCMConfig, args: CreateBackendArgs, flags: {
        [name: string]: string | number;
    });
    createComponent(): Promise<void>;
    protected handleDir(dirFullPath: string): Promise<void>;
    protected handleFile(fileFullPath: string): Promise<void>;
    protected getCopyBaseName(fileFullPath: string): string;
    protected getFilePath(fileFullPath: string, baseName: string): string;
    protected mkDirIfNotExists(path: string): Promise<void>;
    protected isComponentExists(templateStat: fs.Stats): Promise<boolean>;
}
