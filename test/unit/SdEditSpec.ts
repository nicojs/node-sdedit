import * as childProcess from 'child_process';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { SdEdit } from '../../src/index';
import * as path from 'path';
import * as fs from 'fs';

const sdeditJar = path.resolve(__dirname, '..', '..', 'sdedit-bin', 'sdedit.jar');

describe('SdEdit', () => {

    class TestHelper {
        execSyncStub = sinon.stub(childProcess, 'execSync');
        log = sinon.stub();
        fsExistsSyncStub = sinon.stub(fs, 'existsSync');
    }
    let testHelper: TestHelper;

    beforeEach(() => {
        testHelper = new TestHelper();
    });

    describe('run', () => {
        
        it('should run without arguments', () => {
            const sut = new SdEdit([], testHelper.log);
            testHelper.fsExistsSyncStub.returns(true);
            sut.run();
            expect(testHelper.execSyncStub).calledWith(`java -jar "${sdeditJar}"`);
        });

        it('should run and passing the arguments', () => {
            const sut = new SdEdit(['--some-setting', 'foo bar'], testHelper.log);
            testHelper.fsExistsSyncStub.returns(true);
            sut.run();
            expect(testHelper.execSyncStub).calledWith(`java -jar "${sdeditJar}" "--some-setting" "foo bar"`);
        });

        it('should testHelper.log an error and throw if sdedit jar does not exist', () => {
            const sut = new SdEdit([], testHelper.log);
            testHelper.fsExistsSyncStub.returns(false);
            expect(() => sut.run()).throws(`File not found '${sdeditJar}', please run \`sdedit update\`.`);
            expect(testHelper.log).calledWith('[sdedit] Cannot find sdedit.jar. Please run `sdedit update` before running this command.');
            expect(testHelper.execSyncStub).not.called;
            expect(testHelper.fsExistsSyncStub).calledWith(sdeditJar);
        });
        
    });
});