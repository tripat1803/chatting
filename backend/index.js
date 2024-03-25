require('dotenv').config();

require("./config/mongodb.js")();

const server = require("./app.js");

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on port ` + PORT));