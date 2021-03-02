"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveBackend = void 0;
const rimraf = require("rimraf");
const globby = require("globby");
const path = require("path");
const fs = require("fs");
const is_file_exists_1 = require("../api/is_file_exists");
class RemoveBackend {
    constructor(cfgLoader, args) {
        this.cfg = null;
        this.cfgLoader = cfgLoader;
        this.args = args;
    }
    async removeComponent() {
        try {
            this.cfg = await this.cfgLoader.loadCfg();
        }
        catch (e) {
            return console.error(e);
        }
        if (!this.cfg)
            return;
        const globPattern = this.toGlobSlashes(this.cfg.components + `/${this.args.name}.(ts|tsx|js|jsx)`);
        const files = await globby(globPattern);
        files.forEach(async (file) => {
            await fs.promises.unlink(file);
        });
        const complexCPath = path.join(this.cfg.components, this.args.name);
        if (await is_file_exists_1.isFileExists(complexCPath)) {
            let stat = null;
            try {
                stat = await fs.promises.stat(complexCPath);
                if (stat.isDirectory()) {
                    rimraf(complexCPath, (e) => {
                        if (e)
                            return console.error(e);
                    });
                }
            }
            catch (e) {
                return console.error(e);
            }
        }
    }
    toGlobSlashes(pattern) {
        return pattern.replace(/\\/g, "\/");
    }
}
exports.RemoveBackend = RemoveBackend;
