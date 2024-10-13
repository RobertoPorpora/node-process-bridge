import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
const this_folder = dirname(fileURLToPath(import.meta.url));
const PB = await import(join(dirname(this_folder),'ProcessBridge.js'));

let parent = new PB.ParentProcessBridge();

parent.send('this is stdout');
parent.send_err('this is stderr');

parent.on('receive', (data) => {
    parent.send(`user input = '${data}'`);
    setTimeout(() => {
        process.exit(12);
    }, 1000);
});


