document.addEventListener('DOMContentLoaded', function () {
    const debugConsole = document.getElementById('debug-console');
    const statusText = document.getElementById('status-text');

    // Function to get the current timestamp
    function getTimestamp() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    // Function to update the debug console with timestamps
    function updateDebugConsole(command, response) {
        const timestamp = getTimestamp();
        const message = `[${timestamp}] Sent: ${command}, Received: ${response}`;
        debugConsole.innerHTML += message + '<br>';
        // Automatically scroll to the bottom of the debug console
        debugConsole.scrollTop = debugConsole.scrollHeight;
    }

    // Function to send a command to the ESP32
    function sendCommand(command) {
        // Add code to send the command to the ESP32 and receive a response
        const response = 'Confirmation from ESP32'; // Replace with actual response
        updateDebugConsole(command, response);
    }

    // Button click event listeners for basic control
    document.getElementById('up').addEventListener('click', function () {
        statusText.textContent = 'Moving Forward';
        sendCommand('Move Forward');
    });

    document.getElementById('down').addEventListener('click', function () {
        statusText.textContent = 'Moving Backward';
        sendCommand('Move Backward');
    });

    document.getElementById('left').addEventListener('click', function () {
        statusText.textContent = 'Turning Left';
        sendCommand('Turn Left');
    });

    document.getElementById('right').addEventListener('click', function () {
        statusText.textContent = 'Turning Right';
        sendCommand('Turn Right');
    });

    document.getElementById('stop').addEventListener('click', function () {
        statusText.textContent = 'Stopped';
        sendCommand('Stop');
    });

    // Arrow key event listener for controlling the RC car
    window.addEventListener('keydown', function (event) {
        switch (event.key) {
            case 'ArrowUp':
                statusText.textContent = 'Moving Forward';
                sendCommand('Move Forward');
                break;
            case 'ArrowDown':
                statusText.textContent = 'Moving Backward';
                sendCommand('Move Backward');
                break;
            case 'ArrowLeft':
                statusText.textContent = 'Turning Left';
                sendCommand('Turn Left');
                break;
            case 'ArrowRight':
                statusText.textContent = 'Turning Right';
                sendCommand('Turn Right');
                break;
        }
    });

    // Button click event listener for clearing the debug console
    document.getElementById('clearConsole').addEventListener('click', function () {
        clearDebugConsole();
    });

    // Function to clear the debug console
    function clearDebugConsole() {
        debugConsole.innerHTML = '';
    }
});
