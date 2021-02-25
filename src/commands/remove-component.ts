import {Command, flags} from '@oclif/command';

export default class RemoveComponent extends Command {
    static description = `removes component $name`;
    
    static flags = {
        help: flags.help({char: 'h'}),
        force: flags.boolean({char: 'f'}),
    }

    static args = [{name: 'name'}];

    async run() {
        const {args, flags} = this.parse(RemoveComponent);
        console.log(`- ${args.name}`);
    }
}