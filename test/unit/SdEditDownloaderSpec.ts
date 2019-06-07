import { expect } from 'chai';
import * as sinon from 'sinon';
import * as path from 'path';
import * as fs from 'fs';
import got = require('got');
import Utils from '../../src/Utils';
import SdEditDownloader from '../../src/SdEditDownloader';

describe('SdEditDownloader', () => {
    let log: sinon.SinonStub;

    class TestHelper {
        existsSyncStub = sinon.stub(fs, 'existsSync');
        streamStub = {
            pipe: sinon.stub(),
            on: sinon.stub()
        };
        streamToPromiseStub = sinon.stub(Utils, 'streamToPromise');
        gotStreamStub = sinon.stub(got, 'stream');
        mkdirSyncStub = sinon.stub(fs, 'mkdirSync');
        statSyncStub = sinon.stub(fs, 'statSync');
        createWriteStream = sinon.stub(fs, 'createWriteStream');

        constructor() {
            this.gotStreamStub.returns(this.streamStub as any);
            this.streamStub.pipe.returns('expected piped value');
        }
    }
    let testHelper: TestHelper;

    beforeEach(() => {
        log = sinon.stub();
        testHelper = new TestHelper();
    });

    describe('update', () => {
        it('should ensure the install dir exists', () => {
            testHelper.existsSyncStub.returns(false);
            testHelper.statSyncStub.returns({ size: 1 } as unknown as fs.Stats);
            const sdeditBin = path.resolve(__dirname, '..', '..', 'sdedit-bin');

            const sut = new SdEditDownloader(false, log);
            sut.update();

            expect(testHelper.existsSyncStub).calledWith(sdeditBin);
            expect(testHelper.mkdirSyncStub).calledWith(sdeditBin);
        });

        it('should skip download if the file already exists', () => {
            testHelper.existsSyncStub.returns(false);
            testHelper.statSyncStub.returns({ size: 1 } as unknown as fs.Stats);
            const sdeditJar = path.resolve(__dirname, '..', '..', 'sdedit-bin', 'sdedit.jar');

            const sut = new SdEditDownloader(false, log);
            sut.update();
            expect(log).calledWith(`[sdedit] File exists, update skipped: ${sdeditJar}. Use -f to override.`);
            expect(testHelper.statSyncStub).calledWith(sdeditJar);
        });

        it('should download if file is absent', async () => {
            testHelper.statSyncStub.throws();
            const sut = new SdEditDownloader(false, log);
            testHelper.streamToPromiseStub.resolves();
            await sut.update();
            const url = 'https://github.com/sdedit/sdedit/releases/download/v4.2-beta9/sdedit-4.2-beta9.jar';
            expect(log).calledWith(`[sdedit] Downloading from ${url}...`);
            expect(testHelper.gotStreamStub).calledWith(url);
            expect(testHelper.createWriteStream).calledWith(path.resolve(__dirname, '..', '..', 'sdedit-bin', 'sdedit.jar'));
            expect(testHelper.streamToPromiseStub).calledWith('expected piped value');
        });

        it('should reject if download rejects', async () => {
            testHelper.statSyncStub.throws();
            const sut = new SdEditDownloader(false, log);
            testHelper.streamToPromiseStub.rejects('download failed');
            let caught = false;
            try {
                await sut.update();
            } catch (error) {
                expect((error as Error).name).eq('download failed');
                caught = true;
            }
            expect(caught).eq(true);
        });

        it('should download if file is there but is 0 bytes', async () => {
            testHelper.statSyncStub.returns({ size: 0 } as unknown as fs.Stats);
            testHelper.streamToPromiseStub.resolves();
            const sut = new SdEditDownloader(false, log);
            await sut.update();
            expect(testHelper.gotStreamStub).called;
        });

        it('should download if file is there, but force = true', async () => {
            testHelper.existsSyncStub.returns(false);
            testHelper.statSyncStub.returns({ size: 1 } as unknown as fs.Stats);
            testHelper.streamToPromiseStub.resolves();
            const sut = new SdEditDownloader(true, log);
            await sut.update();
            expect(log).calledWith('[sdedit] Forcing update');
            expect(testHelper.gotStreamStub).called;
        });
    });

});