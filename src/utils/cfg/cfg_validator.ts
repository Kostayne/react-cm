import Ajv from "ajv";
import { IReactCMConfig } from "../../types/cfg.type";

export interface IReactCMConfigValidator {
    validateReactCMConfig(cgf: IReactCMConfig): string | undefined;
}

export class ReactCMConfigValidator implements IReactCMConfigValidator {
    public validateReactCMConfig(cfg: IReactCMConfig): string | undefined {
        const ajv = new Ajv();

        const templateSchema = {
            type: 'object',

            properties: {
                name: { type: 'string', minLength: 1 },
                path: { type: 'string', minLength: 3 },
                outDir: { type: 'string', minLength: 3 },
                subDir: { type: 'boolean' }
            },

            required: ['name', 'path'],
            additionalProperties: false
        }

        const rootSchema = {
            type: 'object',
            
            properties: {
                templates: {
                    type: 'array',
                    items: templateSchema,
                },

                defaults: {
                    type: 'object',

                    properties: {
                        outDir: { type: 'string' }
                    }
                },
            },

            required: ['templates'],
            additionalProperties: false
        }

        const validate = ajv.compile(rootSchema);
        const valid = validate(cfg);

        if (!valid && validate.errors) {
            return validate.errors.join('/n_______________/n');
        }

        if (cfg.templates.length == 0) {
            return 'at least one template expected in cfg';
        }

        if (!cfg.defaults?.outDir) {
            for (const t of cfg.templates) {
                if (!t.outDir) {
                    return `in template with name [${t.name}] no outDir property, set default outDir or ${t.name}.outDir`;
                }
            }
        }

        return;
    }
}
