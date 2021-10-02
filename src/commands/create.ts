import { Command, flags } from '@oclif/command';
import { CreateBackendArgs, CreateComponentBackend } from '../commands_backend/create_backend';
import { ReactCMConfigLoader } from '../config_loader';
import { ReactCMConfigFinder } from '../config_finder';
import { ReactCMConfigValidator } from '../utils/cfg_validator';
import { CmdFlag } from '../types';

export default class CreateComponent extends Command {
  static description = 'creates component with provided name and template';

  static flags = {
    help: flags.help({ char: 'h' }),

    out: flags.string({
      char: 'o',
      description: 'path to create component',
      multiple: false,
      required: false
    })
  }

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
    const cfgValidationResult = cfgValidator.verifyReactCMConfig(cfg);

    if (cfgValidationResult.errMsg) {
      console.error('Config is not valid\n--------------------');
      return console.error(cfgValidationResult.errMsg);
    }

    const backend = new CreateComponentBackend(cfg, args as CreateBackendArgs, flags as unknown as CmdFlag);
    backend.createComponent();
  }
}