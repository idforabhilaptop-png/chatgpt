const { GoogleGenAI } = require("@google/genai");      //googlegenai ek class hai

const ai = new GoogleGenAI({ apiKey: "AIzaSyC_oyX8_hTOfBOzsO6ya09c8vMOLTQqGhM" });

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
//     apiKey: "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",
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