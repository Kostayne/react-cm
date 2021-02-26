import { IReactPMConfigLoader } from "../api/config_loader";
import * as paths from "../api/paths";

export interface CreateBackendArgs {
    name: string;
    basedOn: string;
}

export async function runCreateComponentBackend(cfgLoader: IReactPMConfigLoader, args: CreateBackendArgs) {
    const cfg = await cfgLoader.loadCfg();

    console.log(cfg);
    console.log(args);

    const templatePath = args.basedOn == "class"? paths.cTemplatePath : paths.fnTemplatePath;
}