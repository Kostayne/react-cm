"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const create_backend_1 = require("../commands_backend/create_backend");
const config_loader_1 = require("../config_loader");
const config_finder_1 = require("../config_finder");
const cfg_validator_1 = require("../utils/cfg_validator");
class CreateComponent extends command_1.Command {
    async run() {
        const { args, flags } = this.parse(CreateComponent);
        const cfgFinder = new config_finder_1.ReactCMConfigFinder();
        const cfgValidator = new cfg_validator_1.ReactCMConfigValidator();
        const cfgLoader = new config_loader_1.ReactCMConfigLoader(cfgFinder);
        const cfg = await cfgLoader.loadCfg();
        const cfgValidationResult = cfgValidator.verifyReactCMConfig(cfg);
        if (cfgValidationResult.errMsg) {
            console.error('Config is not valid\n--------------------');
            return console.error(cfgValidationResult.errMsg);
        }
        const backend = new create_backend_1.CreateComponentBackend(cfg, args, flags);
        backend.createComponent();
    }
}
exports.default = CreateComponent;
CreateComponent.description = 'creates component with provided name and template';
CreateComponent.flags = {
    help: command_1.flags.help({ char: 'h' }),
    out: command_1.flags.string({
        char: 'o',
        description: 'path to create component',
        multiple: false,
        required: false
    }),
    subdir: command_1.flags.boolean({
        char: 's',
        description: 'create subdir?',
        required: false
    })
};
CreateComponent.args = [
    { name: 'template', required: true },
    { name: 'name', required: true },
];
