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
    protected templatePath: string = '';
    protected outDir: string = '';
    protected subdir: boolean = false;
    protected template: IReactCMTemplate | null = null;

    constructor(
        protected cfg: IReactCMConfig,
        protected args: CreateBackendArgs, 
        protected flags: CreateBackendFlags
    ) {
        this.flags = flags;
        this.args = args;
    }

    async createComponent() {
        if (!this.cfg) {
            return console.error('config is null or undefined!');
        }

        const template = this.cfg.templates.find((t: IReactCMTemplate) => {
            return t.name == this.args.template;
        });

        if (!template) { 
            console.error('There is no template with that name, check your config');
            console.error('Templates listed in config: ', this.cfg.templates);
            return;
        };

        this.template = template;
        this.templatePath = template.path;
        
        // cfg already validated, so outDir can't be undefined & we cast it to str
        const cfgOutDir = (this.template.outDir || this.cfg.defaults?.outDir) as string;

        // cli parameter prioritet
        this.outDir = this.flags.out || cfgOutDir;

        // replace aliases
        const cfgPaths = this.cfg.paths || [];
        
        cfgPaths.forEach(p => {
            this.templatePath = this.templatePath.replace(p.name, p.value);
        });

        cfgPaths.forEach(p => {
            this.outDir = this.outDir.replace(p.name, p.value);
        });

        let templateStat: fs.Stats | null = null;

        // check that we can read the folder
        // (we have permissions and the folder exists)
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

        const copyBaseName = this.getNewBaseName(fileFullPath);
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

    /**
     * @param fileFullPath 
     * @returns relativePath
     */
    protected getNewBaseName(fileFullPath: string): string {
        // single file components case
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

    /**
     * @param defaultTemplateValue 
     * @returns 
     */
    protected getCreateSubdirProp(defaultTemplateValue: boolean): boolean {
        if (!this.template) {
            throw new Error('template is not set');
        }

        // get value from template
        let createSubdir = this.template.subDir;

        // if value not set in the template, use default value for current template type (file | complex)
        if (createSubdir == undefined) {
            createSubdir = defaultTemplateValue;
        }

        // get value from cli
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
