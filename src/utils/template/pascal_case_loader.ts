import { pascalCase } from "change-case";
import { ReactCMTemplateAbstractLoader } from "./abstract_template_loader";

export class ReactCMTemplatePascalCaseLoader extends ReactCMTemplateAbstractLoader {
    override loadReactPMTemplate(content: string, name: string): string {
        const pascalCasedName = pascalCase(name);
        return this.replaceKeywordTo(content, pascalCasedName, '__cname__');
    }
}
