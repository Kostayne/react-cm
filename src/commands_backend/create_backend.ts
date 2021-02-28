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
                return Promise.reject(new Error("Template not exists"));
            }

            return Promise.reject(e);
        }

        if (!templateStat) return;
    }

    protected async processFile(filePath: string, rename: boolean) {
        
    }

    protected async createComplexComponent() {
        
    }

    protected async handleNestedFile(filePath: string) {
        
    }
}