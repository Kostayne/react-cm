"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCMTemplateOriginalNameLoader = void 0;
const abstract_template_loader_1 = require("./abstract_template_loader");
class ReactCMTemplateOriginalNameLoader extends abstract_template_loader_1.ReactCMTemplateAbstractLoader {
    loadReactPMTemplate(content, templateValue) {
        return this.replaceKeywordTo(content, templateValue, 'cname');
    }
}
exports.ReactCMTemplateOriginalNameLoader = ReactCMTemplateOriginalNameLoader;
