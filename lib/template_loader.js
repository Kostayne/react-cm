"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCM_UniversalTemplateLoader = exports.ReactCMTemplateJSX_Loader = exports.ReactCMTemplateNameLoader = void 0;
const change_case_1 = require("change-case");
class ReactCMTemplateNameLoader {
    loadReactPMTemplate(content, cName) {
        const withName = content.replace(new RegExp("%CNAME%", "g"), cName);
        return withName;
    }
}
exports.ReactCMTemplateNameLoader = ReactCMTemplateNameLoader;
class ReactCMTemplateJSX_Loader {
    loadReactPMTemplate(content, name) {
        const pascalCasedName = change_case_1.pascalCase(name);
        const baseLoader = new ReactCMTemplateNameLoader();
        return baseLoader.loadReactPMTemplate(content, pascalCasedName);
    }
}
exports.ReactCMTemplateJSX_Loader = ReactCMTemplateJSX_Loader;
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
        const jsxNameReplaced = this.loadTSX(rawNameReplaced, name);
        const paramNameRepaced = this.loadParamCase(jsxNameReplaced, name);
        return paramNameRepaced;
    }
}
exports.ReactCM_UniversalTemplateLoader = ReactCM_UniversalTemplateLoader;
