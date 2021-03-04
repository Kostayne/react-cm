import { IReactCMConfigLoader } from "../api/config_loader";
import { isFileExists } from "../api/is_file_exists";
import { IReactCMTeplateLoader, ReactCMTemplateLoader, ReactCM_TSX_TemplateLoader } from "../api/template_loader";
import { IReactCMConfig, IReactCMTemplate } from "../api/cfg";
import * as path from "path";
import * as fs from "fs";

export interface CreateBackendArgs {
    name: string;
    basedOn: string;
}

export interface ICreateComponentBackend {
    createComponent(): void;
}

export class CreateComponentBackend implements ICreateComponentBackend {
    protected cfgLoader: IReactCMConfigLoader;
    protected args: CreateBackendArgs;
    protected templatePath: string = "";
    protected cfg: IReactCMConfig | null = null;

    constructor(cfgLoader: IReactCMConfigLoader, args: CreateBackendArgs) {
        this.cfgLoader = cfgLoader;
        this.args = args;
    }

    async createComponent() {
        try {
            this.cfg = await this.cfgLoader.loadCfg();
        } catch(e) {
            return console.error(e);
        }

        const template = this.cfg.templates.find((t: IReactCMTemplate) => {
            return t.name == this.args.basedOn;
        });

        if (!template) return console.error("there is no template with that name, check your config");
        this.templatePath = template.path;

        let templateStat: fs.Stats | null = null;
        try {
            templateStat = await fs.promises.stat(this.templatePath);
        }

        catch(e) {
            if (e.code == "ENOENT") {
                return console.error("Template file with provided path is not exists");
            }

            return console.error(e);
        }

        if (!templateStat) return;

        try {
            if (await this.isComponentExists(templateStat)) return console.log("Already exists");
        } catch(e) {
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
        let fileStat: fs.Stats | null = null;

        try {
            fileStat = await fs.promises.stat(fileFullPath);
        } catch(e) {
            return console.error(e);
        }

        const copyBaseName = this.getCopyBaseName(fileFullPath);
        const copyFullPath = this.getFilePath(fileFullPath, copyBaseName); // console.log(`copy path: ${copyFullPath}`);
        const tLoader = this.getFileTemplateLoader(fileFullPath);

        let fileContent: string = "";

        try {
            fileContent = await (await fs.promises.readFile(fileFullPath)).toString();
        } catch(e) {
            return console.error(e);
        }

        const processedContent = tLoader.loadReactPMTemplate(fileContent, this.args.name);
        
        try {
            await this.mkDirIfNotExists(path.dirname(copyFullPath));
            await fs.promises.writeFile(copyFullPath, processedContent, { encoding: "utf-8" });
        } catch(e) {
            return console.error(e);
        }
    }

    protected getCopyBaseName(fileFullPath: string): string {
        if (fileFullPath == this.templatePath) {
            return this.args.name + path.extname(fileFullPath);
        }

        const baseName = path.basename(fileFullPath);
        const templateLoader = new ReactCMTemplateLoader();
        return templateLoader.loadReactPMTemplate(baseName, this.args.name);
    }

    protected getFilePath(fileFullPath: string, baseName: string): string {
        if (!this.cfg) throw new Error("cfg is not set");

        if (fileFullPath == this.templatePath) {
            return path.join(this.cfg.components, baseName);
        }

        const parentDir = path.dirname(fileFullPath);
        const renamedFileFullPath = path.join(parentDir, baseName); 
        const relativePath = path.relative(this.templatePath, renamedFileFullPath);
        return path.join(this.cfg.components, this.args.name, relativePath);
    }

    protected getFileTemplateLoader(fileFullPath: string): IReactCMTeplateLoader {
        if (/\.(js||jsx||ts||tsx)$/.test(fileFullPath)) return new ReactCM_TSX_TemplateLoader();
        return new ReactCMTemplateLoader();
    }

    protected async mkDirIfNotExists(path: string) {
        try {
            await fs.promises.access(path);
        } catch(e) {
            if (e.code == "ENOENT") {
                return await fs.promises.mkdir(path, { recursive: true });
            }
        }
    }

    protected async isComponentExists(templateStat: fs.Stats): Promise<boolean> {
        if (!this.cfg) return Promise.reject(new Error("Cfg is not set"));

        if (templateStat.isDirectory()) {
            return await isFileExists(path.join(this.cfg.components, this.args.name));
        } else {
            const ext = path.extname(this.templatePath);
            return await isFileExists(path.join(this.cfg.components, this.args.name + ext));
        }
    }
}