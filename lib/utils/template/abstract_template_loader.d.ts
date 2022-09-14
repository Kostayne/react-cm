import { IReactCMTeplateLoader } from "../../interfaces/template_loader.interface";
export declare abstract class ReactCMTemplateAbstractLoader implements IReactCMTeplateLoader {
    protected replaceKeywordTo(content: string, to: string, keyword: string): string;
    loadReactPMTemplate(content: string, templateValue: string): string;
}
