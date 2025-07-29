import { type Destination, type ChatMessage, type InsertDestination, type InsertChatMessage, type Recommendation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Destinations
  getDestinationsByLocation(location: string): Promise<Destination[]>;
  searchDestinations(query: string): Promise<Destination[]>;
  getAllDestinations(): Promise<Destination[]>;
  
  // Chat Messages
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(): Promise<ChatMessage[]>;
}

export class MemStorage implements IStorage {
  private destinations: Map<string, Destination>;
  private chatMessages: Map<string, ChatMessage>;

  constructor() {
    this.destinations = new Map();
    this.chatMessages = new Map();
    this.initializeDestinations();
  }

  private initializeDestinations() {
    const destinationsData: Omit<Destination, 'id'>[] = [
      // Delhi
      {
        name: "India Gate",
        state: "Delhi",
        category: "historical",
        description: "Iconic national monument and war memorial.",
        imageUrl: "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Chole Bhature", "Paranthe", "Kebabs"],
        travelTips: "Visit during evening for the best lighting and cooler weather."
      },
      {
        name: "Qutub Minar",
        state: "Delhi",
        category: "historical",
        description: "A UNESCO World Heritage Site with stunning architecture.",
        imageUrl: "https://images.unsplash.com/photo-1608031680798-876eed8cc7b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Mughlai cuisine", "Biryani"],
        travelTips: "Early morning visits are less crowded."
      },
      {
        name: "Lotus Temple",
        state: "Delhi",
        category: "spiritual",
        description: "A serene space open to all religions.",
        imageUrl: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "Year round",
        localFood: ["Vegetarian meals"],
        travelTips: "Maintain silence inside the temple."
      },
      {
        name: "Chandni Chowk",
        state: "Delhi",
        category: "cultural",
        description: "A chaotic but delicious food paradise.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Jalebis", "Samosas", "Paranthe"],
        travelTips: "Go with an empty stomach and try the street food."
      },
      {
        name: "Red Fort",
        state: "Delhi",
        category: "historical",
        description: "Historical Mughal-era fort known for its grand architecture.",
        imageUrl: "https://images.unsplash.com/photo-1631629242635-4d8963b39c5a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Mughlai dishes"],
        travelTips: "Take the audio guide to learn about the rich history."
      },

      // Kerala
      {
        name: "Alleppey Backwaters",
        state: "Kerala",
        category: "nature",
        description: "Serene network of canals perfect for houseboat cruising.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Fish curry", "Appam", "Puttu"],
        travelTips: "Book houseboats in advance during peak season."
      },
      {
        name: "Munnar Hill Station",
        state: "Kerala",
        category: "nature",
        description: "Rolling tea plantations and cool mountain climate.",
        imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "September to March",
        localFood: ["Tea", "Cardamom", "Spices"],
        travelTips: "Carry warm clothes as it gets chilly in the evenings."
      },
      {
        name: "Kochi (Cochin)",
        state: "Kerala",
        category: "cultural",
        description: "Historic port city with Chinese fishing nets and colonial architecture.",
        imageUrl: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Seafood", "Coconut curry", "Banana chips"],
        travelTips: "Visit Fort Kochi area during sunset for beautiful views."
      },
      {
        name: "Thekkady Wildlife Sanctuary",
        state: "Kerala",
        category: "adventure",
        description: "Home to elephants, tigers and exotic spice plantations.",
        imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Spice-infused dishes", "Bamboo rice"],
        travelTips: "Take a boat ride on Periyar Lake for wildlife spotting."
      },
      {
        name: "Varkala Beach",
        state: "Kerala",
        category: "nature",
        description: "Dramatic cliff-side beach with spiritual significance.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "November to March",
        localFood: ["Fresh seafood", "Coconut water"],
        travelTips: "Best time for cliff views is during sunset."
      },

      // Mumbai
      {
        name: "Gateway of India",
        state: "Mumbai",
        category: "historical",
        description: "Iconic archway overlooking the Arabian Sea.",
        imageUrl: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "November to February",
        localFood: ["Vada Pav", "Pav Bhaji", "Street food"],
        travelTips: "Take a ferry to Elephanta Caves from here."
      },
      {
        name: "Marine Drive",
        state: "Mumbai",
        category: "cultural",
        description: "The Queen's Necklace - a beautiful seafront promenade.",
        imageUrl: "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "Year round",
        localFood: ["Bhel Puri", "Kulfi", "Juice"],
        travelTips: "Visit during sunset or night when the street lights create the 'Queen's Necklace' effect."
      },

      // Rajasthan
      {
        name: "Amber Fort",
        state: "Rajasthan",
        category: "historical",
        description: "Magnificent hilltop fort with intricate architecture.",
        imageUrl: "https://images.unsplash.com/photo-1596870734672-9c7daa9c1813?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Dal Baati Churma", "Ghevar", "Rajasthani Thali"],
        travelTips: "Take an elephant ride up to the fort for a royal experience."
      },
      {
        name: "Thar Desert",
        state: "Rajasthan",
        category: "adventure",
        description: "Golden sand dunes perfect for camel safaris.",
        imageUrl: "https://images.unsplash.com/photo-1548013146-72479768bada?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Desert delicacies", "Ker Sangri"],
        travelTips: "Stay overnight in desert camps for the best experience."
      },

      // Goa
      {
        name: "Baga Beach",
        state: "Goa",
        category: "nature",
        description: "Popular beach known for water sports and nightlife.",
        imageUrl: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "November to March",
        localFood: ["Fish curry rice", "Bebinca", "Feni"],
        travelTips: "Try water sports and visit beach shacks for authentic Goan experience."
      },

      // Uttar Pradesh - Lucknow
      {
        name: "Bara Imambara",
        state: "Lucknow",
        category: "historical",
        description: "Magnificent 18th-century Shia mosque complex with famous labyrinth.",
        imageUrl: "https://images.unsplash.com/photo-1610375461246-83df859d849d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Tunday Kebabs", "Biryani", "Kulfi"],
        travelTips: "Don't miss the Bhool Bhulaiya maze inside the complex."
      },
      {
        name: "Chota Imambara",
        state: "Lucknow",
        category: "historical",
        description: "Beautiful golden-domed monument known as Palace of Lights.",
        imageUrl: "https://images.unsplash.com/photo-1580492516014-4a28466d55df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Lucknowi Biryani", "Sheermal"],
        travelTips: "Visit during evening when the monument is beautifully lit up."
      },
      {
        name: "Hazratganj Market",
        state: "Lucknow",
        category: "cultural",
        description: "Historic shopping district famous for Chikan embroidery and street food.",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to April",
        localFood: ["Basket Chaat", "Kulfi Faluda", "Makhan Malai"],
        travelTips: "Perfect place to buy authentic Chikan kurtas and taste local street food."
      },
      {
        name: "Rumi Darwaza",
        state: "Lucknow",
        category: "historical",
        description: "Imposing gateway built in 1784, symbol of Lucknow.",
        imageUrl: "https://images.unsplash.com/photo-1532274402911-5a369e4c4bb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "Year round",
        localFood: ["Street food nearby"],
        travelTips: "Great spot for photography, especially during golden hour."
      },
      {
        name: "British Residency",
        state: "Lucknow",
        category: "historical",
        description: "Ruins of the British Residency, site of the 1857 siege.",
        imageUrl: "https://images.unsplash.com/photo-1509741102003-ca64bfe5f069?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Traditional Awadhi cuisine nearby"],
        travelTips: "Explore the museum to learn about the historical significance."
      },

      // Uttar Pradesh - Agra
      {
        name: "Taj Mahal",
        state: "Agra",
        category: "historical",
        description: "UNESCO World Heritage Site and one of the Seven Wonders of the World.",
        imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Petha", "Mughlai cuisine", "Dalmoth"],
        travelTips: "Visit early morning for the best light and fewer crowds."
      },
      {
        name: "Agra Fort",
        state: "Agra",
        category: "historical",
        description: "Mughal fort and UNESCO World Heritage Site with magnificent palaces.",
        imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Mughlai dishes", "Agra ka Petha"],
        travelTips: "Combine with Taj Mahal visit for a full day of Mughal heritage."
      },

      // Uttar Pradesh - Varanasi
      {
        name: "Dashashwamedh Ghat",
        state: "Varanasi",
        category: "spiritual",
        description: "Main ghat on the Ganges famous for evening Ganga aarti ceremony.",
        imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Banarasi paan", "Kachori sabzi", "Lassi"],
        travelTips: "Attend the evening Ganga aarti, a mesmerizing spiritual experience."
      },
      {
        name: "Kashi Vishwanath Temple",
        state: "Varanasi",
        category: "spiritual",
        description: "One of the most sacred Hindu temples dedicated to Lord Shiva.",
        imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Temple prasadam", "Traditional sweets"],
        travelTips: "Visit early morning for peaceful darshan and spiritual atmosphere."
      },

      // Uttar Pradesh - Kanpur
      {
        name: "Allen Forest Zoo",
        state: "Kanpur",
        category: "nature",
        description: "One of the largest zoological parks in North India.",
        imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Street food", "Thaggu ke laddu"],
        travelTips: "Best time to visit is morning when animals are most active."
      },

      // Uttar Pradesh - Meerut
      {
        name: "Augarnath Temple",
        state: "Meerut",
        category: "spiritual",
        description: "Ancient Shiva temple with historical and religious significance.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Traditional North Indian", "Local sweets"],
        travelTips: "Visit during Maha Shivratri for special celebrations."
      },

      // Uttar Pradesh - Allahabad (Prayagraj)
      {
        name: "Triveni Sangam",
        state: "Allahabad",
        category: "spiritual",
        description: "Sacred confluence of three rivers - Ganga, Yamuna, and Saraswati.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Local street food", "Sweets"],
        travelTips: "Take a boat ride to experience the sangam. Visit during Kumbh Mela."
      },
      {
        name: "Allahabad Fort",
        state: "Allahabad",
        category: "historical",
        description: "Magnificent Mughal fort built by Emperor Akbar on the banks of Yamuna.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Allahabadi cuisine", "Local delicacies"],
        travelTips: "Explore the Patalpuri Temple and Akshaya Vat inside the fort."
      },

      // Uttar Pradesh - Mathura
      {
        name: "Krishna Janmabhoomi",
        state: "Mathura",
        category: "spiritual",
        description: "Sacred birthplace of Lord Krishna and major pilgrimage site.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Mathura ke pede", "Makhan mishri"],
        travelTips: "Visit during Janmashtami for grand celebrations."
      },

      // Uttar Pradesh - Vrindavan
      {
        name: "Banke Bihari Temple",
        state: "Vrindavan",
        category: "spiritual",
        description: "Famous Krishna temple known for its unique darshan style.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Prasadam", "Vrindavan ke laddu"],
        travelTips: "Experience the evening aarti and devotional atmosphere."
      },

      // Uttar Pradesh State
      {
        name: "UP Heritage Circuit",
        state: "Uttar Pradesh",
        category: "historical",
        description: "Explore India's largest state with Taj Mahal, Varanasi ghats, and Lucknow's Nawabi culture.",
        imageUrl: "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Awadhi cuisine", "Petha", "Tunday kebabs", "Lucknowi biryani"],
        travelTips: "Plan multi-city trip covering Agra, Lucknow, Varanasi for complete UP experience."
      },
      {
        name: "Krishna Janmabhoomi Circuit",
        state: "Uttar Pradesh", 
        category: "spiritual",
        description: "Sacred pilgrimage covering Mathura-Vrindavan, birthplace of Lord Krishna.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Mathura pede", "Makhan mishri", "Kachori"],
        travelTips: "Visit during Janmashtami for grand celebrations and festivals."
      },
      {
        name: "Ganga Aarti Experience",
        state: "Uttar Pradesh",
        category: "spiritual", 
        description: "Witness spiritual India along the sacred Ganges in Varanasi and Allahabad.",
        imageUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Banarasi paan", "Kachori sabzi", "Malaiyo"],
        travelTips: "Take early morning boat ride on Ganges for peaceful spiritual experience."
      },

      // Karnataka - Bangalore
      {
        name: "Lalbagh Botanical Garden",
        state: "Bangalore",
        category: "nature",
        description: "Beautiful 240-acre garden with diverse flora and glasshouse.",
        imageUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "Year round",
        localFood: ["South Indian breakfast", "Filter coffee"],
        travelTips: "Visit early morning for pleasant weather and bird watching."
      },
      {
        name: "Bangalore Palace",
        state: "Bangalore",
        category: "historical",
        description: "Tudor-style palace inspired by Windsor Castle with beautiful architecture.",
        imageUrl: "https://images.unsplash.com/photo-1587553161605-3d17abc945e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to February",
        localFood: ["Mysore Pak", "Masala Dosa"],
        travelTips: "Take the audio guide to learn about the Mysore royal family."
      },

      // Tamil Nadu - Chennai
      {
        name: "Marina Beach",
        state: "Chennai",
        category: "nature",
        description: "One of the longest urban beaches in the world.",
        imageUrl: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "November to February",
        localFood: ["Sundal", "Murukku", "Fresh coconut water"],
        travelTips: "Best time to visit is early morning or evening. Avoid swimming due to strong currents."
      },
      {
        name: "Kapaleeshwarar Temple",
        state: "Chennai",
        category: "spiritual",
        description: "Ancient Dravidian temple dedicated to Lord Shiva.",
        imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "Year round",
        localFood: ["Temple prasadam", "South Indian meals"],
        travelTips: "Dress modestly and remove footwear before entering the temple."
      },

      // Tamil Nadu - Madurai
      {
        name: "Meenakshi Amman Temple",
        state: "Madurai",
        category: "spiritual",
        description: "Historic Hindu temple with stunning architecture and colorful gopurams.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Jigarthanda", "Paruthi Paal", "Kari Dosa"],
        travelTips: "Visit during evening aarti for a spiritual experience."
      },

      // West Bengal - Kolkata
      {
        name: "Victoria Memorial",
        state: "Kolkata",
        category: "historical",
        description: "Magnificent white marble monument dedicated to Queen Victoria.",
        imageUrl: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Fish curry", "Rosogolla", "Mishti doi"],
        travelTips: "Visit the museum inside to learn about colonial history."
      },
      {
        name: "Howrah Bridge",
        state: "Kolkata",
        category: "cultural",
        description: "Iconic cantilever bridge over the Hooghly River.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "Year round",
        localFood: ["Street food", "Puchka", "Kathi rolls"],
        travelTips: "Best photography spots are from both sides of the river."
      },

      // Himachal Pradesh - Shimla
      {
        name: "The Ridge",
        state: "Shimla",
        category: "nature",
        description: "Famous open space in the heart of Shimla with mountain views.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "March to June, September to December",
        localFood: ["Sidu", "Babru", "Channa Madra"],
        travelTips: "Take the toy train from Kalka to Shimla for scenic journey."
      },
      {
        name: "Mall Road",
        state: "Shimla",
        category: "cultural",
        description: "Main shopping street with colonial architecture and local crafts.",
        imageUrl: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "Year round",
        localFood: ["Hot chocolate", "Momos", "Local sweets"],
        travelTips: "Evening strolls offer beautiful sunset views over the mountains."
      },

      // Himachal Pradesh - Manali
      {
        name: "Rohtang Pass",
        state: "Manali",
        category: "adventure",
        description: "High mountain pass offering snow activities and stunning views.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "May to October",
        localFood: ["Thukpa", "Momos", "Siddu"],
        travelTips: "Carry warm clothes and check road conditions before visiting."
      },

      // Punjab - Amritsar
      {
        name: "Golden Temple",
        state: "Amritsar",
        category: "spiritual",
        description: "Most sacred Sikh shrine with golden architecture and free langar.",
        imageUrl: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Langar meals", "Kulcha", "Lassi"],
        travelTips: "Cover your head and remove shoes before entering the complex."
      },
      {
        name: "Jallianwala Bagh",
        state: "Amritsar",
        category: "historical",
        description: "Memorial of the tragic 1919 massacre, symbol of Indian freedom struggle.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Traditional Punjabi meals"],
        travelTips: "Visit the museum to understand the historical significance."
      },

      // Uttarakhand - Rishikesh
      {
        name: "Laxman Jhula",
        state: "Rishikesh",
        category: "spiritual",
        description: "Iconic suspension bridge over the Ganges with spiritual significance.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "September to June",
        localFood: ["Sattvic food", "Chole bhature", "Lassi"],
        travelTips: "Join evening Ganga aarti for a spiritual experience."
      },
      {
        name: "Triveni Ghat",
        state: "Rishikesh",
        category: "spiritual",
        description: "Sacred bathing ghat where three rivers meet, evening aarti venue.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "Year round",
        localFood: ["Prasadam", "Simple vegetarian meals"],
        travelTips: "Evening aarti at sunset is a must-see spiritual experience."
      },

      // Uttarakhand - Haridwar
      {
        name: "Har Ki Pauri",
        state: "Haridwar",
        category: "spiritual",
        description: "Most sacred ghat on the Ganges for evening Ganga aarti.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "September to June",
        localFood: ["Prasadam", "Aloo puri", "Jalebi"],
        travelTips: "Arrive early for evening aarti to get a good spot."
      },

      // Andhra Pradesh - Hyderabad
      {
        name: "Charminar",
        state: "Hyderabad",
        category: "historical",
        description: "Iconic 16th-century monument and symbol of Hyderabad.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Biryani", "Haleem", "Irani chai"],
        travelTips: "Visit the nearby Laad Bazaar for pearls and bangles."
      },
      {
        name: "Golconda Fort",
        state: "Hyderabad",
        category: "historical",
        description: "Ruined city and fortress with acoustic marvels and panoramic views.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Nizami cuisine", "Qubani ka meetha"],
        travelTips: "Visit during sound and light show in the evening."
      },

      // Assam - Guwahati
      {
        name: "Kamakhya Temple",
        state: "Guwahati",
        category: "spiritual",
        description: "Ancient Hindu temple dedicated to Goddess Kamakhya.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to April",
        localFood: ["Assamese thali", "Fish curry", "Pitha"],
        travelTips: "Temple is closed during Ambubachi Mela in June."
      },

      // Gujarat - Ahmedabad
      {
        name: "Sabarmati Ashram",
        state: "Ahmedabad",
        category: "historical",
        description: "Gandhi's residence and starting point of Dandi March.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Gujarati thali", "Dhokla", "Fafda"],
        travelTips: "Visit the museum to learn about Gandhi's life and philosophy."
      },

      // Madhya Pradesh - Bhopal
      {
        name: "Sanchi Stupa",
        state: "Bhopal",
        category: "historical",
        description: "Ancient Buddhist monument and UNESCO World Heritage Site.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Poha", "Jalebi", "Bhopali paan"],
        travelTips: "Best preserved Buddhist stupas in India, guided tours available."
      },

      // Odisha - Bhubaneswar
      {
        name: "Lingaraj Temple",
        state: "Bhubaneswar",
        category: "spiritual",
        description: "Ancient Hindu temple dedicated to Lord Shiva with Kalinga architecture.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Pakhala", "Dahibara Aloodum", "Rasagola"],
        travelTips: "Non-Hindus can view the temple from nearby viewing points."
      },

      // Odisha - Puri
      {
        name: "Jagannath Temple",
        state: "Puri",
        category: "spiritual",
        description: "Sacred Hindu temple famous for annual Rath Yatra festival.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Mahaprasad", "Kheer", "Puri sweets"],
        travelTips: "Only Hindus are allowed inside the temple complex."
      },

      // Haryana - Gurugram
      {
        name: "Kingdom of Dreams",
        state: "Gurugram",
        category: "cultural",
        description: "Live entertainment destination showcasing Indian culture and arts.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "Year round",
        localFood: ["Multi-cuisine food court", "Regional Indian dishes"],
        travelTips: "Book shows in advance, especially during weekends."
      },

      // Sikkim - Gangtok
      {
        name: "Tsomgo Lake",
        state: "Gangtok",
        category: "nature",
        description: "Sacred glacial lake at high altitude with stunning mountain views.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "March to June, September to December",
        localFood: ["Momos", "Thukpa", "Gundruk"],
        travelTips: "Carry warm clothes and permits required for Indian nationals."
      },

      // Jammu and Kashmir - Srinagar
      {
        name: "Dal Lake",
        state: "Srinagar",
        category: "nature",
        description: "Pristine lake famous for houseboats and shikara rides.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "April to October",
        localFood: ["Rogan Josh", "Kahwa", "Wazwan"],
        travelTips: "Stay in a houseboat for authentic Kashmir experience."
      },
      {
        name: "Mughal Gardens",
        state: "Srinagar",
        category: "nature",
        description: "Beautiful terraced gardens built during Mughal era.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "March to October",
        localFood: ["Kashmiri tea", "Local fruits"],
        travelTips: "Visit Shalimar Bagh, Nishat Bagh, and Chashme Shahi gardens."
      },

      // Leh Ladakh
      {
        name: "Pangong Tso",
        state: "Leh",
        category: "nature",
        description: "High-altitude lake with changing colors and breathtaking beauty.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "May to September",
        localFood: ["Thukpa", "Momos", "Butter tea"],
        travelTips: "Carry permits and warm clothes. Altitude sickness precautions needed."
      },
      {
        name: "Nubra Valley",
        state: "Leh",
        category: "adventure",
        description: "High desert valley with sand dunes and double-humped camels.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "May to September",
        localFood: ["Ladakhi cuisine", "Apricots"],
        travelTips: "Cross Khardung La pass, one of the highest motorable roads."
      },

      // Arunachal Pradesh - Itanagar
      {
        name: "Tawang Monastery",
        state: "Itanagar",
        category: "spiritual",
        description: "Largest monastery in India with stunning mountain backdrop.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "March to October",
        localFood: ["Momos", "Thukpa", "Local tribal cuisine"],
        travelTips: "Inner Line Permit required for non-residents of Arunachal Pradesh."
      },

      // Nagaland - Kohima
      {
        name: "Hornbill Festival",
        state: "Kohima",
        category: "cultural",
        description: "Annual festival showcasing Naga tribal culture and traditions.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "December (during festival)",
        localFood: ["Naga cuisine", "Smoked pork", "Bamboo shoot"],
        travelTips: "Plan visit during December for the famous Hornbill Festival."
      },

      // Manipur - Imphal
      {
        name: "Loktak Lake",
        state: "Imphal",
        category: "nature",
        description: "Largest freshwater lake in Northeast India with floating islands.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Manipuri cuisine", "Ngari", "Eromba"],
        travelTips: "Visit Keibul Lamjao National Park, only floating national park."
      },

      // Meghalaya - Shillong
      {
        name: "Living Root Bridges",
        state: "Shillong",
        category: "nature",
        description: "Unique bridges made from living tree roots in Cherrapunji.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to April",
        localFood: ["Khasi cuisine", "Jadoh", "Tungrymbai"],
        travelTips: "Trek to double-decker root bridge in Nongriat village."
      },

      // Tripura - Agartala
      {
        name: "Ujjayanta Palace",
        state: "Agartala",
        category: "historical",
        description: "Former royal palace now serving as state museum.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Bengali cuisine", "Fish curry", "Sweets"],
        travelTips: "Explore the beautiful gardens and museum inside the palace."
      },

      // Mizoram - Aizawl
      {
        name: "Blue Mountain",
        state: "Aizawl",
        category: "nature",
        description: "Scenic hill station with panoramic views of surrounding valleys.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Mizo cuisine", "Bai", "Sawhchiar"],
        travelTips: "Inner Line Permit required for tourists."
      },

      // Chhattisgarh - Raipur
      {
        name: "Chitrakote Falls",
        state: "Raipur",
        category: "nature",
        description: "India's broadest waterfall, often called Niagara of India.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "July to March",
        localFood: ["Chhattisgarhi cuisine", "Farra", "Petha"],
        travelTips: "Best during monsoon when water flow is maximum."
      },

      // Jharkhand - Ranchi
      {
        name: "Hundru Falls",
        state: "Ranchi",
        category: "nature",
        description: "Beautiful waterfall surrounded by dense forests and hills.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "July to February",
        localFood: ["Litti Chokha", "Tribal cuisine", "Handia"],
        travelTips: "Combine with visit to nearby Jonha Falls for a full day trip."
      },
      {
        name: "Rock Garden",
        state: "Ranchi",
        category: "nature",
        description: "Beautiful garden built around natural rock formations.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Local street food", "Tribal delicacies"],
        travelTips: "Great spot for photography and peaceful walks."
      },

      // Jharkhand - Jamshedpur
      {
        name: "Jubilee Park",
        state: "Jamshedpur",
        category: "nature",
        description: "Large urban park with rose garden and recreational facilities.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Bengali cuisine", "Tribal food"],
        travelTips: "Perfect for morning walks and family outings."
      },

      // Jharkhand - Deoghar
      {
        name: "Baba Baidyanath Temple",
        state: "Deoghar",
        category: "spiritual",
        description: "One of the twelve Jyotirlingas dedicated to Lord Shiva.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Prasadam", "Local sweets", "Khichdi"],
        travelTips: "Visit during Shravan month for special significance."
      },

      // Jharkhand State
      {
        name: "Netarhat",
        state: "Jharkhand",
        category: "nature",
        description: "Hill station known as Queen of Chotanagpur with scenic sunsets.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Tribal cuisine", "Handia", "Local vegetables"],
        travelTips: "Famous for spectacular sunrise and sunset views."
      },
      {
        name: "Betla National Park",
        state: "Jharkhand",
        category: "nature",
        description: "First national park in Jharkhand with tigers, elephants and diverse wildlife.",
        imageUrl: "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "November to April",
        localFood: ["Tribal delicacies", "Forest honey", "Local herbs"],
        travelTips: "Book safari in advance and carry binoculars for wildlife spotting."
      },
      {
        name: "Jharkhand Tribal Heritage",
        state: "Jharkhand",
        category: "cultural",
        description: "Experience rich tribal culture, traditional dances and handicrafts.",
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Handia", "Pittha", "Dudhauri", "Litti Chokha"],
        travelTips: "Visit tribal villages during festivals for authentic cultural experience."
      },

      // Bihar - Patna
      {
        name: "Bodh Gaya",
        state: "Patna",
        category: "spiritual",
        description: "Sacred Buddhist site where Buddha attained enlightenment.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Sattu", "Litti Chokha", "Khaja"],
        travelTips: "Visit Mahabodhi Temple and meditate under the Bodhi Tree."
      },

      // Andhra Pradesh - Visakhapatnam
      {
        name: "Araku Valley",
        state: "Visakhapatnam",
        category: "nature",
        description: "Hill station with coffee plantations and tribal culture.",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to February",
        localFood: ["Araku coffee", "Bamboo chicken", "Tribal cuisine"],
        travelTips: "Take the scenic train journey from Visakhapatnam to Araku."
      },

      // Telangana - Warangal
      {
        name: "Thousand Pillar Temple",
        state: "Warangal",
        category: "historical",
        description: "Ancient Kakatiya dynasty temple with intricate stone carvings.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Telangana cuisine", "Sarva Pindi", "Boorelu"],
        travelTips: "Marvel at the detailed stone work and temple architecture."
      },

      // Karnataka - Mysore
      {
        name: "Mysore Palace",
        state: "Mysore",
        category: "historical",
        description: "Magnificent palace with Indo-Saracenic architecture and royal grandeur.",
        imageUrl: "https://images.unsplash.com/photo-1587553161605-3d17abc945e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to March",
        localFood: ["Mysore Pak", "Masala Dosa", "Filter coffee"],
        travelTips: "Visit during Dasara festival for spectacular celebrations."
      },

      // Karnataka - Hampi
      {
        name: "Virupaksha Temple",
        state: "Hampi",
        category: "historical",
        description: "Ancient temple complex in the ruins of Vijayanagara Empire.",
        imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        bestTimeToVisit: "October to February",
        localFood: ["South Indian meals", "Banana leaf meals"],
        travelTips: "Explore the entire Hampi ruins complex, UNESCO World Heritage Site."
      }
    ];

    destinationsData.forEach(dest => {
      const id = randomUUID();
      this.destinations.set(id, { ...dest, id });
    });
  }

  async getDestinationsByLocation(location: string): Promise<Destination[]> {
    const normalizedLocation = location.toLowerCase().trim();
    return Array.from(this.destinations.values()).filter(dest => 
      dest.state.toLowerCase().includes(normalizedLocation) || 
      dest.name.toLowerCase().includes(normalizedLocation)
    );
  }

  async searchDestinations(query: string): Promise<Destination[]> {
    const normalizedQuery = query.toLowerCase().trim();
    return Array.from(this.destinations.values()).filter(dest => 
      dest.state.toLowerCase().includes(normalizedQuery) || 
      dest.name.toLowerCase().includes(normalizedQuery) ||
      dest.category.toLowerCase().includes(normalizedQuery)
    );
  }

  async getAllDestinations(): Promise<Destination[]> {
    return Array.from(this.destinations.values());
  }

  async saveChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const id = randomUUID();
    const message: ChatMessage = {
      id,
      message: insertMessage.message,
      location: insertMessage.location || null,
      isBot: insertMessage.isBot,
      timestamp: new Date().toISOString(),
      recommendations: (insertMessage.recommendations as Recommendation[] | null) || null
    };
    this.chatMessages.set(id, message);
    return message;
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    return Array.from(this.chatMessages.values()).sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }
}

export const storage = new MemStorage();
