import { IReactCMTemplate } from "./template";
interface IReactCMConfigDefaults {
    outDir: string;
}
export interface IReactCMConfig {
    defaults?: IReactCMConfigDefaults;
    templates: IReactCMTemplate[];
}
export {};
