const express = require("express");
const compression = require("compression");
const fileUpload = require('express-fileupload');
const cors = require("cors");
const path = require("path");

const Application = (database, config) => {
    const app = express();

    if (config.environment) {
        console.log("using compression")
        app.use(compression({
            level: 9,
            threshold: 0,
            filter: (req, res) => {
                return compression.filter(req, res);
            }
        }));
    }

    var dir = path.join(__dirname, 'assets');
    app.use(express.static(dir));
    app.use(express.json());

    app.use(cors({
        origin: config.origin,
        credentials: true
    }));

    app.use(fileUpload({
        createParentPath: true
    }));

    const getDurationInMilliseconds = (start) => {
        const NS_PER_SEC = 1e9;
        const NS_TO_MS = 1e6;
        const diff = process.hrtime(start);

        return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS;
    }

    app.use((req, res, next) => {
        console.log(`${req.method} ${req.originalUrl} [STARTED]`);
        const start = process.hrtime();

        res.on('finish', () => {
            const durationInMilliseconds = getDurationInMilliseconds(start);
            console.log(`${req.method} ${req.originalUrl} [FINISHED] 
                ${durationInMilliseconds.toLocaleString()} ms `);
        });

        res.on('close', () => {
            const durationInMilliseconds = getDurationInMilliseconds(start);
            console.log(`${req.method} ${req.originalUrl} [CLOSED] 
                ${durationInMilliseconds.toLocaleString()} ms `);
        });

        next();

    });

    const appRoute = require("./routes/routes");
    const route = appRoute(database, config);

    app.use("/api", (req, res, next) => {
        res.database = database;
        res.config = config;
        next();
    });

    app.use("/api", route);

    return app;

}

module.exports = Application;