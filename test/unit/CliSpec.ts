import * as sinon from 'sinon';
import SdEditDownloader, * as sdEditDownloaderModule from '../../src/SdEditDownloader';
import SdEdit, * as sdeditModule from '../../src/SdEdit';
import Cli from '../../src/Cli';
import { expect } from 'chai';

describe('Cli', () => {
    
    let sdEditMock: sinon.SinonStubbedInstance<SdEdit>;
    let sdEditDownloaderMock: sinon.SinonStubbedInstance<SdEditDownloader>;
    let logStub: sinon.SinonStub;

    beforeEach(() => {
        sdEditMock = sinon.createStubInstance(SdEdit);
        sdEditDownloaderMock = sinon.createStubInstance(SdEditDownloader);
        sinon.stub(sdeditModule, 'default').returns(sdEditMock);
        sinon.stub(sdEditDownloaderModule, 'default').returns(sdEditDownloaderMock);
        sdEditDownloaderMock.update.resolves();
        logStub = sinon.stub();
    });


    it('should update', async () => {
        const sut = new Cli(logStub, ['node', 'sdedit', 'update']);
        await sut.run();

        expect(sdEditDownloaderModule.default).calledWith(false);
        expect(sdEditDownloaderModule.default).calledWithNew;
        expect(sdEditDownloaderMock.update).called;
    });

    it('should update with --force', async () => {
        const sut = new Cli(logStub, ['node', 'sdedit', 'update', '--force']);
        await sut.run();
        expect(sdEditDownloaderModule.default).calledWith(/*force*/ true);
    });

    it('should update with -f', async () => {
        const sut = new Cli(logStub, ['node', 'sdedit', 'update', '-f']);
        await sut.run();
        expect(sdEditDownloaderModule.default).calledWith(/*force*/ true);
    });

    it('should run sdedit with arguments', async () => {
        const sut = new Cli(logStub, ['node', 'sdedit', 'run', 'foo', 'bar']);
        await sut.run();
        expect(sdeditModule.default).calledWithNew;
        expect(sdeditModule.default).calledWith(['foo', 'bar']);
        expect(sdEditMock.run).called;
    });

    it('should run sdedit without', async () => {
        const sut = new Cli(logStub, ['node', 'sdedit', 'run']);
        await sut.run();
        expect(sdeditModule.default).calledWithNew;
        expect(sdeditModule.default).calledWith([]);
        expect(sdEditMock.run).called;
    });

    it('should print help if called without args', async () => {
        const sut = new Cli(logStub, ['node', 'sdedit']);
        await sut.run();
        expect(logStub).calledWith('Run Markus Strauch\'s sdedit (java tool).');
    });
});