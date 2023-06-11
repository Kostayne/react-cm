import Ajv from "ajv";
import { IReactCMConfig } from "../../types/cfg.type";

export interface IReactCMConfigValidator {
    validateReactCMConfig(cgf: IReactCMConfig): string | undefined;
}

export class ReactCMConfigValidator implements IReactCMConfigValidator {
    public validateReactCMConfig(cfg: IReactCMConfig): string | undefined {
        const ajv = new Ajv();

        const archSchema = {
            type: 'object',

            properties: {
                name: { type: 'string', minLength: 1 },
                pathPrefix: { type: 'string', minLength: 1 },
                subdirName: { type: 'string', minLength: 1 },
            },

            required: ['name', 'pathPrefix', 'subdirName'],
        };

        const rewriteSchema = {
            type: 'object',

            properties: {
                from: { type: 'string', minLength: 1 },
                to: { type: 'string', minLength: 1 },
            },

            required: ['from', 'to'],
            additionalProperties: false,
        };

        const templateSchema = {
            type: 'object',

            properties: {
                name: { type: 'string', minLength: 1 },
                path: { type: 'string', minLength: 1 },
                outDir: { type: 'string', minLength: 1 },
                subDir: { type: 'boolean' },

                rewrites: {
                    type: 'array',
                    items: rewriteSchema,
                },

                usingArches: {
                    type: 'array',
                    items: {
                        type: 'string',
                        minLength: 1,
                    },
                },
            },

            required: ['name', 'path'],
            additionalProperties: false,
        };

        const customPathSchema = {
            type: 'object',
            
            properties: {
                name: { type: 'string', minLength: 1 },
                value: { type: 'string', minLength: 1 },
            },

            required: ['name', 'value'],
            additionalProperties: false,
        };

        const rootSchema = {
            type: 'object',
            
            properties: {
                templates: {
                    type: 'array',
                    items: templateSchema,
                },

                paths: {
                    type: 'array',
                    items: customPathSchema,
                },

                autoArches: {
                    type: 'array',
                    items: archSchema,
                },
                
                defaults: {
                    type: 'object',

                    properties: {
                        outDir: { type: 'string' }
                    }
                },
            },

            required: ['templates'],
            additionalProperties: false,
        }

        const validate = ajv.compile(rootSchema);
        const valid = validate(cfg);

        if (!valid && validate.errors) {
            const errorInfo = validate.errors.map(msg => {
                return {
                    params: msg.params,
                    msg: msg.message,
                };
            });

            const messagesToShow = errorInfo.map(info => JSON.stringify(info, null, 4));
            return messagesToShow.join('/n_______________/n');
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
