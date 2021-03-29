export interface IReactCMTeplateLoader {
    loadReactPMTemplate(content: string, name: string): string;
}
export declare class ReactCMTemplateLoader implements IReactCMTeplateLoader {
    loadReactPMTemplate(content: string, cName: string): string;
}
export declare class ReactCM_TSX_TemplateLoader implements IReactCMTeplateLoader {
    loadReactPMTemplate(content: string, name: string): string;
}
export declare class ReactCM_UniversalTemplateLoader implements IReactCMTeplateLoader {
    protected replaceKeywordTo(content: string, to: string, keyword: string): string;
    protected loadOriginal(content: string, name: string): string;
    protected loadTSX(content: string, name: string): string;
    protected loadParamCase(content: string, name: string): string;
    loadReactPMTemplate(content: string, name: string): string;
}
