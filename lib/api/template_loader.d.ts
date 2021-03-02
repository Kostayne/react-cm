export interface IReactCMTeplateLoader {
    loadReactPMTemplate(content: string, name: string): string;
}
export declare class ReactCMTemplateLoader implements IReactCMTeplateLoader {
    loadReactPMTemplate(content: string, cName: string): string;
}
export declare class ReactCM_TSX_TemplateLoader implements IReactCMTeplateLoader {
    loadReactPMTemplate(content: string, name: string): string;
}
