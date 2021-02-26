export interface IReactPMconfigField<T> {
    name: string;
    default?: T;
    isRequired?: boolean;
    chooses?: string[];
}

export interface IReactPMConfig {
    cTemplate: string;
    fnTemplate: string;
    components: string;
}