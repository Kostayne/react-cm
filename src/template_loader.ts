import { pascalCase, paramCase } from "change-case";

export interface IReactCMTeplateLoader {
    loadReactPMTemplate(content: string, name: string): string;
}

export class ReactCMTemplateNameLoader implements IReactCMTeplateLoader {
    loadReactPMTemplate(content: string, cName: string): string {
        const withName = content.replace(new RegExp("%CNAME%", "g"), cName);
        return withName;
    }
}

export class ReactCMTemplateJSX_Loader implements IReactCMTeplateLoader {
    loadReactPMTemplate(content: string, name: string): string {
        const pascalCasedName = pascalCase(name);
        const baseLoader = new ReactCMTemplateNameLoader();
        return baseLoader.loadReactPMTemplate(content, pascalCasedName);
    }
}

// NEW
export class ReactCM_UniversalTemplateLoader implements IReactCMTeplateLoader {
    protected replaceKeywordTo(content: string, to: string, keyword: string) {
        return content.replace(new RegExp(keyword, "g"), to);
    }

    protected loadOriginal(content: string, name: string): string {
        return this.replaceKeywordTo(content, name, "__oname__");
    }

    protected loadTSX(content: string, name: string): string {
        const pascalCasedName = pascalCase(name);
        return this.replaceKeywordTo(content, pascalCasedName, "__cname__");
    }

    protected loadParamCase(content: string, name: string): string {
        return this.replaceKeywordTo(content, paramCase(name), "__pname__");
    }

    loadReactPMTemplate(content: string, name: string): string {
        const rawNameReplaced = this.loadOriginal(content, name);
        const jsxNameReplaced = this.loadTSX(rawNameReplaced, name);
        const paramNameRepaced = this.loadParamCase(jsxNameReplaced, name);
        return paramNameRepaced;
    }
}