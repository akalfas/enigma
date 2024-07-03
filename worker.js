import {initSync} from "/pkg/enigma.js";
import {t_test} from "/pkg/enigma.js";


function fill(count) {
    let tbs = new Uint32Array(count);
    for (let i = 0; i < tbs.length; i++) {
        tbs[i] = Math.random() * 1000;
    }
    return tbs;
}

self.onmessage = (x) => {
    let data = x.data;
    let {wasm} = data;
    initSync(wasm);
    let left = fill(100);
    let right = fill(100_000);
    let result = t_test(left, right);
    self.postMessage({type: "done", recipient: self.name, result});
};

self.postMessage({type: "ready", recipient: self.name});
