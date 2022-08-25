import { ReactCMTemplateAbstractLoader } from "./abstract_template_loader";
import { ReactCMTemplateOriginalNameLoader } from "./original_name_loader";
import { ReactCMTemplateParamCaseLoader } from "./param_case_loader";
import { ReactCMTemplatePascalCaseLoader } from "./pascal_case_loader";

export class ReactCM_UniversalTemplateNameLoader extends ReactCMTemplateAbstractLoader {
    override loadReactPMTemplate(content: string, templateName: string): string {
        const loaders = [
            new ReactCMTemplateOriginalNameLoader(),
            new ReactCMTemplateParamCaseLoader(),
            new ReactCMTemplatePascalCaseLoader(),
        ];

        let loadedTemplateContent = content;
        loaders.forEach(loader => {
            loadedTemplateContent = loader.loadReactPMTemplate(loadedTemplateContent, templateName);
        });

        return loadedTemplateContent;
    }
}
