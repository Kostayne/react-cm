"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const create_backend_1 = require("../commands_backend/create_backend");
const config_loader_1 = require("../api/config_loader");
const config_finder_1 = require("../api/config_finder");
class CreateComponent extends command_1.Command {
    async run() {
        const { args, flags } = this.parse(CreateComponent);
        const finder = new config_finder_1.ReactCMConfigFinder();
        const loader = new config_loader_1.ReactCMConfigLoader(finder);
        const backend = new create_backend_1.CreateComponentBackend(loader, args);
        backend.createComponent();
    }
}
exports.default = CreateComponent;
CreateComponent.description = 'creates component $name $based-on';
CreateComponent.flags = {
    help: command_1.flags.help({ char: 'h' }),
    force: command_1.flags.boolean({ char: 'f' }),
};
CreateComponent.args = [
    { name: 'name', required: true },
    { name: "basedOn", required: true, options: ["class", "fn"] }
];
