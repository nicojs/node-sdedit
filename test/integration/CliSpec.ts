import * as fs from 'fs';
import * as childProcess from 'child_process';
import * as path from 'path';
import { expect } from 'chai';

describe('Cli', function () {

    this.timeout(15000);

    const outputFile = path.resolve(__dirname, '..', '..', 'testResources', 'output.png');

    beforeEach(() => {
        if (fs.existsSync(outputFile)) {
            fs.unlinkSync(outputFile);
        }
    });

    it('should generate a png when called with correct arguments', () => {
        const sdeditBin = path.resolve(__dirname, '..', '..', 'bin', 'sdedit');
        const sdExample = path.resolve(__dirname, '..', '..', 'testResources', 'example.sd');
        childProcess.execSync(`node ${sdeditBin} run -o "${outputFile}" -t png "${sdExample}"`)
        const outputStat = fs.statSync(outputFile);
        expect(outputStat.size).greaterThan(100);
    });
});