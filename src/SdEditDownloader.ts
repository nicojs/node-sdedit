import * as path from 'path';
import * as fs from 'fs';
import constants from './constants';
import got = require('got');
import Utils from './Utils';

export default class SdEditDownloader {

    constructor(private force: boolean, private log = console.log) {
    }

    update(): void | Promise<void> {
        this.ensureInstallDirExists();
        const updateNeeded = this.isUpdateNeeded();
        if (updateNeeded) {
            return this.downloadSdEdit()
                .then(() => this.log('[sdedit] Download completed'));
        }
    }

    private downloadSdEdit(): Promise<void> {
        const downloadUrl = `https://github.com/sdedit/sdedit/releases/download/v${constants.currentSdEditVersion}/sdedit-${constants.currentSdEditVersion}.jar`;
        const destination = path.resolve(constants.sdeditInstallDirectory, constants.sdeditFilename);
        this.log(`[sdedit] Downloading from ${downloadUrl}...`);

        return this.download(downloadUrl, destination);
    }

    private download(downloadUrl: string, destination: string): Promise<void> {
        return Utils.streamToPromise(got.stream(downloadUrl).pipe(fs.createWriteStream(destination));
    }

    private isUpdateNeeded(): boolean {
        if (this.force) {
            this.log('[sdedit] Forcing update');
            return true;
        }
        try {
            const jarPath = path.resolve(constants.sdeditInstallDirectory, constants.sdeditFilename);
            const stat = fs.statSync(jarPath);
            if (stat.size > 0) {
                this.log(`[sdedit] File exists, update skipped: ${jarPath}. Use -f to override.`);
                return false;
            } else {
                return true;
            }
        } catch {
            return true;
        }
    }

    private ensureInstallDirExists(): void {
        if (!fs.existsSync(constants.sdeditInstallDirectory)) {
            fs.mkdirSync(constants.sdeditInstallDirectory);
        }
    }
}