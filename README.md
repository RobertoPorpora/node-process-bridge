# ProcessBridge

**ProcessBridge** is a Node.js library designed to facilitate inter-process communication between a parent process and a child process.  
It provides a simple API for spawning and managing child processes, capturing their output, and communicating between the parent and child processes.  
This library is not yet available as an npm module and must be manually imported into your project.

## Features

- **Child Process Management:** Easily spawn and manage child processes.
- **Event-Driven Communication:** Use event emitters to handle communication between processes.
- **Standard Output and Error Handling:** Capture and handle both stdout and stderr from the child process.
- **Bidirectional Messaging:** Send messages from the parent process to the child process and vice versa.

## Installation

Since this library is not available via npm, you need to manually download the `ProcessBridge.js` file and include it in your project.

1. Download `ProcessBridge.js`.
2. Place the file in your project directory.
3. Import the classes into your Node.js application:

```javascript
import { ChildProcessBridge, ParentProcessBridge } from './ProcessBridge.js';
```

## Usage

### 1. Child Process Communication

The `ChildProcessBridge` class allows you to spawn a child process and handle its standard output and error streams.

```javascript
import { ChildProcessBridge } from './ProcessBridge.js';

const childBridge = new ChildProcessBridge();

childBridge.spawn('node', ['childScript.js']); // Spawn a child process running 'childScript.js'

// Listen for messages from the child process
childBridge.on('receive', (message) => {
    console.log('Child process says:', message);
});

// Listen for error messages from the child process
childBridge.on('receive_err', (error) => {
    console.error('Child process error:', error);
});

// Listen for the child process to close
childBridge.on('close', (code) => {
    console.log('Child process exited with code:', code);
});

// Send a message to the child process
childBridge.send('Hello from parent!');

// Terminate the child process
childBridge.despawn();
```

### 2. Parent Process Communication

The `ParentProcessBridge` class allows the parent process to handle incoming messages and send responses back to the child process.

```javascript
import { ParentProcessBridge } from './ProcessBridge.js';

const parentBridge = new ParentProcessBridge();

// Listen for messages from the parent process
parentBridge.on('receive', (message) => {
    console.log('Parent process received:', message);
});

// Send a message to the parent process
parentBridge.send('Hello from child!');

// Send an error message to the parent process
parentBridge.send_err('An error occurred!');
```

## API

### ChildProcessBridge

- **`spawn(command: string, args: string[])`**: Spawns a new child process.
- **`send(message: string)`**: Sends a message to the child process's stdin.
- **`despawn()`**: Terminates the child process.
- **Events**:
  - **`receive`**: Emitted when the child process sends a message via stdout.
  - **`receive_err`**: Emitted when the child process sends a message via stderr.
  - **`close`**: Emitted when the child process exits.

### ParentProcessBridge

- **`send(message: string)`**: Sends a message to the parent process's stdout.
- **`send_err(message: string)`**: Sends a message to the parent process's stderr.
- **Events**:
  - **`receive`**: Emitted when the parent process receives a message via stdin.
  - **`end`**: Emitted when the parent process's stdin ends.

## License

This library is provided under the MIT License. Feel free to use and modify it according to your needs.