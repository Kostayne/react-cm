"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateComponentBackend = void 0;
const fs = require("fs");
const path = require("path");
// utils
const is_file_exists_1 = require("../utils/fs/is_file_exists");
const universal_template_loader_1 = require("../utils/template/universal_template_loader");
const mk_dir_1 = require("../utils/fs/mk_dir");
// fn
const getRelPathWithAutoArch_1 = require("./create/getRelPathWithAutoArch");
const getNewRelPathWithFnameRewrites_1 = require("./create/getNewRelPathWithFnameRewrites");
const getNewOutDirPathWithSubdir_1 = require("./create/getNewOutDirPathWithSubdir");
class CreateComponentBackend {
    constructor(cfg, args, flags) {
        this.cfg = cfg;
        this.args = args;
        this.flags = flags;
        this.templatePath = '';
        this.outDir = '';
        this.subDir = false;
        this.isSingleFileComponent = false;
        // template initially undefined, but setting after load
        // if loaded incorrect, utility will exit
        this.template = undefined;
        this.flags = flags;
        this.args = args;
    }
    async createComponent() {
        if (!this.cfg) {
            return console.error('config is null or undefined!');
        }
        // template loading
        const template = this.cfg.templates.find((t) => {
            return t.name == this.args.template;
        });
        if (!template) {
            console.error('There is no template with that name, check your config');
            console.error('Templates listed in config: ', this.cfg.templates);
            return;
        }
        ;
        this.template = template;
        this.templatePath = template.path;
        const cfgPaths = this.cfg.paths || [];
        // apply aliases to templatePath
        cfgPaths.forEach(p => {
            // example: @t => templates
            this.templatePath = this.templatePath.replace(p.name, p.value);
        });
        let templateStat = null;
        // check that we can read the folder
        // (we have permissions and the folder exists)
        try {
            templateStat = await fs.promises.stat(this.templatePath);
        }
        catch (e) {
            if (e.code == 'ENOENT') {
                return console.error('Template file with provided path is not exists');
            }
            return console.error(e);
        }
        if (!templateStat)
            return;
        try {
            if (await this.isComponentExists()) {
                return console.log('Already exists');
            }
        }
        catch (e) {
            return console.error(e);
        }
        this.isSingleFileComponent = !templateStat.isDirectory();
        this.setupFinalOutDir();
        const processTemplate = this.isSingleFileComponent ?
            this.handleFile : this.handleDir;
        // consider floating this, we need use call fn
        processTemplate.call(this, this.templatePath);
    }
    async handleDir(dirFullPath) {
        const dirFiles = await fs.promises.readdir(dirFullPath);
        dirFiles.forEach(async (dirFileName) => {
            const dirFileFullPath = path.join(dirFullPath, dirFileName);
            let dirFileStat = null;
            try {
                // check for nested file or dir access
                dirFileStat = await fs.promises.stat(dirFileFullPath);
            }
            catch (e) {
                return console.error(e);
            }
            if (dirFileStat.isDirectory()) {
                this.handleDir(dirFileFullPath);
            }
            else {
                this.handleFile(dirFileFullPath);
            }
        });
    }
    async handleFile(fileFullPath) {
        const newRelPath = this.getFinalNewRelPathToOutDir(fileFullPath);
        const writePath = path.join(this.outDir, newRelPath);
        const templateLoader = new universal_template_loader_1.ReactCM_UniversalTemplateNameLoader();
        let fileContent = '';
        try {
            const buffer = await fs.promises.readFile(fileFullPath);
            fileContent = await buffer.toString();
            const processedContent = templateLoader.loadReactPMTemplate(fileContent, this.args.name);
            await (0, mk_dir_1.mkDirIfNotExists)(path.dirname(writePath));
            await fs.promises.writeFile(writePath, processedContent, { encoding: 'utf-8' });
        }
        catch (e) {
            return console.error(e);
        }
    }
    getFinalNewRelPathToOutDir(templateFileFullPath) {
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
        let finalRelPath = (0, getNewRelPathWithFnameRewrites_1.getNewRelPathWithFnameRewrites)(this.template, origRelPath);
        // replace file name to components name
        // example: cname.tsx => TestC.tsx
        finalRelPath = this.applyNameReplacer(finalRelPath, this.args.name);
        return finalRelPath;
    }
    applyNameReplacer(content, name) {
        const templateLoader = new universal_template_loader_1.ReactCM_UniversalTemplateNameLoader();
        return templateLoader.loadReactPMTemplate(content, name);
    }
    setupFinalOutDir() {
        var _a;
        // cfg already validated, so outDir can't be undefined & we cast it to str
        const cfgOutDir = (this.template.outDir || ((_a = this.cfg.defaults) === null || _a === void 0 ? void 0 : _a.outDir));
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
        this.outDir = (0, getRelPathWithAutoArch_1.getRelPathWithAutoArch)(arches, this.outDir);
        // apply subdir
        const withSubdir = this.getFinalSubdirProp(!this.isSingleFileComponent);
        this.outDir = (0, getNewOutDirPathWithSubdir_1.getNewOutDirPathWithSubdir)(this.outDir, {
            createSubDir: withSubdir,
            componentName: this.args.name,
            isSingleFileComponent: this.isSingleFileComponent,
        });
    }
    getFinalSubdirProp(defaultTemplateValue) {
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
        return createSubdir;
    }
    async isComponentExists() {
        if (!this.cfg) {
            return Promise.reject(new Error('Cfg is not set'));
        }
        if (this.isSingleFileComponent) {
            const ext = path.extname(this.templatePath);
            return (0, is_file_exists_1.isFileExists)(path.join(this.outDir, this.args.name + ext));
        }
        return (0, is_file_exists_1.isFileExists)(this.outDir);
    }
    getUsedArches(archNames) {
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
        const foundedArches = [];
        const notFoundedArchNames = [];
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
exports.CreateComponentBackend = CreateComponentBackend;
