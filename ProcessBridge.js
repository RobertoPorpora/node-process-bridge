import { spawn } from 'child_process';
import os from 'os';
import EventEmitter from 'events';

class ChildProcessBridge extends EventEmitter {
    #stdout_buffer = '';
    #stderr_buffer = '';

    constructor() {
        super();
        this.process = null;
    }

    spawn(command, args) {
        this.process = spawn(command, args, { shell: true });

        this.process.stdout.on('data', (data) => {
            this.#stdout_buffer += data.toString();
            let lines = this.#stdout_buffer.split(os.EOL);
            this.#stdout_buffer = lines.pop();
            lines.forEach((line) => {
                this.emit('receive', line);
            });
        });

        this.process.stderr.on('data', (data) => {
            this.#stderr_buffer += data.toString();
            let lines = this.#stderr_buffer.split(os.EOL);
            this.#stderr_buffer = lines.pop();
            lines.forEach((line) => {
                this.emit('receive_err', line);
            });
        });

        this.process.on('close', (code) => {
            this.emit('close', code);
        });
    }

    despawn() {
        this.process.kill();
    }

    send(message) {
        this.process.stdin.write(`${message}${os.EOL}`);
    }
}

class ParentProcessBridge extends EventEmitter {
    #stdin_buffer = '';

    constructor() {
        super();
        process.stdin.on('data', (data) => {
            this.#stdin_buffer += data.toString();
            let lines = this.#stdin_buffer.split(os.EOL);
            this.#stdin_buffer = lines.pop();
            lines.forEach((line) => {
                this.emit('receive', line);
            });
        });
        process.stdin.on('end', () => {
            this.emit('end');
        });
    }

    send(message) {
        process.stdout.write(`${message}${os.EOL}`);
    }

    send_err(message) {
        process.stderr.write(`${message}${os.EOL}`);
    }
}

export { ChildProcessBridge, ParentProcessBridge };