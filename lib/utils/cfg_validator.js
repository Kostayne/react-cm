"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCMConfigValidator = void 0;
const ajv_1 = require("ajv");
class ReactCMConfigValidator {
    verifyReactCMConfig(cfg) {
        const ajv = new ajv_1.default();
        const templateSchema = {
            type: 'object',
            properties: {
                name: { type: 'string', minLength: 1 },
                path: { type: 'string', minLength: 3 },
                outDir: { type: 'string', minLength: 3 }
            },
            required: ['name', 'path', 'outDir'],
            additionalProperties: false
        };
        const rootSchema = {
            type: 'object',
            properties: {
                templates: {
                    type: 'array',
                    items: templateSchema,
                }
            },
            required: ['templates'],
            additionalProperties: false
        };
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
        return {
            ok: true
        };
    }
}
exports.ReactCMConfigValidator = ReactCMConfigValidator;
