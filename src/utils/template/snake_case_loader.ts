import { snakeCase } from "change-case";
import { ReactCMTemplateAbstractLoader } from "./abstract_template_loader";

export class ReactCMTemplateSnakeCaseLoader extends ReactCMTemplateAbstractLoader {
    override loadReactPMTemplate(content: string, name: string): string {
        const pascalCasedName = snakeCase(name);
        return this.replaceKeywordTo(content, pascalCasedName, 'c_name');
    }
}
