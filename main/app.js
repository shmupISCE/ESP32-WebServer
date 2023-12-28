document.addEventListener('DOMContentLoaded', function () {
    const debugConsole = document.getElementById('debug-console');
    const statusText = document.getElementById('status-text');

    let direction = null;
    let sendInterval;
    let isKeyPressed = false;

    function getTimestamp() {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    function updateDebugConsole(command, response) {
        const timestamp = getTimestamp();
        const message = `[${timestamp}] Sent: ${command}, Received: ${response}`;
        debugConsole.innerHTML += message + '<br>';
        debugConsole.scrollTop = debugConsole.scrollHeight;
    }

    function sendCommand(command) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `http://192.168.1.48/control?direction=${command}`, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    // Successful response from ESP32
                    updateDebugConsole(command, 'Success');
                } else {
                    // Handle other status codes or errors
                    updateDebugConsole(command, 'Error: ' + xhr.status);
                }
            }
        };
        xhr.send();
    }

    function startSendingCommand() {
        sendInterval = setInterval(function () {
            if (direction) {
                sendCommand(direction);
            } else {
                // If no active direction, send a "stop" command once and check if received
                if (!isKeyPressed) {
                    sendCommand('stop');
                    isKeyPressed = true; // Set the flag to indicate that "stop" is sent
                }
            }
        }, 100); // Adjust the interval as needed
    }

    function stopSendingCommand() {
        clearInterval(sendInterval);
        isKeyPressed = false; // Reset the flag when keys are released
        sendCommand('stop'); // Send a final "stop" command when keys are released
    }

    function setDirection(newDirection) {
        if (newDirection !== direction) {
            direction = newDirection;
            startSendingCommand();
        }
    }

    document.getElementById('up').addEventListener('mousedown', function () {
        setDirection('move_forward');
        statusText.textContent = 'Moving Forward';
    });

    document.getElementById('down').addEventListener('mousedown', function () {
        setDirection('move_backward');
        statusText.textContent = 'Moving Backward';
    });

    document.getElementById('left').addEventListener('mousedown', function () {
        setDirection('turn_left');
        statusText.textContent = 'Turning Left';
    });

    document.getElementById('right').addEventListener('mousedown', function () {
        setDirection('turn_right');
        statusText.textContent = 'Turning Right';
    });

    // Stop sending command when mouse button is released
    document.addEventListener('mouseup', function () {
        direction = null; // Set direction to null when no keys are pressed
        statusText.textContent = 'Stopped';
        stopSendingCommand();
    });

    // Check which key is pressed and send the event to the ESP32
    window.addEventListener('keydown', function (event) {
        let newDirection = '';
        switch (event.key) {
            case 'ArrowUp':
                newDirection = 'move_forward';
                statusText.textContent = 'Moving Forward';
                break;
            case 'ArrowDown':
                newDirection = 'move_backward';
                statusText.textContent = 'Moving Backward';
                break;
            case 'ArrowLeft':
                newDirection = 'turn_left';
                statusText.textContent = 'Turning Left';
                break;
            case 'ArrowRight':
                newDirection = 'turn_right';
                statusText.textContent = 'Turning Right';
                break;
        }
        setDirection(newDirection);
    });

    // Stop sending command when key is released
    window.addEventListener('keyup', function (event) {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            direction = null; // Set direction to null when keys are released
            statusText.textContent = 'Stopped';
            stopSendingCommand();
        }
    });

    // Clear debug console
    document.getElementById('clearConsole').addEventListener('click', function () {
        clearDebugConsole();
    });

    function clearDebugConsole() {
        debugConsole.innerHTML = '';
    }
});
