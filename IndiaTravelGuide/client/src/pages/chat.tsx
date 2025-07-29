import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import ChatHeader from "@/components/chat-header";
import ChatMessages from "@/components/chat-messages";
import ChatInput from "@/components/chat-input";
import { type ChatResponse } from "@shared/schema";

interface Message {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: string;
  recommendations?: any[];
  travelTip?: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      message: "🙏 Namaste! Welcome to India Travel Guide! I'm here to help you discover amazing places across incredible India. Tell me which city or state you'd like to explore, and I'll suggest the best places to visit!",
      isBot: true,
      timestamp: new Date().toISOString()
    };
    setMessages([welcomeMessage]);
  }, []);

  const chatMutation = useMutation({
    mutationFn: async (data: { message: string; location?: string }) => {
      const response = await apiRequest("POST", "/api/chat", data);
      return response.json() as Promise<ChatResponse>;
    },
    onSuccess: (response) => {
      setMessages(prev => [...prev, {
        id: response.id,
        message: response.message,
        isBot: response.isBot,
        timestamp: response.timestamp,
        recommendations: response.recommendations,
        travelTip: response.travelTip
      }]);
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Chat error:", error);
      setIsLoading(false);
      setMessages(prev => [...prev, {
        id: "error-" + Date.now(),
        message: "Sorry, I encountered an error. Please try again!",
        isBot: true,
        timestamp: new Date().toISOString()
      }]);
    }
  });

  const handleSendMessage = (message: string, location?: string) => {
    // Add user message immediately
    const userMessage: Message = {
      id: "user-" + Date.now(),
      message,
      isBot: false,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Send to API
    chatMutation.mutate({ message, location });
  };

  const handleQuickAction = (location: string) => {
    handleSendMessage(`Tell me about places to visit in ${location}`, location);
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-4xl mx-auto bg-white shadow-xl">
      <ChatHeader />
      <ChatMessages 
        messages={messages} 
        isLoading={isLoading}
        onQuickAction={handleQuickAction}
      />
      <ChatInput onSendMessage={handleSendMessage} />
      <div ref={messagesEndRef} />
    </div>
  );
}
