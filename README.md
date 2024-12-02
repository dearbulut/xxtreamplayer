# IPTV Player

A modern web-based IPTV player built with Next.js 15, featuring profile management, live channels, movies, and series streaming capabilities. Compatible with IPTV providers using the Xtream Codes API.

## Features

- 🔐 **Profile Management**
  - Multiple profiles per user
  - Secure credential storage
  - Profile-specific IPTV settings

- 📺 **Live TV**
  - EPG (Electronic Program Guide) support
  - Live channel streaming
  - Channel categorization
  - Timezone selection

- 🎬 **Video on Demand**
  - Movies library
  - TV Series collection
  - Video player with advanced controls
  - Detailed media information

- 🛠 **Technical Features**
  - Server-side and client-side rendering optimization
  - Secure authentication system
  - Responsive design
  - Type-safe implementation with TypeScript
  - Full Xtream Codes API support

## IPTV Provider Compatibility

This player is designed to work with IPTV providers that use the Xtream Codes API. To use the player, you'll need:

- IPTV Provider URL (usually in format: http://domain.com:port)
- Username
- Password

The player supports all standard Xtream Codes API endpoints including:
- Live Streams
- VOD (Movies)
- Series
- EPG Data
- Stream Categories
- Multi-connection support

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based auth
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui
- **State Management**: React Hooks
- **Video Player**: Video.js

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/BifrostBuilder/xtream-player.git
cd xtream-player
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with the following variables:
```env
DATABASE_URL="your-postgres-connection-string"
JWT_SECRET="your-jwt-secret"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

4. Push the database schema:
```bash
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

## Project Structure

- `/src`
  - `/app` - Next.js 15 app router pages
  - `/components` - Reusable React components
  - `/lib` - Utility functions and shared logic
  - `/db` - Database schema and queries
  - `/types` - TypeScript type definitions

## Key Components

### Profile Management
- Client-side profile storage with localStorage
- Server-side profile validation
- Secure credential management
- Support for multiple IPTV provider credentials

### Authentication
- JWT-based authentication
- HTTP-only cookies for security
- Server-side session validation

### Video Playback
- Support for HLS streams
- Custom video player controls
- EPG integration for live channels
- Adaptive bitrate streaming

### API Integration
- Full Xtream Codes API implementation
- RESTful API endpoints
- Type-safe API calls
- Error handling and fallbacks
- Automatic API endpoint detection

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `NEXT_PUBLIC_SITE_URL`: Public URL of the application

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Video playback powered by [Video.js](https://videojs.com/)
