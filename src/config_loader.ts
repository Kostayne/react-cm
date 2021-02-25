import * as path from "path";
import * as paths from "./paths";
import { validateChooseArg } from "./chooseArg";
import * as fs from "fs";

interface IconfigField<T> {
    name: string;
    default?: T;
    isRequired?: boolean;
    chooses?: string[];
}

export interface IReactPMConfig {
    cTemplate: string;
    fnTemplate: string;
    components: string;
}

const fields: IconfigField<any>[] = [
    {
        name: "cTemplate",
        default: paths.cTemplatePath
    },
    {
        name: "fnTemplate",
        default: paths.fnTemplatePath
    },
    {
        name: "components",
        default: paths.componentsPath,
    }
]

export async function loadCfg(): Promise<IReactPMConfig> {
    try {
        const data = await (await fs.promises.readFile(paths.configPath)).toString();
        const config = JSON.parse(data);
        const schemaConfig = addDefaultFields(config);

        verifyConfig(schemaConfig);
        return schemaConfig;
    }

    catch(e) {
        if (e.code == "ENOENT") {
            console.error("config does'nt exist");
            throw(e);
        }

        console.error(e);
        throw e;
    }
}

function addDefaultFields(config: any): IReactPMConfig {
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];

        if (config[field.name]) continue;
        if (field.isRequired) config[field.name] = undefined;
        if (field.default == null || field.default == undefined) continue;

        config[field.name] = field.default;
    }

    return config;
}

export function verifyConfig(config: any) {
    for (let i = 0; i < fields.length; i++) {
        const field = fields[i];

        if (field.chooses) validateChooseArg(config[field.name], field.chooses);

        if (!field.isRequired) continue;
        if (!config[field.name]) throw `Config must contain ${field.name} field`;
    }
}