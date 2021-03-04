import {Command, flags} from '@oclif/command';
import { IReactCMConfig } from '../api/cfg';
import { ReactCMConfigFinder } from '../api/config_finder';
import { ReactCMConfigLoader } from '../api/config_loader';
import { ReactCMConfigValidator } from '../api/validator_cfg';
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
        const validator = new ReactCMConfigValidator<IReactCMConfig>();
        const backend = new RemoveBackend(new ReactCMConfigLoader(new ReactCMConfigFinder(), validator), args as RemoveBackendArgs);
        await backend.removeComponent();
    }
}