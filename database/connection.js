
require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);

const mongoose = require("mongoose");


mongoose.connect(
    "mongodb+srv://elishaanand789_db_user:Anand7779@cluster0.hi1bzy7.mongodb.net/elisha?appName=Cluster0&retryWrites=true&w=majority"
)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});