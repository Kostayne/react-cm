export interface IReactCMconfigField<T> {
    name: string;
    default?: T;
    isRequired?: boolean;
    chooses?: string[];
}

export interface IReactCMConfig {
    cTemplate: string;
    fnTemplate: string;
    components: string;
}