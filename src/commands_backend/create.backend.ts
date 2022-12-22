import * as fs from "fs";
import * as path from "path";
import { isFileExists } from "../utils/fs/is_file_exists";
import { ReactCM_UniversalTemplateNameLoader } from "../utils/template/universal_template_loader";
import { IReactCMConfig } from "../types/cfg.type";
import { IReactCMTemplate } from "../types/template.type";
import { mkDirIfNotExists } from "../utils/fs/mk_dir";

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
    protected subDir: boolean = false;
    protected template: IReactCMTemplate | null = null;
    protected isSingleComponent = false;

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
        const cfgPaths = this.cfg.paths || [];
        
        // apply aliases to templatePath
        cfgPaths.forEach(p => {
            this.templatePath = this.templatePath.replace(p.name, p.value);
        });

        // apply aliases to outDir
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
            if (await this.isComponentExists()) {
                return console.log('Already exists');
            }
        } catch(e: unknown) {
            return console.error(e);
        }

        if (templateStat.isDirectory()) {
            this.isSingleComponent = false;
            this.handleDir(this.templatePath);
        } else {
            this.isSingleComponent = true;
            this.handleFile(this.templatePath);
        }
    }

    protected async handleDir(dirFullPath: string) {
        const dirFiles = await fs.promises.readdir(dirFullPath);

        dirFiles.forEach(async (dirFileName: string) => {
            const dirFileFullPath = path.join(dirFullPath, dirFileName);
            let dirFileStat: fs.Stats | null = null;

            try {
                // check for nested file or dir access
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

        const newRelPath = this.getFinalNewRelativePath(fileFullPath);
        const outFullPath = path.join(this.outDir, newRelPath);
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
            await mkDirIfNotExists(path.dirname(outFullPath));
            await fs.promises.writeFile(outFullPath, processedContent, { encoding: 'utf-8' });
        } catch(e) {
            return console.error(e);
        }
    }

    protected getFinalNewRelativePath(fileFullPath: string): string {
        // create subdir if needed
        let finalRelPath = this.getNewRelativePathWithSubdir(fileFullPath);
        finalRelPath = this.applyRewritesToPath(finalRelPath, !this.isSingleComponent);

        // replace file name to components name
        finalRelPath = this.applyNameReplacer(finalRelPath, this.args.name);

        return finalRelPath;
    }

    protected getNewRelativePathWithSubdir(fileFullPath: string): string {
        const origRelPath = path.relative(this.templatePath, fileFullPath);
        const createSubDir = this.getCreateSubdirProp(!this.isSingleComponent);
        const extName = path.extname(fileFullPath);

        if (createSubDir) {
            if (this.isSingleComponent) {
                return path.join(this.args.name, this.args.name + extName);
            }

            // complex component with subdir case
            return path.join(this.args.name, origRelPath);
        }

        // single component case with subDir == false
        // compex component case with subDir == false
        return this.args.name + extName;
    }

    protected applyNameReplacer(content: string, name: string) {
        const templateLoader = new ReactCM_UniversalTemplateNameLoader();
        return templateLoader.loadReactPMTemplate(content, name);
    }

    protected applyRewritesToPath(origRelPath: string, withSubDir: boolean) {
        if (!this.template) {
            throw new Error('Template is not set! Stopping execution...');
        }

        const rewrites = this.template?.rewrites || [];
        let newRelPath = origRelPath;

        // looking for rewrites to apply
        for (const r of rewrites) {
            let fileToRewriteName = origRelPath;

            if (withSubDir) {
                fileToRewriteName = path.join(this.args.name, r.from);
            }

            // rewrite name to new one
            if (fileToRewriteName == origRelPath) {
                newRelPath = r.to;

                if (withSubDir) {
                    newRelPath = path.join(this.args.name, r.to);
                }

                break;
            }
        }

        return newRelPath;
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

    protected async isComponentExists(): Promise<boolean> {
        if (!this.cfg) return Promise.reject(new Error('Cfg is not set'));
        const ext = path.extname(this.templatePath);
        return await isFileExists(path.join(this.outDir, this.args.name + ext));
    }
}
