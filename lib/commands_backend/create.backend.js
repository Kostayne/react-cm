"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateComponentBackend = void 0;
const fs = require("fs");
const path = require("path");
const is_file_exists_1 = require("../utils/fs/is_file_exists");
const universal_template_loader_1 = require("../utils/template/universal_template_loader");
const mk_dir_1 = require("../utils/fs/mk_dir");
class CreateComponentBackend {
    constructor(cfg, args, flags) {
        this.cfg = cfg;
        this.args = args;
        this.flags = flags;
        this.templatePath = '';
        this.outDir = '';
        this.subDir = false;
        this.template = null;
        this.isSingleComponent = false;
        this.flags = flags;
        this.args = args;
    }
    async createComponent() {
        var _a;
        if (!this.cfg) {
            return console.error('config is null or undefined!');
        }
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
        // cfg already validated, so outDir can't be undefined & we cast it to str
        const cfgOutDir = (this.template.outDir || ((_a = this.cfg.defaults) === null || _a === void 0 ? void 0 : _a.outDir));
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
        if (templateStat.isDirectory()) {
            this.isSingleComponent = false;
            this.handleDir(this.templatePath);
        }
        else {
            this.isSingleComponent = true;
            this.handleFile(this.templatePath);
        }
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
        try {
            await fs.promises.stat(fileFullPath);
        }
        catch (e) {
            return console.error(e);
        }
        const newRelPath = this.getFinalNewRelativePath(fileFullPath);
        const outFullPath = path.join(this.outDir, newRelPath);
        const templateLoader = new universal_template_loader_1.ReactCM_UniversalTemplateNameLoader();
        let fileContent = '';
        try {
            const buffer = await fs.promises.readFile(fileFullPath);
            fileContent = await buffer.toString();
        }
        catch (e) {
            return console.error(e);
        }
        const processedContent = templateLoader.loadReactPMTemplate(fileContent, this.args.name);
        try {
            await (0, mk_dir_1.mkDirIfNotExists)(path.dirname(outFullPath));
            await fs.promises.writeFile(outFullPath, processedContent, { encoding: 'utf-8' });
        }
        catch (e) {
            return console.error(e);
        }
    }
    getFinalNewRelativePath(fileFullPath) {
        // create subdir if needed
        let finalRelPath = this.getNewRelativePathWithSubdir(fileFullPath);
        finalRelPath = this.applyRewritesToPath(finalRelPath, !this.isSingleComponent);
        // replace file name to components name
        finalRelPath = this.applyNameReplacer(finalRelPath, this.args.name);
        return finalRelPath;
    }
    getNewRelativePathWithSubdir(fileFullPath) {
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
    applyNameReplacer(content, name) {
        const templateLoader = new universal_template_loader_1.ReactCM_UniversalTemplateNameLoader();
        return templateLoader.loadReactPMTemplate(content, name);
    }
    applyRewritesToPath(origRelPath, withSubDir) {
        var _a;
        if (!this.template) {
            throw new Error('Template is not set! Stopping execution...');
        }
        const rewrites = ((_a = this.template) === null || _a === void 0 ? void 0 : _a.rewrites) || [];
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
    getCreateSubdirProp(defaultTemplateValue) {
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
        return createSubdir;
    }
    async isComponentExists() {
        if (!this.cfg)
            return Promise.reject(new Error('Cfg is not set'));
        const ext = path.extname(this.templatePath);
        return await (0, is_file_exists_1.isFileExists)(path.join(this.outDir, this.args.name + ext));
    }
}
exports.CreateComponentBackend = CreateComponentBackend;
