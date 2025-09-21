require('dotenv').config()
const { GoogleGenAI } = require("@google/genai");      //googlegenai ek class hai

const ai = new GoogleGenAI({ apiKey: process.env.KEY });

//frontend se jo message aaya hai vo pass kiya hai
async function main(message) {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: message,
    });
    return response.text;
}

module.exports = main



// const OpenAI = require('openai');
// const openai = new OpenAI({
//     baseURL: "https://openrouter.ai/api/v1",
//     apiKey: process.env.KEY_2,
// });
// async function main(msg) {
//     const completion = await openai.chat.completions.create({
//         model: "deepseek/deepseek-chat-v3.1:free",
//         messages: [
//             {
//                 "role": "user",
//                 "content": msg
//             }
//         ],

//     });

//     return completion.choices[0].message.content;
// }

//  module.exports = main