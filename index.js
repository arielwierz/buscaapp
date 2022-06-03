const express = require("express");
const fs = require("fs")
const path = require('path');
const app = express();
app.use(express.static("public"));
//------------------- Fuerza a los request a usar https:// -------------------//
app.set('trust proxy', true);
app.use((req, res, next) => {
    if (!req.secure) return res.redirect('https://' + req.get('host') + req.url);
    next();
});
//----------------------------------------------------------------------------//
app.get('/ping', (req, res) => {
    res.sendStatus(200);
    console.log("Pong!")
});
app.get('/', (req, res) => {
    res.sendFile(__dirname, "/public/index.html");
});
app.get('*', (req, res) => {
    const reqPath = req.baseUrl + req.path
    let requestedFile = path.join(__dirname, "/public/" + reqPath);

    let status = 404;
    if (fs.existsSync(requestedFile)) {
        status = 200;
        res.sendFile(requestedFile);
    }
    else if (fs.existsSync(requestedFile + ".html")) {
        status = 200;
        res.sendFile(requestedFile + ".html");
    }
    else
        res.sendStatus(status);
    console.log(`File Requested Method: GET Status: ${status} Requested File: ${reqPath} TimeStamp: ${new Date()}`);
});


app.listen(1515, function() {
    console.log(`
--------------------------------------------------
Server: To-Do\nEnviroment: DEV\nPort: ${1515}
--------------------------------------------------
`);
});