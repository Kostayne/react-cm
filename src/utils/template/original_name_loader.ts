import { ReactCMTemplateAbstractLoader } from "./abstract_template_loader";

export class ReactCMTemplateOriginalNameLoader extends ReactCMTemplateAbstractLoader {
	override loadReactPMTemplate(content: string, templateValue: string): string {
		return this.replaceKeywordTo(content, templateValue, '__oname__');
	}
}
