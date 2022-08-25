import * as paths from "../../paths";
import { IReactCMConfig } from "../../types/cfg.type";
import { parseExternalJSON } from "../external_json_parser";
import { IReactCMConfigFinder } from "../../interfaces/config_finder.interface";
import { IReactCMConfigLoader } from "../../interfaces/config_loader.interface";

export class ReactCMConfigLoader implements IReactCMConfigLoader {
    protected finder: IReactCMConfigFinder;

    constructor(finder: IReactCMConfigFinder) {
        this.finder = finder;
    }

    public async loadCfg(): Promise<IReactCMConfig> {
        try {
            const cfgPath = await this.finder.findConfigPath();

            const cfgJson = await parseExternalJSON(cfgPath);
            return cfgPath == paths.packagePath? cfgJson.reactCM : cfgJson;
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
