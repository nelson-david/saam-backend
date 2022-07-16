const database = require("./app/database/database");
const config = require("./config")["development"];
// production development
const Application = require("./app/app");
const app = Application(database, config);
const mongoose = require("mongoose");


app.listen(`${config.port}`, async () => {
    await mongoose.connect(config.dbURL, config.options)
    console.log(`App Running On PORT: ${config.port}`);
});