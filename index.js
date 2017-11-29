const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const xhub = require("express-x-hub");
const settings = require('./settings');

const port = "3001";
const host = "localhost";

app.use(xhub({ algorithm: "sha1", secret: settings.xhubSecret }));

app.use(bodyParser.json());

let server = app.listen(port, host, function() {
    console.log(
        server.address().address,
        server.address().port
    );
});

app.post("/", function(req, res) {
    if (!req.isXHubValid()) {
        res.status(400).send("Invalid X-Hub Request");
        console.error("Secret key is invalid");
        return;
    }

    let command = req.headers["x-github-event"];

    switch (command) {
        case "push":
            let repo = req.body.repository.full_name;
            switch (repo){
                case 'kb-dev/webhook':
                    res.status(400).send("Push received");
                    break;
                default:
                    res.status(400).send("Push for "+repo+" is not configured.");
            }
            break;

        case "ping":
            res.status(200).send("Ping received");
            break;

        default:
            res.status(400).send("Event not supported : " + command);
            console.log("Event not supported : " + req.headers["x-github-event"]);
            console.log(JSON.stringify(req.headers));
    }
});