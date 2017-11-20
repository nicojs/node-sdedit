const download = require('download');

export default class Utils {

    static download(downloadUrl: string, installDir: string, options: any): Promise<void> {
        return download(downloadUrl, installDir, options);
    }
}