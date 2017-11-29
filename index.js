const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const xhub = require("express-x-hub");
const settings = require('./settings');

const port = "8085";
const host = "localhost";

//Secret key
app.use(xhub({ algorithm: "sha1", secret: settings.xhubSecret }));

// Configure express json
app.use(bodyParser.json());

// Main : Start the express http server
let server = app.listen(port, host, function() {
    console.log(
        server.address().address,
        server.address().port
    );
});

// Add default route
app.post("/", function(req, res) {
    if (!req.isXHubValid()) {
        res.status(400).send("Invalid X-Hub Request");
        console.error("Secret key is invalid");
        return;
    }

    let command = req.headers["x-github-event"];

    switch (command) {
        //Event create (Branch, or tag created)
        case "create":
            res.send("Event create trigger");
            console.log("Create event");
            break;

        //Event release (Release published in a repository)
        case "release":
            res.send("Event release trigger");
            console.log("Release Event");
            break;

        default:
            res.status(400).send("Event not supported : " + command);
            console.log("Event not supported : " + req.headers["X-Github-Event"]);
    }
});