import * as path from 'path';
import SdEditDownloader from './SdEditDownloader';
import SdEdit from './SdEdit';

export default class Cli {

    constructor(private args: string[]) {
    }

    public run(): void | Promise<void> {
        if (this.args.length <= 2 || this.hasFlag('--help', '-h')) {
            this.printHelp();
        } else if (this.args[2] === 'update') {
            return Promise.resolve(new SdEditDownloader(this.hasFlag('-f', '--force')).update())
                .catch((error: any) => {
                    console.error('Download failed', error);
                });
        } else if (this.args[2] === 'run') {
            new SdEdit(this.args.slice(3)).run();
        } else {
            this.printHelp();
        }
    }

    private hasFlag(...synonyms: string[]) {
        return synonyms.some(syn => this.args.indexOf(syn) >= 0);
    }

    private printHelp() {
        const sdedit = path.basename(this.args[1]);
        const l = console.log;

        l();
        l('Run Markus Strauch\'s sdedit (java tool).');
        l();
        l('Usage:');
        l(` ${sdedit} update`);
        l(` ${sdedit} run`);
        l(` ${sdedit} run [arguments]`);
        l();
        l('Download and run the sdedit jar.');
        l();
        l('Options: ');
        l();
        l(' -h, --help     Output this help');
        l(' [arguments]    Any of the arguments documented here: http://sdedit.sourceforge.net/command_line/index.html');
        l();
        l('Examples: ');
        l(` ${sdedit} update`);
        l('   Installs the sdedit.jar');
        l(` ${sdedit} run`);
        l('   Run the sdedit UI');
        l(` ${sdedit} run -o /tmp/sequence.png -t png /tmp/examples/sequence.sd`);
        l('   Creates /tmp/sequence.png based on the sequence diagram in /tmp/examples/sequence.sd.');
    }
}
