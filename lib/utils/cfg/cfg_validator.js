"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactCMConfigValidator = void 0;
const ajv_1 = require("ajv");
class ReactCMConfigValidator {
    validateReactCMConfig(cfg) {
        var _a;
        const ajv = new ajv_1.default();
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
                defaults: {
                    type: 'object',
                    properties: {
                        outDir: { type: 'string' }
                    }
                },
            },
            required: ['templates'],
            additionalProperties: false,
        };
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
        if (!((_a = cfg.defaults) === null || _a === void 0 ? void 0 : _a.outDir)) {
            for (const t of cfg.templates) {
                if (!t.outDir) {
                    return `in template with name [${t.name}] no outDir property, set default outDir or ${t.name}.outDir`;
                }
            }
        }
        return;
    }
}
exports.ReactCMConfigValidator = ReactCMConfigValidator;
