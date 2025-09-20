const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    role: { type: String, enum: ['user', 'model'], required: true },
    parts: [{ text: String }]
})
// enum: ['user', 'model'] in Mongoose schema means that the value of that field can only be one of the specified options.

const chatHistorySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // user/session id
    messages: [messageSchema] // full chat array
})

module.exports = mongoose.model('ChatHistory', chatHistorySchema)
