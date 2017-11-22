import endOfStream = require('end-of-stream');

export default class Utils {
    static streamToPromise(stream: NodeJS.ReadableStream | NodeJS.WritableStream): Promise<void> {
        return new Promise<void>((res, rej) => {
            endOfStream(stream, error => {
                if (error) {
                    rej(error);
                } else {
                    res();
                }
            });
        });
    }
}