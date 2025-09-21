import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, MessageSquare, Plus, Menu, X, Settings, User, Search } from 'lucide-react';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typingMessage, setTypingMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingMessage]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [inputMessage]);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const typeWriter = (text, callback) => {
    setTypingMessage('');
    setIsTyping(true);
    let i = 0;
    const speed = 20;
    
    const type = () => {
      if (i < text.length) {
        setTypingMessage(text.substring(0, i + 1));
        i++;
        setTimeout(type, speed);
      } else {
        setIsTyping(false);
        callback();
      }
    };
    type();
  };

  const formatMessage = (text) => {
    // Remove markdown formatting and clean up the text
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')  // Remove bold
      .replace(/\*(.*?)\*/g, '$1')      // Remove italic
      .replace(/`(.*?)`/g, '$1')        // Remove code
      .replace(/#{1,6}\s/g, '')         // Remove headers
      .replace(/^\s*[-*+]\s/gm, '• ')   // Convert bullet points
      .replace(/^\s*\d+\.\s/gm, '')     // Remove numbered lists
      .trim();
  };

  const fetchChatHistory = async () => {
    try {
      const response = await fetch('http://localhost:4000/chats');
      if (response.ok) {
        const history = await response.json();
        setChatHistory(history);
      }
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  };

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    setCurrentChatId(newChatId);
    setMessages([]);
    setInputMessage('');
    setTypingMessage('');
    setIsTyping(false);
  };

  const loadChat = async (chatId) => {
    try {
      const response = await fetch(`http://localhost:4000/chat/${chatId}`);
      if (response.ok) {
        const chatData = await response.json();
        setCurrentChatId(chatId);
        setMessages(chatData.messages.map(msg => ({
          role: msg.role,
          content: formatMessage(msg.parts[0].text)
        })));
        setTypingMessage('');
        setIsTyping(false);
      }
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      const response = await fetch(`http://localhost:4000/chat/${chatId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setChatHistory(prev => prev.filter(chat => chat.id !== chatId));
        if (currentChatId === chatId) {
          setCurrentChatId(null);
          setMessages([]);
          setTypingMessage('');
          setIsTyping(false);
        }
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);
    setTypingMessage('');
    setIsTyping(false);

    // Scroll to bottom when new message is added
    setTimeout(() => scrollToBottom(), 100);

    try {
      const chatId = currentChatId || Date.now().toString();
      if (!currentChatId) {
        setCurrentChatId(chatId);
      }

      const response = await fetch('http://localhost:4000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: chatId,
          message: userMessage,
        }),
      });

      if (response.ok) {
        const aiResponse = await response.text();
        const formattedResponse = formatMessage(aiResponse);
        
        typeWriter(formattedResponse, () => {
          setMessages(prev => [...prev, { role: 'model', content: formattedResponse }]);
          setTypingMessage('');
        });
        
        fetchChatHistory();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMsg = 'Sorry, something went wrong. Please try again.';
      typeWriter(errorMsg, () => {
        setMessages(prev => [...prev, { role: 'model', content: errorMsg }]);
        setTypingMessage('');
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getChatTitle = (chat) => {
    if (chat.messages && chat.messages.length > 0) {
      const firstMessage = chat.messages.find(msg => msg.role === 'user');
      return firstMessage ? firstMessage.parts[0].text.slice(0, 35) + (firstMessage.parts[0].text.length > 35 ? '...' : '') : 'New Chat';
    }
    return 'New Chat';
  };

  const filteredHistory = chatHistory.filter(chat => 
    getChatTitle(chat).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 bg-gray-900 text-white flex flex-col overflow-hidden border-r border-gray-800`}>
        {/* Sidebar Header */}
        <div className="p-4">
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-transparent border border-gray-600 hover:bg-gray-800 text-white rounded-lg transition-all duration-200 text-sm font-medium"
          >
            <Plus size={16} />
            New chat
          </button>
        </div>
        
        {/* Search Box */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-2">
            {filteredHistory.map((chat) => (
              <div key={chat.id} className="group relative mb-1">
                <button
                  onClick={() => loadChat(chat.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 text-sm ${
                    currentChatId === chat.id 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="truncate font-medium">{getChatTitle(chat)}</span>
                  </div>
                </button>
                <button
                  onClick={() => deleteChat(chat.id)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded opacity-0 group-hover:opacity-100 hover:bg-gray-700 transition-all duration-200"
                >
                  <Trash2 size={14} className="text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-all duration-200">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 border-b border-gray-700 px-6 py-4 flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors mr-3 text-white"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <h1 className="text-xl font-semibold text-white">ChatGPT</h1>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto bg-gray-800">
          <div className="max-w-3xl mx-auto px-6 py-8">
            {messages.length === 0 && !isTyping && (
              <div className="text-center py-16">
                <h2 className="text-2xl font-semibold text-white mb-4">How can I help you today?</h2>
                <p className="text-gray-400">Start a conversation and I'll do my best to help</p>
              </div>
            )}
            
            {messages.map((message, index) => (
              <div key={index} className="mb-8 group">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    {message.role === 'user' ? (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <User size={18} className="text-white" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">AI</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-400 mb-1 font-medium">
                      {message.role === 'user' ? 'You' : 'ChatGPT'}
                    </div>
                    <div className="prose prose-sm max-w-none">
                      <div className="text-gray-100 leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {(isLoading || isTyping) && (
              <div className="mb-8 group">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">AI</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-400 mb-1 font-medium">ChatGPT</div>
                    <div className="prose prose-sm max-w-none">
                      {isTyping ? (
                        <div className="text-gray-100 leading-relaxed whitespace-pre-wrap">
                          {typingMessage}
                          <span className="animate-pulse">|</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-700 bg-gray-800 p-6">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-end gap-3 bg-gray-700 border border-gray-600 rounded-xl px-4 py-3 focus-within:border-gray-500 transition-colors">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message ChatGPT..."
                className="flex-1 bg-transparent resize-none border-none outline-none text-gray-100 placeholder-gray-400 text-base leading-6"
                rows="1"
                disabled={isLoading || isTyping}
                style={{ minHeight: '24px', maxHeight: '120px' }}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading || isTyping}
                className="p-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-400 text-center mt-2">
              ChatGPT can make mistakes. Consider checking important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;