"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCMTemplateAbstractLoader = void 0;
class ReactCMTemplateAbstractLoader {
    replaceKeywordTo(content, to, keyword) {
        return content.replace(new RegExp(keyword, 'g'), to);
    }
    loadReactPMTemplate(content, templateValue) {
        throw new Error('Method not implemented');
    }
}
exports.ReactCMTemplateAbstractLoader = ReactCMTemplateAbstractLoader;
