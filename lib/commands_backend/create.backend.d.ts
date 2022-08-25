/// <reference types="node" />
import { IReactCMConfig } from "../types/cfg.type";
import { IReactCMTemplate } from "../types/template.type";
import * as fs from "fs";
export interface CreateBackendArgs {
    name: string;
    template: string;
}
export interface CreateBackendFlags {
    subdir?: boolean;
    out?: string;
}
export interface ICreateComponentBackend {
    createComponent(): void;
}
export declare class CreateComponentBackend implements ICreateComponentBackend {
    protected args: CreateBackendArgs;
    protected templatePath: string;
    protected outDir: string;
    protected cfg: IReactCMConfig | null;
    protected flags: CreateBackendFlags;
    protected subdir: boolean;
    protected template: IReactCMTemplate | null;
    constructor(cfg: IReactCMConfig, args: CreateBackendArgs, flags: CreateBackendFlags);
    createComponent(): Promise<void>;
    protected handleDir(dirFullPath: string): Promise<void>;
    protected handleFile(fileFullPath: string): Promise<void>;
    protected getProcessedCopyBaseName(fileFullPath: string): string;
    protected getNewFileRelativePath(fileFullPath: string, baseName: string): string;
    protected getCreateSubdirProp(defaultTemplateValue: boolean): boolean;
    protected isComponentExists(templateStat: fs.Stats): Promise<boolean>;
}
