import { expect } from 'chai';
import * as sinon from 'sinon';
import * as path from 'path';
import * as fs from 'fs';
import got = require('got');
import Utils from '../../src/Utils';
import SdEditDownloader from '../../src/SdEditDownloader';

describe('SdEditDownloader', () => {
    let log: sinon.SinonStub;
    let existsSyncStub: sinon.SinonStub;
    let mkdirSyncStub: sinon.SinonStub;
    let gotStreamStub: sinon.SinonStub;
    let statSyncStub: sinon.SinonStub;
    let streamStub: {
        pipe: sinon.SinonStub;
        on: sinon.SinonStub;
    };
    let streamToPromiseStub: sinon.SinonStub;
    let createWriteStream: sinon.SinonStub;

    beforeEach(() => {
        log = sinon.stub();
        existsSyncStub = sinon.stub(fs, 'existsSync');
        streamStub = {
            pipe: sinon.stub(),
            on: sinon.stub()
        };
        streamToPromiseStub = sinon.stub(Utils, 'streamToPromise');
        gotStreamStub = sinon.stub(got, 'stream');
        gotStreamStub.returns(streamStub);
        mkdirSyncStub = sinon.stub(fs, 'mkdirSync');
        statSyncStub = sinon.stub(fs, 'statSync');
        createWriteStream = sinon.stub(fs, 'createWriteStream');
        streamStub.pipe.returns('expected piped value');
    });

    describe('update', () => {
        it('should ensure the install dir exists', () => {
            existsSyncStub.returns(false);
            statSyncStub.returns({ size: 1 });
            const sdeditBin = path.resolve(__dirname, '..', '..', 'sdedit-bin');

            const sut = new SdEditDownloader(false, log);
            sut.update();

            expect(existsSyncStub).calledWith(sdeditBin);
            expect(mkdirSyncStub).calledWith(sdeditBin);
        });

        it('should skip download if the file already exists', () => {
            existsSyncStub.returns(false);
            statSyncStub.returns({ size: 1 });
            const sdeditJar = path.resolve(__dirname, '..', '..', 'sdedit-bin', 'sdedit.jar');

            const sut = new SdEditDownloader(false, log);
            sut.update();
            expect(log).calledWith(`[sdedit] File exists, update skipped: ${sdeditJar}. Use -f to override.`);
            expect(statSyncStub).calledWith(sdeditJar);
        });

        it('should download if file is absent', async () => {
            statSyncStub.throws();
            const sut = new SdEditDownloader(false, log);
            streamToPromiseStub.resolves();
            await sut.update();
            const url = 'https://github.com/sdedit/sdedit/releases/download/v4.2-beta9/sdedit-4.2-beta9.jar';
            expect(log).calledWith(`[sdedit] Downloading from ${url}...`);
            expect(gotStreamStub).calledWith(url);
            expect(createWriteStream).calledWith(path.resolve(__dirname, '..', '..', 'sdedit-bin', 'sdedit.jar'));
            expect(streamToPromiseStub).calledWith('expected piped value');
        });

        it('should reject if download rejects', async () => {
            statSyncStub.throws();
            const sut = new SdEditDownloader(false, log);
            streamToPromiseStub.rejects('download failed');
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
            statSyncStub.returns({ size: 0 });
            streamToPromiseStub.resolves();
            const sut = new SdEditDownloader(false, log);
            await sut.update();
            expect(gotStreamStub).called;
        });

        it('should download if file is there, but force = true', async () => {
            existsSyncStub.returns(false);
            statSyncStub.returns({ size: 1 });
            streamToPromiseStub.resolves();
            const sut = new SdEditDownloader(true, log);
            await sut.update();
            expect(log).calledWith('[sdedit] Forcing update');
            expect(gotStreamStub).called;
        });
    });

});