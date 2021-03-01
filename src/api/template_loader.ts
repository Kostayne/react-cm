import { pascalCase } from "pascal-case";

export interface IReactCMTeplateLoader {
    loadReactPMTemplate(content: string, name: string): string;
}

export class ReactCMTemplateLoader implements IReactCMTeplateLoader {
    loadReactPMTemplate(content: string, cName: string): string {
        const withName = content.replace(new RegExp("%CNAME%", "g"), cName);
        return withName;
    }
}

export class ReactCM_TSX_TemplateLoader implements IReactCMTeplateLoader {
    loadReactPMTemplate(content: string, name: string): string {
        const pascalCasedName = pascalCase(name);
        const baseLoader = new ReactCMTemplateLoader();
        return baseLoader.loadReactPMTemplate(content, pascalCasedName);
    }
}