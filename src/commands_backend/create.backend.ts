import * as fs from "fs";
import * as path from "path";

// types
import { IReactCMConfig } from "../types/cfg.type";
import { IReactCMTemplate } from "../types/template.type";
import { IAutoArch } from "../types/auto_arch.type";

// utils
import { isFileExists } from "../utils/fs/is_file_exists";
import { ReactCM_UniversalTemplateNameLoader } from "../utils/template/universal_template_loader";
import { mkDirIfNotExists } from "../utils/fs/mk_dir";

// fn
import { getRelPathWithAutoArch } from "./create/getRelPathWithAutoArch";
import { getNewRelPathWithFnameRewrites } from "./create/getNewRelPathWithFnameRewrites";
import { getNewOutDirPathWithSubdir } from "./create/getNewOutDirPathWithSubdir";

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
    protected isSingleFileComponent = false;

    // template initially undefined, but setting after load
    // if loaded incorrect, utility will exit
    protected template: IReactCMTemplate = undefined as unknown as IReactCMTemplate;

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

        // template loading
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

        const cfgPaths = this.cfg.paths || [];
        
        // apply aliases to templatePath
        cfgPaths.forEach(p => {
            // example: @t => templates
            this.templatePath = this.templatePath.replace(p.name, p.value);
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

        this.isSingleFileComponent = !templateStat.isDirectory();
        this.setupFinalOutDir();

        const processTemplate = this.isSingleFileComponent ? 
            this.handleFile : this.handleDir;

        // consider floating this, we need use call fn
        processTemplate.call(this, this.templatePath);
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
        const newRelPath = this.getFinalNewRelPathToOutDir(fileFullPath);
        const writePath = path.join(this.outDir, newRelPath);
        const templateLoader = new ReactCM_UniversalTemplateNameLoader();

        let fileContent: string = '';
        
        try {
            const buffer = await fs.promises.readFile(fileFullPath);
            fileContent = await buffer.toString();

            const processedContent = templateLoader.loadReactPMTemplate(fileContent, this.args.name);
        
            await mkDirIfNotExists(path.dirname(writePath));
            await fs.promises.writeFile(writePath, processedContent, { encoding: 'utf-8' });
        } catch(e) {
            return console.error(e);
        }
    }

    protected getFinalNewRelPathToOutDir(templateFileFullPath: string): string {
        // if it's single file component, 
        // then templateFileFullPath == templatePath
        // example: TestComponent + .tsx
        if (this.isSingleFileComponent) {
            const ext = path.extname(this.templatePath);
            return this.args.name + ext;
        }

        // index.tsx
        const origRelPath = path.relative(this.templatePath, templateFileFullPath);

        // rewrites file names
        // example: cname.test.!tsx => cname.test.tsx
        let finalRelPath = getNewRelPathWithFnameRewrites(this.template, origRelPath);

        // replace file name to components name
        // example: cname.tsx => TestC.tsx
        finalRelPath = this.applyNameReplacer(finalRelPath, this.args.name);

        return finalRelPath;
    }

    protected applyNameReplacer(content: string, name: string) {
        const templateLoader = new ReactCM_UniversalTemplateNameLoader();
        return templateLoader.loadReactPMTemplate(content, name);
    }

    protected setupFinalOutDir(): void {
        // cfg already validated, so outDir can't be undefined & we cast it to str
        const cfgOutDir = (this.template.outDir || this.cfg.defaults?.outDir) as string;
        const cfgPaths = this.cfg.paths || [];

        // cli parameter priority
        this.outDir = this.flags.out || cfgOutDir;

        // apply aliases to outDir
        cfgPaths.forEach(p => {
            // example: @p => src/pages
            this.outDir = this.outDir.replace(p.name, p.value);
        });

        // normalize out dir
        // make sure that paths with ./ will work too
        if (this.outDir.startsWith('./')) {
            this.outDir = this.outDir.slice(2);
        }

        // apply auto arch
        const arches = this.getUsedArches(this.template.usingArches || []);
        this.outDir = getRelPathWithAutoArch(arches, this.outDir);

        // apply subdir
        const withSubdir = this.getFinalSubdirProp(!this.isSingleFileComponent);

        this.outDir = getNewOutDirPathWithSubdir(this.outDir, {
            createSubDir: withSubdir,
            componentName: this.args.name,
            isSingleFileComponent: this.isSingleFileComponent,
        });
    }

    protected getFinalSubdirProp(defaultTemplateValue: boolean): boolean {
        if (!this.template) {
            throw new Error('template is not set');
        }

        // get value from template
        let createSubdir = this.template.subDir;

        // if value not set in the template, use default value 
        // for current template type (single file | complex)
        if (createSubdir == undefined) {
            createSubdir = defaultTemplateValue;
        }

        // get value from cli
        if (this.flags.subdir !== undefined) {
            createSubdir = this.flags.subdir;
        }

        return createSubdir as boolean;
    }

    protected async isComponentExists(): Promise<boolean> {
        if (!this.cfg) {
            return Promise.reject(new Error('Cfg is not set'));
        }

        if (this.isSingleFileComponent) {
            const ext = path.extname(this.templatePath);
            return isFileExists(path.join(this.outDir, this.args.name + ext));
        }

        return isFileExists(this.outDir);
    }

    protected getUsedArches(archNames: string[]) {
        if (archNames.length == 0) {
            return [];
        }

        if (!this.cfg.autoArches) {
            console.error('Used auto arches feature while not set any!');
            process.exit(1);
        }

        // ts yells at me that this.cfg.autoArches may be undefined...
        // so to fix it without ugly casting i added this const
        const cfgArches = this.cfg.autoArches;

        const foundedArches: IAutoArch[] = [];
        const notFoundedArchNames: string[] = [];

        archNames.forEach(archName => {
            const arch = cfgArches.find(curArch => curArch.name === archName);

            if (arch) {
                foundedArches.push(arch);
            }

            if (!arch) {
                notFoundedArchNames.push(archName);
            }
        });

        // log not founded arches
        if (notFoundedArchNames.length > 0) {
            console.error(`These arches are not exist: ${notFoundedArchNames.join(', ')}`);
            process.exit(1);
        }

        return foundedArches;
    }
}
