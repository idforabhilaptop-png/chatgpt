const mongoose = require('mongoose');

async function db() {
    await mongoose.connect(process.env.Db_Connect_Key)
}
module.exports = db;