"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateComponentBackend = void 0;
const is_file_exists_1 = require("../api/is_file_exists");
const template_loader_1 = require("../api/template_loader");
const path = require("path");
const fs = require("fs");
class CreateComponentBackend {
    constructor(cfgLoader, args) {
        this.templatePath = "";
        this.cfg = null;
        this.cfgLoader = cfgLoader;
        this.args = args;
    }
    async createComponent() {
        try {
            this.cfg = await this.cfgLoader.loadCfg();
        }
        catch (e) {
            return console.error(e);
        }
        this.templatePath = this.args.basedOn == "class" ? this.cfg.cTemplate : this.cfg.fnTemplate;
        let templateStat = null;
        try {
            templateStat = await fs.promises.stat(this.templatePath);
        }
        catch (e) {
            if (e.code == "ENOENT") {
                return console.error("Template not exists");
            }
            return console.error(e);
        }
        if (!templateStat)
            return;
        try {
            if (await this.isComponentExists(templateStat))
                return console.log("Already exists");
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
        let fileStat = null;
        try {
            fileStat = await fs.promises.stat(fileFullPath);
        }
        catch (e) {
            return console.error(e);
        }
        const copyBaseName = this.getCopyBaseName(fileFullPath);
        const copyFullPath = this.getFilePath(fileFullPath, copyBaseName); // console.log(`copy path: ${copyFullPath}`);
        const tLoader = this.getFileTemplateLoader(fileFullPath);
        let fileContent = "";
        try {
            fileContent = await (await fs.promises.readFile(fileFullPath)).toString();
        }
        catch (e) {
            return console.error(e);
        }
        const processedContent = tLoader.loadReactPMTemplate(fileContent, this.args.name);
        try {
            await this.mkDirIfNotExists(path.dirname(copyFullPath));
            await fs.promises.writeFile(copyFullPath, processedContent, { encoding: "utf-8" });
        }
        catch (e) {
            return console.error(e);
        }
    }
    getCopyBaseName(fileFullPath) {
        if (fileFullPath == this.templatePath) {
            return this.args.name + path.extname(fileFullPath);
        }
        const baseName = path.basename(fileFullPath);
        const templateLoader = new template_loader_1.ReactCMTemplateLoader();
        return templateLoader.loadReactPMTemplate(baseName, this.args.name);
    }
    getFilePath(fileFullPath, baseName) {
        if (!this.cfg)
            throw new Error("cfg is not set");
        if (fileFullPath == this.templatePath) {
            return path.join(this.cfg.components, baseName);
        }
        const parentDir = path.dirname(fileFullPath);
        const renamedFileFullPath = path.join(parentDir, baseName);
        const relativePath = path.relative(this.templatePath, renamedFileFullPath);
        return path.join(this.cfg.components, this.args.name, relativePath);
    }
    getFileTemplateLoader(fileFullPath) {
        if (/\.(js||jsx||ts||tsx)$/.test(fileFullPath))
            return new template_loader_1.ReactCM_TSX_TemplateLoader();
        return new template_loader_1.ReactCMTemplateLoader();
    }
    async mkDirIfNotExists(path) {
        try {
            await fs.promises.access(path);
        }
        catch (e) {
            if (e.code == "ENOENT") {
                return await fs.promises.mkdir(path, { recursive: true });
            }
        }
    }
    async isComponentExists(templateStat) {
        if (!this.cfg)
            return Promise.reject(new Error("Cfg is not set"));
        if (templateStat.isDirectory()) {
            return await is_file_exists_1.isFileExists(path.join(this.cfg.components, this.args.name));
        }
        else {
            const ext = path.extname(this.templatePath);
            return await is_file_exists_1.isFileExists(path.join(this.cfg.components, this.args.name + ext));
        }
    }
}
exports.CreateComponentBackend = CreateComponentBackend;
