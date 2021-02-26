import {  isFileExists } from "./is_file_exists";
import { parseExternalJSON } from "./external_json_parser";
import * as paths from "./paths";

export interface IReactPMConfigFinder {
    findConfig(): Promise<string>;
}

export class ReactPMConfigFinder implements IReactPMConfigFinder {
    protected async isCfgInNpmPackage(): Promise<boolean> {
        const userPackage = await parseExternalJSON(paths.packagePath);
        return userPackage.reactPM != null && userPackage.reactPM != undefined;
    }

    async findConfig(): Promise<string> {
        const seperateCfgExists = await isFileExists(paths.configPath);
        const npmPackageCfgExists = await this.isCfgInNpmPackage();

        if (seperateCfgExists) return paths.configPath;
        if (npmPackageCfgExists) return paths.packagePath;

        throw "Config not found";
    }
}