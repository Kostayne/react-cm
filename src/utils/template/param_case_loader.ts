import { paramCase } from "change-case";
import { ReactCMTemplateAbstractLoader } from "./abstract_template_loader";

export class ReactCMTemplateParamCaseLoader extends ReactCMTemplateAbstractLoader {
	override loadReactPMTemplate(content: string, templateVal: string): string {
		return this.replaceKeywordTo(content, paramCase(templateVal), 'c-name');
	}
}
