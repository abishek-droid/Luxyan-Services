
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage } from '../../types';
import { startChat, streamChatResponse, SYSTEM_INSTRUCTIONS } from '../../services/geminiService';
import { UserRole } from '../../types';
import { Chat } from '@google/genai';


interface ChatInterfaceProps {
    role: UserRole;
    initialMessage: string;
}

const UserIcon = () => (
    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm">
      YOU
    </div>
);

const ModelIcon = () => (
    <div className="w-8 h-8 rounded-full bg-luxyan-blue flex items-center justify-center text-white font-bold text-sm">
      AI
    </div>
);

const ChatInterface: React.FC<ChatInterfaceProps> = ({ role, initialMessage }) => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const initializeChat = useCallback(() => {
        setIsLoading(true);
        const systemInstruction = SYSTEM_INSTRUCTIONS[role.toUpperCase() as keyof typeof SYSTEM_INSTRUCTIONS];
        const newChat = startChat(systemInstruction);
        setChat(newChat);
        setMessages([{ role: 'model', content: initialMessage }]);
        setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [role, initialMessage]);

    useEffect(() => {
        initializeChat();
    }, [initializeChat]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !chat || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const stream = await streamChatResponse(chat, input);
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = modelResponse;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: ChatMessage = { role: 'model', content: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-inner">
            <div className="flex-grow p-4 overflow-y-auto space-y-6">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <ModelIcon />}
                        <div className={`max-w-xl p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-luxyan-text-primary'}`}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            {isLoading && msg.role === 'model' && index === messages.length -1 && <div className="animate-pulse">...</div>}
                        </div>
                         {msg.role === 'user' && <UserIcon />}
                    </div>
                ))}
                 <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type your message..."
                        className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-luxyan-blue"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="bg-luxyan-blue text-white p-2 rounded-full hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
