import {  isFileExists } from "./is_file_exists";
import { parseExternalJSON } from "./external_json_parser";
import * as paths from "./paths";

export interface IReactCMConfigFinder {
    findConfig(): Promise<string>;
}

export class ReactCMConfigFinder implements IReactCMConfigFinder {
    protected async isCfgInNpmPackage(): Promise<boolean> {
        const userPackage = await parseExternalJSON(paths.packagePath);
        return userPackage.reactCM != null && userPackage.reactCM != undefined && typeof userPackage.reactCM == "object";
    }

    async findConfig(): Promise<string> {
        const seperateCfgExists = await isFileExists(paths.configPath);
        const npmPackageCfgExists = await this.isCfgInNpmPackage();

        if (seperateCfgExists) return paths.configPath;
        if (npmPackageCfgExists) return paths.packagePath;

        return Promise.reject(new Error("Config not found"));
    }
}