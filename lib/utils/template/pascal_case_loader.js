"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCMTemplatePascalCaseLoader = void 0;
const change_case_1 = require("change-case");
const abstract_template_loader_1 = require("./abstract_template_loader");
class ReactCMTemplatePascalCaseLoader extends abstract_template_loader_1.ReactCMTemplateAbstractLoader {
    loadReactPMTemplate(content, name) {
        const pascalCasedName = (0, change_case_1.pascalCase)(name);
        return this.replaceKeywordTo(content, pascalCasedName, 'CName');
    }
}
exports.ReactCMTemplatePascalCaseLoader = ReactCMTemplatePascalCaseLoader;
