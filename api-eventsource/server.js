const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const eventsHandler = (req, res, next) => {
    const clientId = Date.now();
    const newClient = { id: clientId, res };
    clients.push(newClient);
    sendEventsToAll({ datas });
    req.on('close', () => {
        console.log(`${clientId} Connection closed`);
        clients = clients.filter(c => c.id !== clientId);
    });
}

const sendEventsToAll = (data) => {
    clients.forEach(c => c.res.write(`data: ${JSON.stringify(data)}\n\n`))
}
const addData = (req, res, next) => {
    const data = req.body;
    datas.push(data);
    sendEventsToAll(data);
    res.json(data)
}

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.post('/add-data', addData);
app.get('/events', eventsHandler);
app.get('/status', (req, res) => {
    res.json({ clients: clients.length })
});

const PORT = 3000;
let clients = [];
let datas = [];

app.listen(PORT, () => {
    console.log(`Examhttps://runkit.com/ple app listening at http://localhost:${PORT}`)
})