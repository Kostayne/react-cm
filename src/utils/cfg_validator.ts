import Ajv from "ajv";
import { IReactCMConfig } from "../cfg";

export interface IReactCMConfigValidator {
    verifyReactCMConfig(cgf: IReactCMConfig): ValidationRes;
}

export interface ValidationRes{
    ok: boolean,
    errMsg?: string | any,
}

export class ReactCMConfigValidator implements IReactCMConfigValidator {
    public verifyReactCMConfig(cfg: IReactCMConfig): ValidationRes {
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
                }
            },

            required: ['templates'],
            additionalProperties: false
        }

        const validate = ajv.compile(rootSchema);
        const valid = validate(cfg);

        if (!valid && validate.errors) {
            return {
                errMsg: validate.errors,
                ok: false
            };
        }

        if (cfg.templates.length == 0) {
            return {
                errMsg: 'at least one template expected in cfg',
                ok: false
            };
        }

        if (!cfg.defaults?.outDir) {
            for (const t of cfg.templates) {
                if (!t.outDir) {
                    return {
                        ok: false,
                        errMsg: `in template with name [${t.name}] no outDir property, set default outDir or ${t.name}.outDir`
                    };
                }
            }
        }

        return {
            ok: true
        };
    }
}