import { isFileExists } from "../utils/is_file_exists";
import { ReactCM_UniversalTemplateLoader } from "../template_loader";
import { IReactCMConfig, IReactCMTemplate } from "../cfg";
import { CmdFlag } from '../types';
import * as path from "path";
import * as fs from "fs";

export interface CreateBackendArgs { 
    name: string;
    template: string;
}

export interface ICreateComponentBackend {
    createComponent(): void;
}

export class CreateComponentBackend implements ICreateComponentBackend {
    protected args: CreateBackendArgs;
    protected templatePath: string = '';
    protected outDir: string = '';
    protected cfg: IReactCMConfig | null = null;
    protected flags: CmdFlag;

    constructor(cfg: IReactCMConfig, args: CreateBackendArgs, flags: { [name: string]: string | number }) {
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
        this.templatePath = template.path;
        this.outDir = this.flags.out? this.flags.out as string : template.outDir;

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

        const copyBaseName = this.getCopyBaseName(fileFullPath);
        const copyFullPath = this.getFilePath(fileFullPath, copyBaseName);
        const tLoader = new ReactCM_UniversalTemplateLoader();
        
        let fileContent: string = '';

        try {
            fileContent = await (await fs.promises.readFile(fileFullPath)).toString();
        } catch(e) {
            return console.error(e);
        }

        const processedContent = tLoader.loadReactPMTemplate(fileContent, this.args.name);
        
        try {
            await this.mkDirIfNotExists(path.dirname(copyFullPath));
            await fs.promises.writeFile(copyFullPath, processedContent, { encoding: 'utf-8' });
        } catch(e) {
            return console.error(e);
        }
    }

    protected getCopyBaseName(fileFullPath: string): string {
        if (fileFullPath == this.templatePath) {
            return this.args.name + path.extname(fileFullPath);
        }

        const baseName = path.basename(fileFullPath);
        const templateLoader = new ReactCM_UniversalTemplateLoader();
        return templateLoader.loadReactPMTemplate(baseName, this.args.name);
    }

    protected getFilePath(fileFullPath: string, baseName: string): string {
        if (!this.cfg) throw new Error('cfg is not set');

        if (fileFullPath == this.templatePath) {
            return path.join(this.outDir, baseName);
        }

        const parentDir = path.dirname(fileFullPath);
        const renamedFileFullPath = path.join(parentDir, baseName); 
        const relativePath = path.relative(this.templatePath, renamedFileFullPath);
        return path.join(this.outDir, this.args.name, relativePath);
    }

    protected async mkDirIfNotExists(path: string) {
        try {
            await fs.promises.access(path);
        } catch(e: any) {
            if (e.code == 'ENOENT') {
                return await fs.promises.mkdir(path, { recursive: true });
            }
        }
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
