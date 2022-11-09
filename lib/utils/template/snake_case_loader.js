"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCMTemplateSnakeCaseLoader = void 0;
const change_case_1 = require("change-case");
const abstract_template_loader_1 = require("./abstract_template_loader");
class ReactCMTemplateSnakeCaseLoader extends abstract_template_loader_1.ReactCMTemplateAbstractLoader {
    loadReactPMTemplate(content, name) {
        const pascalCasedName = (0, change_case_1.snakeCase)(name);
        return this.replaceKeywordTo(content, pascalCasedName, 'c_name');
    }
}
exports.ReactCMTemplateSnakeCaseLoader = ReactCMTemplateSnakeCaseLoader;
