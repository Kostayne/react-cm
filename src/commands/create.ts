import { Command, flags } from '@oclif/command';
import { CreateBackendArgs, CreateComponentBackend } from '../commands_backend/create.backend';
import { ReactCMConfigLoader } from '../utils/cfg/config_loader';
import { ReactCMConfigFinder } from '../utils/cfg/config_finder';
import { ReactCMConfigValidator } from '../utils/cfg/cfg_validator';
import { CmdFlag } from '../types/cmd_flag.type';

export default class CreateComponent extends Command {
  static description = 'creates component with provided name and template';

  static flags = {
    help: flags.help({ char: 'h' }),

    out: flags.string({
      char: 'o',
      description: 'path to create component',
      multiple: false,
      required: false
    }),

    subdir: flags.boolean({
      char: 's',
      description: 'create subdir?',
      required: false
    })
  };

  static args = [
    { name: 'template', required: true },
    { name: 'name', required: true },
  ];

  async run() {
    const { args, flags } = this.parse(CreateComponent);

    const cfgFinder = new ReactCMConfigFinder();
    const cfgValidator = new ReactCMConfigValidator();
    const cfgLoader = new ReactCMConfigLoader(cfgFinder);
    const cfg = await cfgLoader.loadCfg();
    const cfgErrorMsg = cfgValidator.validateReactCMConfig(cfg);

    if (cfgErrorMsg) {
      console.error('Config is not valid\n--------------------');
      return console.error(cfgErrorMsg);
    }

    const backend = new CreateComponentBackend(
      cfg, 
      args as CreateBackendArgs, 
      flags as unknown as CmdFlag
    );

    backend.createComponent();
  }
}
