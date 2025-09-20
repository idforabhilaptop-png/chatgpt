const express = require('express')
const cors = require('cors') // Add this for CORS support
const app = express()
const port = 4000
const main = require('./ai_chat')
const db = require('./models/database')
const ChatHistory = require('./models/schema')
require('dotenv').config()

// Middleware
app.use(express.json())
app.use(cors()) // Enable CORS for frontend connection

// POST /chat - Send message
app.post('/chat', async (req, res) => {
    const { id, message } = req.body
    try {
        // find existing history or create new
        let chat = await ChatHistory.findOne({ id })
        if (!chat) {
            chat = await ChatHistory.create({ id, messages: [] })
        }
        
        // add user message
        chat.messages.push({ role: 'user', parts: [{ text: message }] })
        
        // build prompt
        const promptMessage = [...chat.messages]
        
        // call your ai_chat function
        const response = await main(promptMessage)
        
        // add model response
        chat.messages.push({ role: 'model', parts: [{ text: response }] })
        
        // save updated history
        await chat.save()
        
        res.send(response)
    } catch (err) {
        console.error(err)
        res.status(500).send('Something went wrong')
    }
})

// GET /chats - Get all chat histories
app.get('/chats', async (req, res) => {
    try {
        const chats = await ChatHistory.find({}).select('id messages').sort({ updatedAt: -1 })
        res.json(chats)
    } catch (err) {
        console.error(err)
        res.status(500).send('Something went wrong')
    }
})

// GET /chat/:id - Get specific chat history
app.get('/chat/:id', async (req, res) => {
    const { id } = req.params
    try {
        const chat = await ChatHistory.findOne({ id })
        if (!chat) {
            return res.status(404).send('Chat not found')
        }
        res.json(chat)
    } catch (err) {
        console.error(err)
        res.status(500).send('Something went wrong')
    }
})

// DELETE /chat/:id - Delete specific chat
app.delete('/chat/:id', async (req, res) => {
    const { id } = req.params
    try {
        const deletedChat = await ChatHistory.findOneAndDelete({ id })
        if (!deletedChat) {
            return res.status(404).send('Chat not found')
        }
        res.json({ message: 'Chat deleted successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).send('Something went wrong')
    }
})

// Connect to database and start server
db()
    .then(async () => {
        console.log('Connected to Database')
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`)
        })
    })
    .catch((err) => console.log(err))