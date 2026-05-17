
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const mongoose = require("mongoose");


mongoose.connect(
    "mongodb string"
)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});
