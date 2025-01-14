const eventSource = new EventSource('http://localhost:3000/events');

// Listen for incoming messages
eventSource.onmessage = function(event) {
    const message = JSON.parse(event.data);
    console.log(message)
};

// Handle connection open
eventSource.onopen = function() {
    console.log("Connected to SSE server");
};

// Handle connection error
eventSource.onerror = function() {
    console.error("Error with SSE connection");
};

