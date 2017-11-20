import * as childProcess from 'child_process';
import * as path from 'path';
import * as fs from 'fs';
import constants from './constants';

const sdeditJar = path.resolve(constants.sdeditInstallDirectory, constants.sdeditFilename);

export default class SdEdit {

    constructor(private args: string[], private log = console.log) {
    }

    run() {
        if (fs.existsSync(sdeditJar)) {
            const cmd = `java -jar "${sdeditJar}"${this.args.map(arg => ` "${arg}"`).join('')}`;
            this.log(`[sdedit] Running '${cmd}'...`);
            childProcess.execSync(cmd);
        } else {
            this.log(`[sdedit] Cannot find sdedit.jar. Please run \`sdedit update\` before running this command.`)
            throw new Error(`File not found '${sdeditJar}', please run \`sdedit update\`.`);
        }
    }
}