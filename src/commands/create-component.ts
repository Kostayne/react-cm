import {Command, flags} from '@oclif/command';
import { validateChooseArg } from '../api/chooseArg';
import * as paths from "../api/paths";
// import * as path from "path";
// import * as fs from "fs";
import { CreateBackendArgs, runCreateComponentBackend } from '../commands_backend/create_backend';
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
    const componentPath = paths.getComponentPath(args.name);

    validateChooseArg(args.basedOn, this.basedOnOptions);

    const finder = new ReactPMConfigFinder();
    const loader = new ReactPMConfigLoader(finder);

    runCreateComponentBackend(loader, args as CreateBackendArgs);
  }
}