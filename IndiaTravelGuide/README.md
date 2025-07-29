# India Travel Guide Chatbot

An intelligent travel guide chatbot for India that provides personalized destination recommendations with a conversational interface.

## Features

- **Complete India Coverage**: 70+ destinations across all 28 states and 8 union territories
- **Smart Location Recognition**: Recognizes cities, states, and regions instantly
- **Curated Recommendations**: 3-5 handpicked destinations per query with authentic local insights
- **Rich Information**: Local food specialties, travel tips, best time to visit, and cultural context
- **Mobile Responsive**: Optimized for all devices with modern UI design
- **Real-time Chat**: Interactive conversation interface with travel-themed design

## Comprehensive Coverage

### All Indian States & Union Territories
- **North**: Delhi, Punjab, Haryana, Himachal Pradesh, Uttarakhand, Uttar Pradesh, J&K, Ladakh
- **Northeast**: All 8 states including Assam, Arunachal Pradesh, Nagaland, Manipur, Meghalaya, Tripura, Mizoram, Sikkim
- **West**: Rajasthan, Gujarat, Maharashtra, Goa
- **South**: Karnataka, Kerala, Tamil Nadu, Andhra Pradesh, Telangana
- **Central**: Madhya Pradesh, Chhattisgarh, Jharkhand
- **East**: West Bengal, Odisha, Bihar

### Major Cities & Destinations
- **Metropolitan**: Delhi, Mumbai, Chennai, Kolkata, Bangalore, Hyderabad
- **UP Complete**: Lucknow, Agra, Varanasi, Kanpur, Meerut, Allahabad, Mathura, Vrindavan
- **Tourist Favorites**: Jaipur, Udaipur, Shimla, Manali, Goa, Kochi, Mysore, Darjeeling
- **Spiritual Centers**: Rishikesh, Haridwar, Varanasi, Mathura-Vrindavan, Bodh Gaya
- **Adventure**: Leh-Ladakh, Manali, Rishikesh, Northeast hills

## Technology Stack

- **Frontend**: React + TypeScript, Tailwind CSS, Shadcn/UI
- **Backend**: Node.js + Express, TypeScript
- **Database**: In-memory storage (easily extensible to PostgreSQL)
- **State Management**: TanStack React Query
- **Build**: Vite for fast development and optimized production builds

## Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Visit http://localhost:5000
```

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start
```

## Deployment

### Railway (Recommended - Free)
1. Fork this repository
2. Connect to Railway.app
3. Deploy directly from GitHub
4. Automatic HTTPS and custom domain

### Other Free Options
- **Render**: 750 hours/month free
- **Vercel**: Unlimited deployments
- **Netlify**: 100GB bandwidth/month

## Environment Variables

```bash
PORT=5000                    # Server port (auto-detected on most platforms)
NODE_ENV=production         # Environment mode
```

## API Endpoints

- `GET /api/destinations/popular` - Popular destination suggestions
- `GET /api/destinations/search?q=query` - Search destinations
- `POST /api/chat` - Process chat messages and return recommendations
- `GET /api/chat/history` - Retrieve chat history

## Architecture Highlights

- **Scalable Design**: Easy to extend with database backends
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Responsive design with consistent theming
- **Performance**: Optimized for fast loading and smooth interactions
- **SEO Ready**: Server-side rendering support

## Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Test thoroughly
5. Submit pull request

## License

MIT License - Feel free to use for personal and commercial projects.

---

**Built with ❤️ for travelers exploring incredible India!**