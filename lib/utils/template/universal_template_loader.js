"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCM_UniversalTemplateNameLoader = void 0;
const abstract_template_loader_1 = require("./abstract_template_loader");
const original_name_loader_1 = require("./original_name_loader");
const param_case_loader_1 = require("./param_case_loader");
const pascal_case_loader_1 = require("./pascal_case_loader");
class ReactCM_UniversalTemplateNameLoader extends abstract_template_loader_1.ReactCMTemplateAbstractLoader {
    loadReactPMTemplate(content, templateName) {
        const loaders = [
            new original_name_loader_1.ReactCMTemplateOriginalNameLoader(),
            new param_case_loader_1.ReactCMTemplateParamCaseLoader(),
            new pascal_case_loader_1.ReactCMTemplatePascalCaseLoader(),
        ];
        let loadedTemplateContent = content;
        loaders.forEach(loader => {
            loadedTemplateContent = loader.loadReactPMTemplate(loadedTemplateContent, templateName);
        });
        return loadedTemplateContent;
    }
}
exports.ReactCM_UniversalTemplateNameLoader = ReactCM_UniversalTemplateNameLoader;
