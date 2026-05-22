const Datastore = require("gray-nedb"); 
const path = require("path");
const fs = require("fs");
const dataDir = path.resolve(__dirname, "..", "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}
const db = new Datastore({ filename: path.join(dataDir, "users.db"), autoload: true });

module.exports = db;

