import { IReactCMTemplate } from "./template.type";
interface IReactCMConfigDefaults {
    outDir: string;
}
interface IReactCMConfigPath {
    name: string;
    path: string;
}
export interface IReactCMConfig {
    paths?: IReactCMConfigPath[];
    defaults?: IReactCMConfigDefaults;
    templates: IReactCMTemplate[];
}
export {};
