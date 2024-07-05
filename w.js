import {initSync, t_test} from "./pkg/enigma.js";
// Handle messages from the main thread
self.onmessage = (event) => {
    const port = event.data.port;
    const wasm = event.data.wasm;
    initSync(wasm);
    port.onmessage = (event) => {
        const result = performTask();
        port.postMessage(result);
    };
};

const filler = (size) => {
    let tbs = new Uint32Array(size);
    for (let i = 0; i < tbs.length; i++) {
        tbs[i] = Math.random() * 1000;
    }
    return tbs;
};

// Function to perform the CPU-intensive task
function performTask() {
    let left = filler(100);
    let right = filler(100_000);
    return t_test(left, right);
}
