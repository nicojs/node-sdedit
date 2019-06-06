import * as childProcess from 'child_process';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { SdEdit } from '../../src/index';
import * as path from 'path';
import * as fs from 'fs';

const sdeditJar = path.resolve(__dirname, '..', '..', 'sdedit-bin', 'sdedit.jar');

describe('SdEdit', () => {

    let execSyncStub: sinon.SinonStub<[string, (childProcess.ExecSyncOptions | undefined)?], Buffer>;
    let log: sinon.SinonStub;
    let fsExistsSyncStub: sinon.SinonStub<[fs.PathLike], boolean>;

    beforeEach(() => {
        execSyncStub = sinon.stub(childProcess, 'execSync');
        log = sinon.stub();
        fsExistsSyncStub = sinon.stub(fs, 'existsSync');
    });

    describe('run', () => {
        
        it('should run without arguments', () => {
            const sut = new SdEdit([], log);
            fsExistsSyncStub.returns(true);
            sut.run();
            expect(execSyncStub).calledWith(`java -jar "${sdeditJar}"`);
        });

        it('should run and passing the arguments', () => {
            const sut = new SdEdit(['--some-setting', 'foo bar'], log);
            fsExistsSyncStub.returns(true);
            sut.run();
            expect(execSyncStub).calledWith(`java -jar "${sdeditJar}" "--some-setting" "foo bar"`);
        });

        it('should log an error and throw if sdedit jar does not exist', () => {
            const sut = new SdEdit([], log);
            fsExistsSyncStub.returns(false);
            expect(() => sut.run()).throws(`File not found '${sdeditJar}', please run \`sdedit update\`.`);
            expect(log).calledWith('[sdedit] Cannot find sdedit.jar. Please run `sdedit update` before running this command.');
            expect(execSyncStub).not.called;
            expect(fsExistsSyncStub).calledWith(sdeditJar);
        });
        
    });
});