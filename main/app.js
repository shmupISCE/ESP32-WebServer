document.addEventListener('DOMContentLoaded', function () {
    const debugConsole = document.getElementById('debug-console');
    const statusText = document.getElementById('status-text');

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

    document.getElementById('up').addEventListener('click', function () {
        statusText.textContent = 'Moving Forward';
        sendCommand('move_forward');
    });

    document.getElementById('down').addEventListener('click', function () {
        statusText.textContent = 'Moving Backward';
        sendCommand('move_backward');
    });

    document.getElementById('left').addEventListener('click', function () {
        statusText.textContent = 'Turning Left';
        sendCommand('turn_left');
    });

    document.getElementById('right').addEventListener('click', function () {
        statusText.textContent = 'Turning Right';
        sendCommand('turn_right');
    });

    window.addEventListener('keydown', function (event) {
        let direction = '';
        switch (event.key) {
            case 'ArrowUp':
                direction = 'move_forward';
                statusText.textContent = 'Moving Forward';
                break;
            case 'ArrowDown':
                direction = 'move_backward';
                statusText.textContent = 'Moving Backward';
                break;
            case 'ArrowLeft':
                direction = 'turn_left';
                statusText.textContent = 'Turning Left';
                break;
            case 'ArrowRight':
                direction = 'turn_right';
                statusText.textContent = 'Turning Right';
                break;
        }
        if (direction !== '') {
            sendCommand(direction);
        }
    });

    document.getElementById('clearConsole').addEventListener('click', function () {
        clearDebugConsole();
    });

    function clearDebugConsole() {
        debugConsole.innerHTML = '';
    }
});
