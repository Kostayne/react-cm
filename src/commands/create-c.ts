import {Command, flags} from '@oclif/command';
import { CreateBackendArgs, CreateComponentBackend } from '../commands_backend/create_backend';
import { ReactCMConfigLoader } from '../api/config_loader';
import { ReactCMConfigFinder } from '../api/config_finder';
import { ReactCMConfigValidator } from '../api/validator_cfg';
import { IReactCMConfig } from '../api/cfg';

export default class CreateComponent extends Command {
  static description = 'creates component $name $based-on';

  static flags = {
    help: flags.help({char: 'h'}),
    force: flags.boolean({char: 'f'}),
  }

  static args = [
    { name: 'name', required: true }, 
    { name: "basedOn", required: true }
  ];

  async run() {
    const { args, flags } = this.parse(CreateComponent);

    const finder = new ReactCMConfigFinder();
    const validator = new ReactCMConfigValidator<IReactCMConfig>();
    const loader = new ReactCMConfigLoader(finder, validator);

    const backend = new CreateComponentBackend(loader, args as CreateBackendArgs);
    backend.createComponent();
  }
}