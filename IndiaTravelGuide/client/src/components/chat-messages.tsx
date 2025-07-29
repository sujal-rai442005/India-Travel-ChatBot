import { Bot, User, Landmark, MapPin, Trees, Zap } from "lucide-react";
import RecommendationCard from "./recommendation-card";

interface Message {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: string;
  recommendations?: any[];
  travelTip?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  onQuickAction: (location: string) => void;
}

const quickActions = [
  { name: "Delhi", icon: Landmark },
  { name: "Mumbai", icon: MapPin },
  { name: "Kerala", icon: Trees },
  { name: "Rajasthan", icon: Zap }
];

export default function ChatMessages({ messages, isLoading, onQuickAction }: ChatMessagesProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
      {messages.map((message, index) => (
        <div key={message.id}>
          {message.isBot ? (
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-[hsl(14,100%,60%)] rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="text-white" size={16} />
              </div>
              <div className="bg-[hsl(210,20%,97%)] rounded-lg rounded-tl-none p-4 max-w-[320px] sm:max-w-lg lg:max-w-xl">
                <p className="text-[hsl(210,29%,24%)] whitespace-pre-line">{message.message}</p>
                
                {message.recommendations && message.recommendations.length > 0 && (
                  <div className="space-y-3 mt-4">
                    {message.recommendations.map((rec, idx) => (
                      <RecommendationCard 
                        key={rec.id} 
                        recommendation={rec} 
                        index={idx + 1}
                      />
                    ))}
                  </div>
                )}

                {message.travelTip && (
                  <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800">
                      <span className="font-semibold">💡 Travel Tip:</span> {message.travelTip}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-start space-x-3 justify-end">
              <div className="bg-[hsl(14,100%,60%)] text-white rounded-lg rounded-tr-none p-4 max-w-[280px] sm:max-w-xs lg:max-w-md">
                <p>{message.message}</p>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="text-gray-600" size={16} />
              </div>
            </div>
          )}

          {/* Show quick actions after welcome message */}
          {index === 0 && message.isBot && (
            <div className="flex flex-wrap gap-2 ml-8 sm:ml-11 mt-4">
              {quickActions.map(({ name, icon: Icon }) => (
                <button
                  key={name}
                  onClick={() => onQuickAction(name)}
                  className="bg-white border border-gray-200 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition-colors flex items-center space-x-1"
                >
                  <Icon size={12} className="sm:w-3.5 sm:h-3.5" />
                  <span>{name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Loading Animation */}
      {isLoading && (
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-[hsl(14,100%,60%)] rounded-full flex items-center justify-center flex-shrink-0">
            <Bot className="text-white" size={16} />
          </div>
          <div className="bg-[hsl(210,20%,97%)] rounded-lg rounded-tl-none p-4">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
