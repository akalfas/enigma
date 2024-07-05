export class rpc {
    constructor(workerPool) {
        this.workerPool = workerPool;
    }

    release(worker, messageChannel) {
        this.workerPool.release({worker, messageChannel});
    }

    async waitFor(worker, messageChannel) {
        return new Promise(resolve => {
            messageChannel.port2.onmessage = (event) => {
                this.release(worker, messageChannel);
                resolve(event.data);
            };
        });
    }

    async work(buffer) {
        let {worker, messageChannel} = await this.workerPool.acquire();
        let result = this.waitFor(worker, messageChannel);
        messageChannel.port2.postMessage({buffer}, [buffer]);
        return result;
    }
}