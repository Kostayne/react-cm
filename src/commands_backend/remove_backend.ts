import { IReactPMConfig } from "../api/cfg";
import { IReactPMConfigLoader } from "../api/config_loader";
import * as rimraf from "rimraf";
import * as globby from "globby";
import * as path from "path";
import * as fs from "fs";
import { isFileExists } from "../api/is_file_exists";

export interface IRemoveBackend {
    removeComponent(): void;
}

export interface RemoveBackendArgs {
    name: string;
}

export class RemoveBackend implements IRemoveBackend {
    protected cfgLoader: IReactPMConfigLoader;
    protected args: RemoveBackendArgs;
    protected cfg: IReactPMConfig | null = null;

    constructor(cfgLoader: IReactPMConfigLoader, args: RemoveBackendArgs) {
        this.cfgLoader = cfgLoader;
        this.args = args;
    }

    async removeComponent(): Promise<void> {
        try {
            this.cfg = await this.cfgLoader.loadCfg();
        } catch(e) {
            return console.error(e);
        }

        if (!this.cfg) return;
        const globPattern = this.toGlobSlashes(this.cfg.components + `/${this.args.name}.(ts|tsx|js|jsx)`);
        const files = await globby(globPattern);
        
        files.forEach(async (file: string) => {
            await fs.promises.unlink(file);
        });

        const complexCPath = path.join(this.cfg.components, this.args.name);
        if (await isFileExists(complexCPath)) {
            let stat: fs.Stats | null = null;

            try {
                stat = await fs.promises.stat(complexCPath);
                if (stat.isDirectory()) {
                    rimraf(complexCPath, (e: Error) => {
                        if (e) return console.error(e);
                    });
                }
            } catch(e) {
                return console.error(e);
            }
        }
    }

    protected toGlobSlashes(pattern: string): string {
        return pattern.replace(/\\/g, "\/");
    }
}