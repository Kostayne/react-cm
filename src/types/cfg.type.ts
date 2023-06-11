import { IAutoArch } from "./auto_arch.type";
import { IReactCMTemplate } from "./template.type";

interface IReactCMConfigDefaults {
    outDir: string;
}

interface IReactCMConfigPath {
    name: string;
    value: string;
}

export interface IReactCMConfig {
    paths?: IReactCMConfigPath[];
    defaults?: IReactCMConfigDefaults;
    templates: IReactCMTemplate[];
    autoArches?: IAutoArch[];
}
