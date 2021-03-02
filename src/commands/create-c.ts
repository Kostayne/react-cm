import {Command, flags} from '@oclif/command';
import { CreateBackendArgs, CreateComponentBackend } from '../commands_backend/create_backend';
import { ReactCMConfigLoader } from '../api/config_loader';
import { ReactCMConfigFinder } from '../api/config_finder';

export default class CreateComponent extends Command {
  static description = 'creates component $name $based-on';

  static flags = {
    help: flags.help({char: 'h'}),
    force: flags.boolean({char: 'f'}),
  }

  static args = [
    { name: 'name', required: true }, 
    { name: "basedOn", required: true, options: ["class", "fn"] }
  ];

  async run() {
    const { args, flags } = this.parse(CreateComponent);

    const finder = new ReactCMConfigFinder();
    const loader = new ReactCMConfigLoader(finder);

    const backend = new CreateComponentBackend(loader, args as CreateBackendArgs);
    backend.createComponent();
  }
}