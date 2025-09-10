import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type Message = {
  id: number;
  text: string;
  sender: 'user' | 'bot';
};

export const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const OPENROUTER_API_KEY =
    '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';
  const MODEL_NAME = 'deepseek/deepseek-chat-v3.1:free';

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "Hello! I'm your AgriChain assistant. How can I help you today?",
          sender: 'bot',
        },
      ]);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatBotResponse = (text: string) => {
    let formattedText = text
      .replace(/(\n\s*)[-•*](\s+)/g, '$1•$2')
      .replace(/([^\n])(\n\s*•)/g, '$1<br />$2')
      .replace(/(\n\s*)\d+\.\s/g, '$1• ')
      .replace(/(•\s[^\n]+)(\n|$)/g, '$1<br />')
      .replace(/(<br\s*\/?>){2,}/g, '<br />')
      .trim();

    return formattedText;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            'HTTP-Referer': window.location.origin,
            'X-Title': 'AgriChain Platform',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: MODEL_NAME,
            messages: [
              {
                role: 'system',
                content:
                  'You are a helpful assistant for an agricultural supply chain platform called AgriChain. Provide helpful, concise responses about farming, supply chain, orders, and agricultural products. When providing lists or multiple points, use clear bullet points with proper formatting. Always structure your responses with good readability using line breaks and bullet points where appropriate. Present each point on a separate line, keep ideas distinct, and maintain a logical flow between points.',
              },
              ...messages
                .filter((msg) => msg.sender === 'bot')
                .map((msg) => ({
                  role: 'assistant',
                  content: msg.text
                    .replace(/<br\s*\/?>/gi, '\n')
                    .replace(/•\s/g, '\n- '),
                })),
              ...messages
                .filter((msg) => msg.sender === 'user')
                .map((msg) => ({
                  role: 'user',
                  content: msg.text,
                })),
              {
                role: 'user',
                content: inputValue,
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const botResponse = formatBotResponse(
        data.choices[0].message.content
      );

      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse,
        sender: 'bot',
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "I'm having trouble connecting right now. Please try again shortly.",
        sender: 'bot',
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 p-0 flex items-center justify-center shadow-lg bg-green-600 hover:bg-green-700"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-lg shadow-xl flex flex-col border border-gray-200"
      style={{ height: '500px' }}
    >
      <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold">AgriChain Assistant</h3>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-white hover:bg-green-700"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-green-600 text-white rounded-br-none'
                    : 'bg-white border border-gray-200 rounded-bl-none'
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.sender === 'bot' && (
                    <Bot className="h-4 w-4 mt-1 flex-shrink-0 text-green-600" />
                  )}
                  {message.sender === 'bot' ? (
                    <div
                      className="text-sm"
                      dangerouslySetInnerHTML={{
                        __html: message.text,
                      }}
                    />
                  ) : (
                    <p className="text-sm">{message.text}</p>
                  )}
                  {message.sender === 'user' && (
                    <User className="h-4 w-4 mt-1 flex-shrink-0 text-white" />
                  )}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-3 rounded-lg bg-white border border-gray-200 rounded-bl-none">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 mt-1 flex-shrink-0 text-green-600" />
                  <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Ask about our agricultural platform..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
