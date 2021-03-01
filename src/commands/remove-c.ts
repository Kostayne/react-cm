import {Command, flags} from '@oclif/command';
import { ReactCMConfigFinder } from '../api/config_finder';
import { ReactCMConfigLoader } from '../api/config_loader';
import { RemoveBackend, RemoveBackendArgs } from "../commands_backend/remove_backend";

export default class RemoveComponent extends Command {
    static description = `removes component $name`;
    
    static flags = {
        help: flags.help({char: 'h'}),
        force: flags.boolean({char: 'f'}),
    }

    static args = [{name: 'name'}];

    async run() {
        const {args, flags} = this.parse(RemoveComponent);
        const backend = new RemoveBackend(new ReactCMConfigLoader(new ReactCMConfigFinder()), args as RemoveBackendArgs);
        await backend.removeComponent();
    }
}