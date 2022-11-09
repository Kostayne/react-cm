"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCMTemplateParamCaseLoader = void 0;
const change_case_1 = require("change-case");
const abstract_template_loader_1 = require("./abstract_template_loader");
class ReactCMTemplateParamCaseLoader extends abstract_template_loader_1.ReactCMTemplateAbstractLoader {
    loadReactPMTemplate(content, templateVal) {
        return this.replaceKeywordTo(content, (0, change_case_1.paramCase)(templateVal), 'c-name');
    }
}
exports.ReactCMTemplateParamCaseLoader = ReactCMTemplateParamCaseLoader;
