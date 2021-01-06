const EventSource = require('eventsource')
const events = new EventSource('http://localhost:3000/events');
events.onmessage = (event) => {
    const parsedData = JSON.parse(event.data);
    console.log(parsedData);
};

events.onerror = (event) => {
    console.log(event);
};
