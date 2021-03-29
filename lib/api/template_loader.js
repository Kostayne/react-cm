"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCM_UniversalTemplateLoader = exports.ReactCM_TSX_TemplateLoader = exports.ReactCMTemplateLoader = void 0;
const change_case_1 = require("change-case");
class ReactCMTemplateLoader {
    loadReactPMTemplate(content, cName) {
        const withName = content.replace(new RegExp("%CNAME%", "g"), cName);
        return withName;
    }
}
exports.ReactCMTemplateLoader = ReactCMTemplateLoader;
class ReactCM_TSX_TemplateLoader {
    loadReactPMTemplate(content, name) {
        const pascalCasedName = change_case_1.pascalCase(name);
        const baseLoader = new ReactCMTemplateLoader();
        return baseLoader.loadReactPMTemplate(content, pascalCasedName);
    }
}
exports.ReactCM_TSX_TemplateLoader = ReactCM_TSX_TemplateLoader;
// NEW
class ReactCM_UniversalTemplateLoader {
    replaceKeywordTo(content, to, keyword) {
        return content.replace(new RegExp(keyword, "g"), to);
    }
    loadOriginal(content, name) {
        return this.replaceKeywordTo(content, name, "__oname__");
    }
    loadTSX(content, name) {
        const pascalCasedName = change_case_1.pascalCase(name);
        return this.replaceKeywordTo(content, pascalCasedName, "__cname__");
    }
    loadParamCase(content, name) {
        return this.replaceKeywordTo(content, change_case_1.paramCase(name), "__pname__");
    }
    loadReactPMTemplate(content, name) {
        const rawNameReplaced = this.loadOriginal(content, name);
        const tsxNameReplaced = this.loadTSX(rawNameReplaced, name);
        const paramNameRepaced = this.loadParamCase(tsxNameReplaced, name);
        return paramNameRepaced;
    }
}
exports.ReactCM_UniversalTemplateLoader = ReactCM_UniversalTemplateLoader;
