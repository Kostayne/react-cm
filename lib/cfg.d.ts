export interface IReactCMTemplate {
    name: string;
    path: string;
    outDir: string;
}
export interface IReactCMConfig {
    templates: IReactCMTemplate[];
}
