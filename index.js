// using Express.js to create a web server
const express = require('express'); // loading modules
const app = express(); // instantiating
const port = 3000; // specifying the port

app.use(express.static(__dirname + '/public/'));

app.get('/', (req, res) => res.sendFile('index.html'))

app.listen(port, () => console.log('App is listening on port ${port}!'));