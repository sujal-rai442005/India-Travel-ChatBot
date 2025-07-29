import { useState } from "react";
import { Send, Mic } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ChatInputProps {
  onSendMessage: (message: string, location?: string) => void;
}

interface PopularDestination {
  name: string;
  count: number;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data: popularDestinations } = useQuery<PopularDestination[]>({
    queryKey: ["/api/destinations/popular"],
    enabled: showSuggestions,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage("");
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (location: string) => {
    onSendMessage(`Tell me about places to visit in ${location}`, location);
    setShowSuggestions(false);
  };

  return (
    <div className="border-t border-gray-200 p-3 sm:p-4 bg-white">
      <form onSubmit={handleSubmit} className="flex items-center space-x-2 sm:space-x-3">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Type a city or state in India..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full rounded-full px-3 sm:px-4 py-2 sm:py-3 pr-10 sm:pr-12 focus:ring-2 focus:ring-[hsl(14,100%,60%)] focus:border-transparent text-sm sm:text-base"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[hsl(14,100%,60%)]"
          >
            <Mic size={20} />
          </button>
        </div>
        <Button 
          type="submit"
          className="bg-[hsl(14,100%,60%)] text-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:bg-orange-600 transition-colors p-0 flex-shrink-0"
        >
          <Send size={16} className="sm:w-5 sm:h-5" />
        </Button>
      </form>

      {/* Search Suggestions */}
      {showSuggestions && popularDestinations && (
        <div className="mt-2">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2">
            <div className="text-xs text-gray-500 mb-2 px-2">Popular destinations:</div>
            {popularDestinations.map((dest) => (
              <button
                key={dest.name}
                onClick={() => handleSuggestionClick(dest.name)}
                className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded flex items-center space-x-2 text-sm"
              >
                <span>{dest.name}</span>
                <span className="text-xs text-gray-400">({dest.count} places)</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
