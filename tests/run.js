import { strict as assert } from 'assert';

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const this_folder = dirname(fileURLToPath(import.meta.url));
const PB = await import(join(dirname(this_folder), 'ProcessBridge.js'));

let timer = Date.now();
let receive_counter = 0;
let child = new PB.ChildProcessBridge();
child.spawn('node', [join(this_folder, 'child.js')]);

child.on("receive", (data) => {
    receive_counter++;
    data_check({
        is_err: false,
        data: data,
        receive_counter: receive_counter
    })
});

child.on("receive_err", (data) => {
    receive_counter++;
    data_check({
        is_err: true,
        data: data,
        receive_counter: receive_counter
    });
});

child.on("close", (code) => {
    receive_counter++;
    data_check({
        is_err: false,
        data: code,
        receive_counter: receive_counter
    });
});

function data_check(obj) {
    switch (obj.receive_counter) {
        case 1:  // receive stdout
            assert.equal(obj.is_err, false);
            assert.equal(obj.data, "this is stdout");
            break;
        case 2: // receive stderr + send something
            assert.equal(obj.is_err, true);
            assert.equal(obj.data, "this is stderr");
            timer = Date.now();
            child.send('something');
            break;
        case 3: // receive something
            assert.equal(obj.is_err, false);
            assert.equal(obj.data, "user input = 'something'");
            child.despawn();
            break;
        case 4: // check closing
            assert.equal(obj.is_err, false);
            assert.notEqual(obj.data, 12);
            timer = Date.now() - timer;
            assert.equal(timer < 1000, true);
            child.spawn('node', [join(this_folder, 'child.js')]);
            break;
        case 5:  // receive stdout
            assert.equal(obj.is_err, false);
            assert.equal(obj.data, "this is stdout");
            break;
        case 6: // receive stderr + send something
            assert.equal(obj.is_err, true);
            assert.equal(obj.data, "this is stderr");
            timer = Date.now();
            child.send('other things');
            break;
        case 7: // receive something
            assert.equal(obj.is_err, false);
            assert.equal(obj.data, "user input = 'other things'");
            break;
        case 8: // check closing
            assert.equal(obj.is_err, false);
            assert.equal(obj.data, 12);
            timer = Date.now() - timer;
            assert.equal(timer >= 1000, true);
            console.log('test completed succesfully.');
            break;
        case 0:
        default:
            assert.fail();
            break;
    }
}