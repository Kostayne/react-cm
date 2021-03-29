"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCMConfigValidator = void 0;
class ReactCMConfigValidator {
    verifyReactCMConfig(cfg) {
        this.checkBaseFields(cfg);
    }
    checkBaseFields(cfg) {
        if (!cfg)
            throw new Error("cfg is null or undefined");
        if (!cfg.components)
            throw new Error("components field is not set");
        if (!cfg.templates)
            throw new Error("templates field is not set");
        if (!Array.isArray(cfg.templates))
            throw new Error("templates must to be an array");
        if (cfg.templates.length < 1)
            throw new Error("there is no templates path provided");
        this.checkTemplates(cfg);
    }
    checkTemplates(cfg) {
        cfg.templates.forEach((t) => {
            if (!t)
                throw new Error("template is null or undefined");
            if (!t.name)
                throw new Error("template name is null or undefined");
            if (!t.path)
                throw new Error("template path is null or undefined");
        });
    }
}
exports.ReactCMConfigValidator = ReactCMConfigValidator;
