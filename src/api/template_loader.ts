import { pascalCase } from "pascal-case";

export interface IReactPMTeplateLoader {
    loadReactPMTemplate(content: string, name: string): string;
}

export class ReactPMTemplateLoader implements IReactPMTeplateLoader {
    loadReactPMTemplate(content: string, cName: string): string {
        const withName = content.replace(new RegExp("%CNAME%", "g"), cName);
        return withName;
    }
}

export class ReactPM_TSX_TemplateLoader implements IReactPMTeplateLoader {
    loadReactPMTemplate(content: string, name: string): string {
        const pascalCasedName = pascalCase(name);
        const baseLoader = new ReactPMTemplateLoader();
        return baseLoader.loadReactPMTemplate(content, pascalCasedName);
    }
}