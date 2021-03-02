"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCM_TSX_TemplateLoader = exports.ReactCMTemplateLoader = void 0;
const pascal_case_1 = require("pascal-case");
class ReactCMTemplateLoader {
    loadReactPMTemplate(content, cName) {
        const withName = content.replace(new RegExp("%CNAME%", "g"), cName);
        return withName;
    }
}
exports.ReactCMTemplateLoader = ReactCMTemplateLoader;
class ReactCM_TSX_TemplateLoader {
    loadReactPMTemplate(content, name) {
        const pascalCasedName = pascal_case_1.pascalCase(name);
        const baseLoader = new ReactCMTemplateLoader();
        return baseLoader.loadReactPMTemplate(content, pascalCasedName);
    }
}
exports.ReactCM_TSX_TemplateLoader = ReactCM_TSX_TemplateLoader;
