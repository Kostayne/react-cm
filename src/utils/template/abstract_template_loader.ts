import { IReactCMTeplateLoader } from "../../interfaces/template_loader.interface";

export abstract class ReactCMTemplateAbstractLoader implements IReactCMTeplateLoader {
    protected replaceKeywordTo(content: string, to: string, keyword: string) {
        return content.replace(new RegExp(keyword, 'g'), to);
    }

    loadReactPMTemplate(content: string, templateValue: string): string {
        throw new Error('Method not implemented');
    }
}
