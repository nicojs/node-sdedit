import { expect } from 'chai';
import * as sinon from 'sinon';
import * as path from 'path';
import * as fs from 'fs';
import Utils from '../../src/Utils';
import SdEditDownloader from '../../src/SdEditDownloader';

describe('SdEditDownloader', () => {
    let sandbox: sinon.SinonSandbox;
    let log: sinon.SinonStub;
    let existsSyncStub: sinon.SinonStub;
    let mkdirSyncStub: sinon.SinonStub;
    let downloadStub: sinon.SinonStub;
    let statSyncStub: sinon.SinonStub;

    beforeEach(() => {
        sandbox = sinon.sandbox.create();
        log = sandbox.stub();
        existsSyncStub = sandbox.stub(fs, 'existsSync');
        downloadStub = sandbox.stub(Utils, 'download');
        mkdirSyncStub = sandbox.stub(fs, 'mkdirSync');
        statSyncStub = sandbox.stub(fs, 'statSync');
    });

    afterEach(() => {
        sandbox.restore();
    });


    describe('update', () => {
        it('should ensure the install dir exists', () => {
            existsSyncStub.returns(false);
            statSyncStub.returns({ size: 1 });
            const sdeditBin = path.resolve(__dirname, '..', '..','sdedit-bin');
            
            const sut = new SdEditDownloader(false, log);
            sut.update();

            expect(existsSyncStub).calledWith(sdeditBin);
            expect(mkdirSyncStub).calledWith(sdeditBin);
        });

        it('should skip download if the file already exists', () => {
            existsSyncStub.returns(false);
            statSyncStub.returns({ size: 1 });
            const sdeditJar = path.resolve(__dirname, '..', '..','sdedit-bin', 'sdedit.jar');
            
            const sut = new SdEditDownloader(false, log);
            sut.update();
            expect(log).calledWith(`[sdedit] File exists, update skipped: ${sdeditJar}. Use -f to override.`);
            expect(statSyncStub).calledWith(sdeditJar);
        });

        it('should download if file is absent', async () => {
            statSyncStub.throws();
            const sut = new SdEditDownloader(false, log);
            downloadStub.resolves();
            await sut.update();
            const url = 'https://github.com/sdedit/sdedit/releases/download/v4.2-beta9/sdedit-4.2-beta9.jar';
            expect(log).calledWith(`[sdedit] Downloading from ${url}...`);
            expect(downloadStub).calledWith(url, path.resolve(__dirname, '..', '..', 'sdedit-bin'), { filename: 'sdedit.jar' });
        });

        it('should download if file is there but is 0 bytes', async () => {
            statSyncStub.returns({ size: 0 });
            const sut = new SdEditDownloader(false, log);
            downloadStub.resolves();
            await sut.update();
            expect(downloadStub).called;
        });

        it('should download if file is there, but force = true', async () => {
            existsSyncStub.returns(false);
            statSyncStub.returns({ size: 1 });
            const sut = new SdEditDownloader(true, log);
            await sut.update();
            expect(log).calledWith('[sdedit] Forcing update');
            expect(downloadStub).called;
        });
    });

});