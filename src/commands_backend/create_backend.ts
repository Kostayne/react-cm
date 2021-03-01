import { IReactPMConfigLoader } from "../api/config_loader";
import { isFileExists } from "../api/is_file_exists";
import { IReactPMTeplateLoader, ReactPMTemplateLoader, ReactPM_TSX_TemplateLoader } from "../api/template_loader";
import { IReactPMConfig } from "../api/cfg";
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
    protected cfgLoader: IReactPMConfigLoader;
    protected args: CreateBackendArgs;
    protected templatePath: string = "";
    protected cfg: IReactPMConfig | null = null;

    constructor(cfgLoader: IReactPMConfigLoader, args: CreateBackendArgs) {
        this.cfgLoader = cfgLoader;
        this.args = args;
    }

    async createComponent() {
        this.cfg = await this.cfgLoader.loadCfg();
        this.templatePath = this.args.basedOn == "class"? this.cfg.cTemplate : this.cfg.fnTemplate;

        let templateStat: fs.Stats | null = null;

        try {
            templateStat = await fs.promises.stat(this.templatePath);
        }

        catch(e) {
            if (e.code == "ENOENT") {
                return Promise.reject(new Error("Template not exists"));
            }

            return Promise.reject(e);
        }

        if (!templateStat) return;

        if (await this.isComponentExists(templateStat)) return console.log("Already exists");

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
                Promise.reject(e);
                if (!dirFileStat) return;
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
            return Promise.reject(e);
        }

        const copyBaseName = this.getCopyBaseName(fileFullPath);
        const copyFullPath = this.getFilePath(fileFullPath, copyBaseName); // console.log(`copy path: ${copyFullPath}`);
        const tLoader = this.getFileTemplateLoader(fileFullPath);

        let fileContent: string = "";

        try {
            fileContent = await (await fs.promises.readFile(fileFullPath)).toString();
        } catch(e) {
            return Promise.reject(e);
        }

        const processedContent = tLoader.loadReactPMTemplate(fileContent, this.args.name);
        
        try {
            await this.mkDirIfNotExists(path.dirname(copyFullPath));
            await fs.promises.writeFile(copyFullPath, processedContent, { encoding: "utf-8" });
        } catch(e) {
            return Promise.reject(e);
        }
    }

    protected getCopyBaseName(fileFullPath: string): string {
        if (fileFullPath == this.templatePath) {
            return this.args.name + path.extname(fileFullPath);
        }

        const baseName = path.basename(fileFullPath);
        const templateLoader = new ReactPMTemplateLoader();
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

    protected getFileTemplateLoader(fileFullPath: string): IReactPMTeplateLoader {
        if (/\.(js||jsx||ts||tsx)$/.test(fileFullPath)) return new ReactPM_TSX_TemplateLoader();
        return new ReactPMTemplateLoader();
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