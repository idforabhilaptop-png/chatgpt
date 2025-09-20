-> Gpt : Generative pre-trained transformed
-> Gpt whi answer de sakta hai jispei vo trained hua hai
-> Tokenization :
       -> jo hum input de dete hai usko gpt chote chote parts mei thodta hai or har part ek token hai . This process depends on LLM model
       -> gpt output deta hai by predicting the next word
       ->ye tokens combined hoke hume output deta hai
-> gpt ko answer dene ke liye context chaiye hota hai 

-------------------------------------------------------------------------------------------------------------------------------------------

project :
 
 ->hum chat history ko backend mei store rakhte hai

---------------------------------------------------------------------------------------------------------------------------------------------

MCP : Model context protocol

### 1. MCP kya hai?

**MCP (Model Context Protocol)** ek **standard rule** hai jo batata hai ki AI models (jaise ChatGPT) aur external tools/apps ek dusre se **kaise baat karenge**.

---

### 2. MCP Server kya karta hai?

**MCP server** ek program hota hai jo:

* **Tools** provide karta hai (jaise calculator, search engine, ya koi database access karna).
* **Data** provide karta hai (jaise files padhna, APIs se info lana).
* **Instructions execute karta hai** (jo client bole, usko kaam karke result dena).

---

### 3. Kaise kaam karta hai (Working Step by Step):

Socho tum ek **AI assistant (client)** ho aur tumhe ek kaam karna hai:

* Example: Tumhe ek **PDF file read karke summary** chahiye.

👉 Process:

1. **Client request karta hai**: "Mujhe ye file ka summary do."
2. **MCP server sunti hai**: Server ke paas ek "tool" hota hai jo file padh sakta hai.
3. **Server action leta hai**: File open karke uska content extract karta hai.
4. **Server response bhejta hai**: Extracted text wapas client ko deta hai.
5. **Client use karta hai**: Ab AI model (client) us text ka summary bana deta hai.

---

### 4. Real-life Example (Samajhne ke liye)

* **Client** = ChatGPT (tumhara AI assistant)
* **MCP server** = Ek "Google Search" tool jo MCP follow karta hai
* **Kaam** = Tum puchte ho: “Latest cricket score batao.”
* **Process**:

  * ChatGPT request ko MCP server ko bhejega
  * MCP server Google API se score nikal lega
  * MCP server result ChatGPT ko de dega
  * ChatGPT tumhe simple language mein score bata dega

---

👉 **Summary**:
**MCP server ek helper program hai jo AI ya apps ke liye tools/data/services provide karta hai. Client (jaise AI) request bhejta hai, server usko process karke answer return karta hai. Dono MCP rules ke through baat karte hain.**
-----------------------------------------------------------------------------------------------------------------------------------------------



