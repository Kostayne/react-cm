import { IReactCMRewrite } from "./rewrite.type";
export interface IReactCMTemplate {
    name: string;
    path: string;
    outDir: string;
    subDir?: boolean;
    rewrites?: IReactCMRewrite[];
}
