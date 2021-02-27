import { IReactPMConfigLoader } from "../api/config_loader";
import { isFileExists } from "../api/is_file_exists";
import * as paths from "../api/paths";
import * as path from "path";
import * as fs from "fs";
import { ITemplateLoader } from "../api/template_loader";

export interface CreateBackendArgs {
    name: string;
    basedOn: string;
}

export async function runCreateComponentBackend(cfgLoader: IReactPMConfigLoader, templateLoader: ITemplateLoader, args: CreateBackendArgs) {
    const cfg = await cfgLoader.loadCfg();
    const templatePath = args.basedOn == "class"? paths.cTemplatePath : paths.fnTemplatePath;

    try {
        const stat = await fs.promises.stat(templatePath);
        if (stat.isDirectory()) {
            return;
        }

        const templateExt = path.extname(templatePath);
        const componentFullName = args.name + templateExt;
        const newComponentPath = path.join(cfg.components, componentFullName);

        const templateContent = (await fs.promises.readFile(templatePath)).toString();
        const newComponentContent = templateLoader.loadTemplate(templateContent, args.name);

        if (await isFileExists(newComponentPath)) return console.log("already exists");
        await fs.promises.writeFile(newComponentPath, newComponentContent, { encoding: "utf-8" });
    }

    catch(e) {
        console.error(e);
        throw e;
    }
}