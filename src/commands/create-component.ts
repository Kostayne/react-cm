import {Command, flags} from '@oclif/command';
import { validateChooseArg } from '../api/chooseArg';
import * as paths from "../api/paths";
import * as path from "path";
import * as fs from "fs";

export default class CreateComponent extends Command {
  static description = 'creates component $name $based-on';

  static flags = {
    help: flags.help({char: 'h'}),
    force: flags.boolean({char: 'f'}),
  }

  protected basedOnOptions = ["class", "fn"];

  static args = [{name: 'name'}, {name: "basedOn"}];

  async run() {
    // TODO
    // HAVE TO LOAD DATA FROM CFG
    const {args, flags} = this.parse(CreateComponent);
    const componentPath = paths.getComponentPath(args.name);

    validateChooseArg(args.basedOn, this.basedOnOptions);

    const templatePath = args.basedOn == "class"? paths.cTemplatePath : paths.fnTemplatePath;
    const newComponentIndexPath = path.join(paths.componentsPath, path.basename(templatePath));

    try {
      await fs.promises.access(paths.componentsPath);
    }

    catch(e) {
      if (e.code == "ENOENT") {
        await fs.promises.mkdir(paths.componentsPath, { recursive: true });
      }

      console.error(e);
      throw(e);
    }

    try {
      await fs.promises.copyFile(templatePath, newComponentIndexPath, fs.constants.COPYFILE_FICLONE);
    }

    catch(e) {
      console.error(e);
      throw(e);
    }
  }
}