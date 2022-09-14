"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateComponentBackend = void 0;
const is_file_exists_1 = require("../utils/fs/is_file_exists");
const universal_template_loader_1 = require("../utils/template/universal_template_loader");
const mk_dir_1 = require("../utils/fs/mk_dir");
const path = require("path");
const fs = require("fs");
class CreateComponentBackend {
    constructor(cfg, args, flags) {
        this.cfg = cfg;
        this.args = args;
        this.flags = flags;
        this.templatePath = '';
        this.outDir = '';
        this.subdir = false;
        this.template = null;
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
        if (!template)
            return console.error('there is no template with that name, check your config');
        this.template = template;
        this.templatePath = template.path;
        // cfg already validated, so outDir can't be undefined & we cast it to str
        const cfgOutDir = (this.template.outDir || ((_a = this.cfg.defaults) === null || _a === void 0 ? void 0 : _a.outDir));
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
            if (await this.isComponentExists(templateStat)) {
                return console.log('Already exists');
            }
        }
        catch (e) {
            return console.error(e);
        }
        if (templateStat.isDirectory()) {
            this.handleDir(this.templatePath);
        }
        else {
            this.handleFile(this.templatePath);
        }
    }
    async handleDir(dirFullPath) {
        const dirFiles = await fs.promises.readdir(dirFullPath);
        dirFiles.forEach(async (dirFileName) => {
            const dirFileFullPath = path.join(dirFullPath, dirFileName);
            let dirFileStat = null;
            try {
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
        const copyBaseName = this.getProcessedCopyBaseName(fileFullPath);
        const copyFullPath = this.getNewFileRelativePath(fileFullPath, copyBaseName);
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
            await (0, mk_dir_1.mkDirIfNotExists)(path.dirname(copyFullPath));
            await fs.promises.writeFile(copyFullPath, processedContent, { encoding: 'utf-8' });
        }
        catch (e) {
            return console.error(e);
        }
    }
    getProcessedCopyBaseName(fileFullPath) {
        if (fileFullPath == this.templatePath) {
            return this.args.name + path.extname(fileFullPath);
        }
        const baseName = path.basename(fileFullPath);
        const templateLoader = new universal_template_loader_1.ReactCM_UniversalTemplateNameLoader();
        return templateLoader.loadReactPMTemplate(baseName, this.args.name);
    }
    getNewFileRelativePath(fileFullPath, baseName) {
        if (!this.cfg)
            throw new Error('cfg is not set');
        if (!this.template)
            throw new Error('template is not set');
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
    getCreateSubdirProp(defaultTemplateValue) {
        if (!this.template) {
            throw new Error('template is not set');
        }
        let createSubdir = this.template.subDir;
        if (createSubdir == undefined) {
            createSubdir = defaultTemplateValue;
        }
        if (this.flags.subdir != undefined) {
            createSubdir = this.flags.subdir;
        }
        return createSubdir;
    }
    async isComponentExists(templateStat) {
        if (!this.cfg)
            return Promise.reject(new Error('Cfg is not set'));
        if (templateStat.isDirectory()) {
            return await (0, is_file_exists_1.isFileExists)(path.join(this.outDir, this.args.name));
        }
        else {
            const ext = path.extname(this.templatePath);
            return await (0, is_file_exists_1.isFileExists)(path.join(this.outDir, this.args.name + ext));
        }
    }
}
exports.CreateComponentBackend = CreateComponentBackend;
