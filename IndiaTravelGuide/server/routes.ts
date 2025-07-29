import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertChatMessageSchema, type Recommendation, type ChatResponse } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get destinations by location
  app.get("/api/destinations/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Query parameter 'q' is required" });
      }
      
      const destinations = await storage.searchDestinations(q);
      res.json(destinations);
    } catch (error) {
      console.error("Error searching destinations:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get popular destinations for suggestions
  app.get("/api/destinations/popular", async (req, res) => {
    try {
      const popularStates = [
        "Delhi", "Mumbai", "Kerala", "Rajasthan", "Goa", "Lucknow", "Chennai", "Bangalore", 
        "Kolkata", "Shimla", "Manali", "Amritsar", "Rishikesh", "Haridwar", "Hyderabad", 
        "Guwahati", "Ahmedabad", "Bhopal", "Gangtok", "Srinagar", "Leh"
      ];
      const popularDestinations = [];
      
      for (const state of popularStates) {
        const destinations = await storage.getDestinationsByLocation(state);
        if (destinations.length > 0) {
          popularDestinations.push({
            name: state,
            count: destinations.length
          });
        }
      }
      
      res.json(popularDestinations);
    } catch (error) {
      console.error("Error getting popular destinations:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Chat endpoint - process user message and return recommendations
  app.post("/api/chat", async (req, res) => {
    try {
      const chatRequestSchema = z.object({
        message: z.string().min(1),
        location: z.string().optional()
      });

      const { message, location } = chatRequestSchema.parse(req.body);
      
      // Save user message
      await storage.saveChatMessage({
        message,
        isBot: "false",
        location: location || null,
        recommendations: null
      });

      // Extract location from message if not provided
      const extractedLocation = location || extractLocationFromMessage(message);
      
      if (!extractedLocation) {
        const response: ChatResponse = {
          id: "bot-" + Date.now(),
          message: "I'd be happy to help you explore India! Could you please tell me which city or state you'd like to visit? For example, you could say 'I want to visit Kerala' or 'Show me places in Delhi'.",
          isBot: true,
          timestamp: new Date().toISOString()
        };
        
        await storage.saveChatMessage({
          message: response.message,
          isBot: "true",
          location: null,
          recommendations: null
        });

        return res.json(response);
      }

      // Get destinations for the location
      const destinations = await storage.getDestinationsByLocation(extractedLocation);
      
      if (destinations.length === 0) {
        const response: ChatResponse = {
          id: "bot-" + Date.now(),
          message: `I couldn't find information about "${extractedLocation}". Could you please try another Indian city or state? Some popular destinations I can help with include Delhi, Mumbai, Kerala, Rajasthan, Goa, Tamil Nadu, and many more!`,
          isBot: true,
          timestamp: new Date().toISOString()
        };
        
        await storage.saveChatMessage({
          message: response.message,
          isBot: "true",
          location: extractedLocation,
          recommendations: null
        });

        return res.json(response);
      }

      // Select top 5 destinations with variety in categories
      const recommendations = selectDiverseRecommendations(destinations, 5);
      
      // Generate response message
      const locationName = extractedLocation.charAt(0).toUpperCase() + extractedLocation.slice(1);
      const responseMessage = `You're exploring **${locationName}**! Here are some must-visit places:`;
      
      // Get travel tip from first destination
      const travelTip = destinations[0]?.travelTips || 
        `Best time to visit ${locationName} is typically October to March. Don't forget to try the local cuisine!`;

      const response: ChatResponse = {
        id: "bot-" + Date.now(),
        message: responseMessage,
        isBot: true,
        timestamp: new Date().toISOString(),
        recommendations,
        travelTip
      };

      // Save bot response
      await storage.saveChatMessage({
        message: response.message,
        isBot: "true",
        location: extractedLocation,
        recommendations
      });

      res.json(response);
    } catch (error) {
      console.error("Error processing chat:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get chat history
  app.get("/api/chat/history", async (req, res) => {
    try {
      const history = await storage.getChatHistory();
      res.json(history);
    } catch (error) {
      console.error("Error getting chat history:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function extractLocationFromMessage(message: string): string | null {
  const normalizedMessage = message.toLowerCase();
  
  // Check for specific Indian states/cities first (priority check)
  const indianLocations = [
    'delhi', 'mumbai', 'kerala', 'rajasthan', 'goa', 'bangalore', 'chennai', 'kolkata', 'hyderabad',
    'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'bhopal', 'visakhapatnam',
    'tamil nadu', 'karnataka', 'andhra pradesh', 'telangana', 'maharashtra', 'gujarat', 'west bengal',
    'uttar pradesh', 'madhya pradesh', 'bihar', 'odisha', 'punjab', 'haryana', 'himachal pradesh',
    'uttarakhand', 'jharkhand', 'chhattisgarh', 'assam', 'manipur', 'meghalaya', 'tripura', 'mizoram',
    'nagaland', 'arunachal pradesh', 'sikkim', 'jammu and kashmir', 'ladakh', 'agra', 'varanasi',
    'amritsar', 'udaipur', 'jodhpur', 'pushkar', 'rishikesh', 'haridwar', 'shimla', 'manali',
    'darjeeling', 'gangtok', 'kochi', 'cochin', 'mysore', 'hampi', 'aurangabad', 'nashik',
    'madurai', 'srinagar', 'leh', 'itanagar', 'kohima', 'imphal', 'shillong', 'agartala', 'aizawl',
    'raipur', 'ranchi', 'patna', 'warangal', 'guwahati', 'gurugram', 'gurgaon', 'bhubaneswar', 'puri',
    'agra', 'varanasi', 'kanpur', 'meerut', 'allahabad', 'prayagraj', 'mathura', 'vrindavan',
    'jamshedpur', 'deoghar', 'netarhat', 'uttar pradesh', 'up'
  ];

  for (const location of indianLocations) {
    if (normalizedMessage.includes(location)) {
      return location;
    }
  }

  // Common patterns for location extraction (fallback)
  const locationPatterns = [
    /(?:visit|go to|explore|in|about|places in|traveling to)\s+([a-zA-Z\s]+)/,
    /([a-zA-Z\s]+)(?:\s+places|\s+tourism|\s+tour|\s+travel)/,
    /^([a-zA-Z\s]+)$/
  ];

  for (const pattern of locationPatterns) {
    const match = normalizedMessage.match(pattern);
    if (match && match[1]) {
      const location = match[1].trim();
      // Filter out common words that aren't locations
      const excludeWords = ['places', 'best', 'top', 'good', 'nice', 'beautiful', 'famous', 'popular', 'must', 'see', 'visit', 'travel', 'trip', 'tour', 'tourism'];
      if (!excludeWords.includes(location) && location.length > 2) {
        return location;
      }
    }
  }

  return null;
}

function selectDiverseRecommendations(destinations: any[], maxCount: number): Recommendation[] {
  const categories = ['historical', 'nature', 'spiritual', 'cultural', 'adventure'];
  const selected: Recommendation[] = [];
  const usedCategories = new Set<string>();

  // First, try to get one from each category
  for (const category of categories) {
    if (selected.length >= maxCount) break;
    
    const categoryDestinations = destinations.filter(d => d.category === category);
    if (categoryDestinations.length > 0 && !usedCategories.has(category)) {
      const dest = categoryDestinations[0];
      selected.push({
        id: dest.id,
        name: dest.name,
        description: dest.description,
        category: dest.category,
        imageUrl: dest.imageUrl
      });
      usedCategories.add(category);
    }
  }

  // Fill remaining slots with any available destinations
  for (const dest of destinations) {
    if (selected.length >= maxCount) break;
    
    if (!selected.find(s => s.id === dest.id)) {
      selected.push({
        id: dest.id,
        name: dest.name,
        description: dest.description,
        category: dest.category,
        imageUrl: dest.imageUrl
      });
    }
  }

  return selected.slice(0, maxCount);
}
