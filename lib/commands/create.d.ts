import { Command, flags } from '@oclif/command';
export default class CreateComponent extends Command {
    static description: string;
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        out: flags.IOptionFlag<string | undefined>;
        subdir: import("@oclif/parser/lib/flags").IBooleanFlag<boolean>;
    };
    static args: {
        name: string;
        required: boolean;
    }[];
    static aliases: string[];
    run(): Promise<void>;
}
