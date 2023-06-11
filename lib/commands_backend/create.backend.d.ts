import { IReactCMConfig } from "../types/cfg.type";
import { IReactCMTemplate } from "../types/template.type";
import { IAutoArch } from "../types/auto_arch.type";
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
    protected cfg: IReactCMConfig;
    protected args: CreateBackendArgs;
    protected flags: CreateBackendFlags;
    protected templatePath: string;
    protected outDir: string;
    protected subDir: boolean;
    protected isSingleFileComponent: boolean;
    protected template: IReactCMTemplate;
    constructor(cfg: IReactCMConfig, args: CreateBackendArgs, flags: CreateBackendFlags);
    createComponent(): Promise<void>;
    protected handleDir(dirFullPath: string): Promise<void>;
    protected handleFile(fileFullPath: string): Promise<void>;
    protected getFinalNewRelPathToOutDir(templateFileFullPath: string): string;
    protected applyNameReplacer(content: string, name: string): string;
    protected setupFinalOutDir(): void;
    protected getFinalSubdirProp(defaultTemplateValue: boolean): boolean;
    protected isComponentExists(): Promise<boolean>;
    protected getUsedArches(archNames: string[]): IAutoArch[];
}
