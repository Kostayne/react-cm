"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const config_finder_1 = require("../api/config_finder");
const config_loader_1 = require("../api/config_loader");
const remove_backend_1 = require("../commands_backend/remove_backend");
class RemoveComponent extends command_1.Command {
    async run() {
        const { args, flags } = this.parse(RemoveComponent);
        const backend = new remove_backend_1.RemoveBackend(new config_loader_1.ReactCMConfigLoader(new config_finder_1.ReactCMConfigFinder()), args);
        await backend.removeComponent();
    }
}
exports.default = RemoveComponent;
RemoveComponent.description = `removes component $name`;
RemoveComponent.flags = {
    help: command_1.flags.help({ char: 'h' }),
    force: command_1.flags.boolean({ char: 'f' }),
};
RemoveComponent.args = [{ name: 'name' }];
