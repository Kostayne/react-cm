import { IReactCMConfig, IReactCMTemplate } from "./cfg";

export interface IReactCMConfigValidator<C extends IReactCMConfig> {
    verifyReactCMConfig(cgf: C): void;
}

export class ReactCMConfigValidator<C extends IReactCMConfig> implements IReactCMConfigValidator<C> {
    verifyReactCMConfig(cfg: C): void {
        this.checkBaseFields(cfg);
    }

    protected checkBaseFields(cfg: C) {
        if (!cfg) throw new Error("cfg is null or undefined");
        if (!cfg.components) throw new Error("components field is not set");
        if (!cfg.templates) throw new Error("templates field is not set");
        if (!Array.isArray(cfg.templates)) throw new Error("templates must to be an array");
        if (cfg.templates.length < 1) throw new Error("there is no templates path provided");

        this.checkTemplates(cfg);
    }

    protected checkTemplates(cfg: C) {
        cfg.templates.forEach((t: IReactCMTemplate) => {
            if (!t) throw new Error("template is null or undefined");
            if (!t.name) throw new Error("template name is null or undefined");
            if (!t.path) throw new Error("template path is null or undefined");
        });
    }
}