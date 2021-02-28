import {Command, flags} from '@oclif/command';
import { validateChooseArg } from '../api/chooseArg';
import { CreateBackendArgs, CreateComponentBackend } from '../commands_backend/create_backend';
import { ReactPMConfigLoader } from '../api/config_loader';
import { ReactPMConfigFinder } from '../api/config_finder';

export default class CreateComponent extends Command {
  static description = 'creates component $name $based-on';

  static flags = {
    help: flags.help({char: 'h'}),
    force: flags.boolean({char: 'f'}),
  }

  protected basedOnOptions = ["class", "fn"];

  static args = [{name: 'name'}, {name: "basedOn"}];

  async run() {
    const {args, flags} = this.parse(CreateComponent);
    validateChooseArg(args.basedOn, this.basedOnOptions);

    const finder = new ReactPMConfigFinder();
    const loader = new ReactPMConfigLoader(finder);

    const backend = new CreateComponentBackend(loader, args as CreateBackendArgs);
    backend.createComponent();
  }
}