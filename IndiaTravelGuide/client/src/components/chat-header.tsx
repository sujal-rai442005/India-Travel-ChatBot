import { MapPin } from "lucide-react";

export default function ChatHeader() {
  return (
    <header className="bg-gradient-to-r from-[hsl(14,100%,60%)] to-orange-500 text-white p-4 shadow-lg">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <MapPin className="text-white" size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold">India Travel Guide</h1>
          <p className="text-orange-100 text-sm">Your intelligent travel companion</p>
        </div>
        <div className="ml-auto">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </header>
  );
}
