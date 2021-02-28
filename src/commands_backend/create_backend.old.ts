import { IReactPMConfigLoader } from "../api/config_loader";
import { isFileExists } from "../api/is_file_exists";
import { ReactPMTemplateLoader, ReactPM_TSX_TemplateLoader } from "../api/template_loader";
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
                console.error("Template not exists");
                return;
            }
        }

        if (!templateStat) return;

        if (templateStat.isDirectory()) {
            await this.createComplexComponent();
        } else {
            await this.processFile(this.templatePath, true);
        }
    }

    protected async processFile(filePath: string, rename: boolean) {
        // filePath is full path
        if (!this.cfg) throw "Cfg is null";

        const templateStat = await fs.promises.stat(this.templatePath);

        const fileName = path.basename(filePath) + path.extname(filePath);
        let newComponentPath = path.join(this.cfg.components, fileName);

        if (rename) {
            const templateExt = path.extname(this.templatePath);
            const renamedFullName = this.args.name + templateExt;
            newComponentPath = path.join(this.cfg.components, renamedFullName);
        }

        let templatePathToRead: string = "";

        if (templateStat.isDirectory()) {
            templatePathToRead = filePath;
        } else {
            templatePathToRead = this.templatePath;
        }

        const templateContent = (await fs.promises.readFile(templatePathToRead)).toString();
        const tsxTemplateLoader = new ReactPM_TSX_TemplateLoader();
        const newComponentContent = tsxTemplateLoader.loadReactPMTemplate(templateContent, this.args.name);

        if (await isFileExists(newComponentPath)) return console.log("already exists");
        await fs.promises.writeFile(newComponentPath, newComponentContent, { encoding: "utf-8" });
    }

    protected async createComplexComponent() {
        if (!this.cfg) throw "Cfg is null";
        try {
            const templateDirStat = await fs.promises.readdir(this.templatePath);
            templateDirStat.forEach(async (relNestedPath: string) => {
                await this.handleNestedFile(path.join(this.templatePath, relNestedPath));
            });
        }

        catch(e) {
            if (e.code == "ENOENT") {
                console.error("template dir not exists");
            }

            return;
        }
    }

    protected async handleNestedFile(filePath: string) {
        // filePath is full path
        const stat = await fs.promises.stat(filePath);

        if (stat.isDirectory()) {
            const dirStat = await fs.promises.readdir(filePath);

            dirStat.forEach(async (nestedPath: string) => {
                if (!this.cfg) return;
                const relPath = path.relative(this.templatePath, filePath);
                const fullPath = path.join(this.templatePath, relPath);
                await this.handleNestedFile(fullPath);
            });

            return;
        }

        if (!this.cfg) return;
        
        // handle file
        const nestedRelName = path.relative(this.templatePath, filePath);
        const templateLoader = new ReactPMTemplateLoader();
        const processedName = templateLoader.loadReactPMTemplate(nestedRelName, this.args.name);
        const fullPath = path.join(this.templatePath, processedName);
        await this.processFile(fullPath, false);
    }
}