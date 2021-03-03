export interface IReactCMTemplate {
    name: string;
    path: string;
}

export interface IReactCMConfig {
    templates: IReactCMTemplate[];
    components: string;
}