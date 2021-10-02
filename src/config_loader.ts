import { IReactCMConfig } from "./cfg";
import { parseExternalJSON } from "./utils/external_json_parser";
import { IReactCMConfigFinder } from "./config_finder";
import * as paths from "./paths";

export interface IReactCMConfigLoader {
    loadCfg(): Promise<IReactCMConfig>;
}

export class ReactCMConfigLoader implements IReactCMConfigLoader {
    protected finder: IReactCMConfigFinder;

    constructor(finder: IReactCMConfigFinder) {
        this.finder = finder;
    }

    public async loadCfg(): Promise<IReactCMConfig> {
        try {
            const cfgPath = await this.finder.findConfig();

            const cfgJson = await parseExternalJSON(cfgPath);
            const cfg = cfgPath == paths.packagePath? cfgJson.reactCM : cfgJson;

            return cfg;
        }
    
        catch(e: any) {
            if (e.code == 'ENOENT') {
                console.error('config does\'nt exist');
                throw(e);
            }

            return Promise.reject(e);
        }
    }
}