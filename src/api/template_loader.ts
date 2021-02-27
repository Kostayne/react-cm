import { pascalCase } from "pascal-case";

export interface ITemplateLoader {
    loadTemplate(content: string, name: string): string;
}

export class TemplateLoader implements ITemplateLoader {
    loadTemplate(content: string, name: string): string {
        const pascalCasedName = pascalCase(name);
        const withName = content.replace(new RegExp("%CNAME%", "g"), pascalCasedName);
        return withName;
    }
}