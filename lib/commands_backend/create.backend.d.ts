import { IReactCMConfig } from "../types/cfg.type";
import { IReactCMTemplate } from "../types/template.type";
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
    protected template: IReactCMTemplate | null;
    protected isSingleComponent: boolean;
    constructor(cfg: IReactCMConfig, args: CreateBackendArgs, flags: CreateBackendFlags);
    createComponent(): Promise<void>;
    protected handleDir(dirFullPath: string): Promise<void>;
    protected handleFile(fileFullPath: string): Promise<void>;
    protected getFinalNewRelativePath(fileFullPath: string): string;
    protected getNewRelativePathWithSubdir(fileFullPath: string): string;
    protected applyNameReplacer(content: string, name: string): string;
    protected applyRewritesToPath(origRelPath: string, withSubDir: boolean): string;
    /**
     * @param defaultTemplateValue
     * @returns
     */
    protected getCreateSubdirProp(defaultTemplateValue: boolean): boolean;
    protected isComponentExists(): Promise<boolean>;
}
