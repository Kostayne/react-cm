import { isFileExists } from "../utils/fs/is_file_exists";
import { ReactCM_UniversalTemplateNameLoader } from "../utils/template/universal_template_loader";
import { IReactCMConfig } from "../types/cfg.type";
import { IReactCMTemplate } from "../types/template.type";
import { mkDirIfNotExists } from "../utils/fs/mk_dir";
import * as path from "path";
import * as fs from "fs";

export interface CreateBackendArgs { 
    name: string;
    template: string;
}

export interface CreateBackendFlags {
    subdir?: boolean,
    out?: string
}

export interface ICreateComponentBackend {
    createComponent(): void;
}

export class CreateComponentBackend implements ICreateComponentBackend {
    protected args: CreateBackendArgs;
    protected templatePath: string = '';
    protected outDir: string = '';
    protected cfg: IReactCMConfig | null = null;
    protected flags: CreateBackendFlags;
    protected subdir: boolean = false;
    protected template: IReactCMTemplate | null = null;

    constructor(cfg: IReactCMConfig, args: CreateBackendArgs, flags: CreateBackendFlags) {
        this.flags = flags;
        this.args = args;
        this.cfg = cfg;
    }

    async createComponent() {
        if (!this.cfg) {
            return console.trace('config is null or undefined!');
        }

        const template = this.cfg.templates.find((t: IReactCMTemplate) => {
            return t.name == this.args.template;
        });

        if (!template) return console.error('there is no template with that name, check your config');

        this.template = template;
        this.templatePath = template.path;
        
        // cfg already validated, so outDir can't be undefined & we cast it to str
        const cfgOutDir = (this.template.outDir || this.cfg.defaults?.outDir) as string;
        this.outDir = this.flags.out != undefined? this.flags.out as string : cfgOutDir;

        let templateStat: fs.Stats | null = null;

        try {
            templateStat = await fs.promises.stat(this.templatePath);
        }

        catch(e: any) {
            if (e.code == 'ENOENT') {
                return console.error('Template file with provided path is not exists');
            }

            return console.error(e);
        }

        if (!templateStat) return;

        try {
            if (await this.isComponentExists(templateStat)) {
                return console.log('Already exists');
            }
        } catch(e: unknown) {
            return console.error(e);
        }

        if (templateStat.isDirectory()) {
            this.handleDir(this.templatePath);
        } else {
            this.handleFile(this.templatePath);
        }
    }

    protected async handleDir(dirFullPath: string) {
        const dirFiles = await fs.promises.readdir(dirFullPath);

        dirFiles.forEach(async (dirFileName: string) => {
            const dirFileFullPath = path.join(dirFullPath, dirFileName);
            let dirFileStat: fs.Stats | null = null;

            try {
                dirFileStat = await fs.promises.stat(dirFileFullPath);
            } catch(e) {
                return console.error(e);
            }

            if (dirFileStat.isDirectory()) {
                this.handleDir(dirFileFullPath);
            } else {
                this.handleFile(dirFileFullPath);
            }
        });
    }

    protected async handleFile(fileFullPath: string) {
        try {
            await fs.promises.stat(fileFullPath);
        } catch(e) {
            return console.error(e);
        }

        const copyBaseName = this.getProcessedCopyBaseName(fileFullPath);
        const copyFullPath = this.getNewFileRelativePath(fileFullPath, copyBaseName);
        const templateLoader = new ReactCM_UniversalTemplateNameLoader();
        
        let fileContent: string = '';

        try {
            const buffer = await fs.promises.readFile(fileFullPath);
            fileContent = await buffer.toString();
        } catch(e) {
            return console.error(e);
        }

        const processedContent = templateLoader.loadReactPMTemplate(fileContent, this.args.name);
        
        try {
            await mkDirIfNotExists(path.dirname(copyFullPath));
            await fs.promises.writeFile(copyFullPath, processedContent, { encoding: 'utf-8' });
        } catch(e) {
            return console.error(e);
        }
    }

    protected getProcessedCopyBaseName(fileFullPath: string): string {
        if (fileFullPath == this.templatePath) {
            return this.args.name + path.extname(fileFullPath);
        }

        const baseName = path.basename(fileFullPath);
        const templateLoader = new ReactCM_UniversalTemplateNameLoader();
        return templateLoader.loadReactPMTemplate(baseName, this.args.name);
    }

    protected getNewFileRelativePath(fileFullPath: string, baseName: string): string {
        if (!this.cfg) throw new Error('cfg is not set');
        if (!this.template) throw new Error('template is not set');

        // single file component case
        if (fileFullPath == this.templatePath) {
            const createSubdir = this.getCreateSubdirProp(false);

            if (createSubdir) {
                return path.join(this.outDir, this.args.name, baseName);
            }

            return path.join(this.outDir, baseName);
        }

        // complex component case
        const createSubdir = this.getCreateSubdirProp(true);

        const parentDir = path.dirname(fileFullPath);
        const renamedFileFullPath = path.join(parentDir, baseName); 
        const relativePath = path.relative(this.templatePath, renamedFileFullPath);

        if (createSubdir) {
            return path.join(this.outDir, this.args.name, relativePath);
        }

        return path.join(this.outDir, relativePath);
    }

    protected getCreateSubdirProp(defaultTemplateValue: boolean): boolean {
        if (!this.template) {
            throw new Error('template is not set');
        }

        let createSubdir = this.template.subDir;

        if (createSubdir == undefined) {
            createSubdir = defaultTemplateValue;
        }

        if (this.flags.subdir != undefined) {
            createSubdir = this.flags.subdir;
        }

        return createSubdir as boolean;
    }

    protected async isComponentExists(templateStat: fs.Stats): Promise<boolean> {
        if (!this.cfg) return Promise.reject(new Error('Cfg is not set'));

        if (templateStat.isDirectory()) {
            return await isFileExists(path.join(this.outDir, this.args.name));
        } else {
            const ext = path.extname(this.templatePath);
            return await isFileExists(path.join(this.outDir, this.args.name + ext));
        }
    }
}
