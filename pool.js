export class pool {
    constructor(createFn, maxSize = 1) {
        this.createFn = createFn;
        this.pool = [];
        for (let i = 0; i < maxSize; i++) {
            let fn = this.createFn();
            this.pool.push(fn);
        }
    }

    acquire() {
        if (this.pool.length > 0) {
            return Promise.resolve(this.pool.pop());
        } else {
            return new Promise(resolve => {
                const tryAcquire = () => {
                    if (this.pool.length > 0) {
                        resolve(this.pool.pop());
                    } else {
                        setTimeout(tryAcquire, 1);
                    }
                };
                tryAcquire();
            });
        }
    }

    release(obj) {
        this.pool.push(obj);
    }
}