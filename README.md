# CivicReport - Crowdsourced Civic Issue Reporting System

A LinkedIn-style social media web application for reporting and tracking civic issues in communities.

## Features

- **Social Media Interface**: LinkedIn-style posting and interaction system
- **Issue Reporting**: Report civic issues with photos, descriptions, and location
- **Category System**: Organized categories for different types of civic issues
- **Geolocation**: Automatic location tagging and Google Maps integration
- **Voting System**: Upvote issues to show community support
- **Comments**: Community discussion on reported issues
- **Duplicate Detection**: Shows similar posts in the same area to prevent duplicates
- **Severity Rating**: Rate the urgency of issues (1-5 scale)
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works on mobile and desktop

## Categories

- 🚧 Infrastructure & Roads
- 💡 Utilities & Public Services  
- 🗑️ Sanitation & Waste
- 🌳 Environment & Public Spaces
- 🚍 Transport & Mobility
- 🏛️ Safety & Law & Order
- 🏥 Health & Hygiene
- 📢 Governance & Community

## Tech Stack

### Backend
- Node.js + Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads
- Bcrypt for password hashing

### Frontend
- React.js
- Material-UI (MUI)
- React Router
- Axios for API calls
- Google Maps integration

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google Maps API Key (optional, for maps functionality)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create/update the `.env` file with your configuration:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/civicissues
   JWT_SECRET=your-super-secret-jwt-key
   NODE_ENV=development
   GOOGLE_MAPS_API_KEY=your-google-maps-api-key
   ```

4. Start the MongoDB service (if running locally)

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the `.env` file if needed:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

   The frontend will run on http://localhost:3000

### Development Workflow

1. Start MongoDB service
2. Start backend server: `cd backend && npm run dev`
3. Start frontend server: `cd frontend && npm start`
4. Access the application at http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Posts
- `GET /api/posts` - Get all posts with filters
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get single post
- `POST /api/posts/:id/vote` - Vote on post
- `POST /api/posts/:id/comment` - Add comment
- `GET /api/posts/similar` - Get similar posts (duplicate detection)

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update user profile

## Project Structure

```
social-issue/
├── backend/
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   ├── uploads/        # File uploads directory
│   ├── server.js       # Main server file
│   └── .env           # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable React components
│   │   ├── pages/      # Page components
│   │   ├── contexts/   # React contexts
│   │   ├── utils/      # Utility functions
│   │   └── App.js      # Main React app
│   ├── public/         # Static assets
│   └── .env           # Frontend environment variables
└── README.md
```

## Current Implementation Status

✅ **Completed:**
- Project structure and dependencies setup
- Backend API with all models and routes
- User authentication system
- Frontend routing and basic components
- Home page with post feed and filters
- Login and registration pages
- Responsive UI with Material-UI

🚧 **In Progress:**
- Post creation form with image upload
- Google Maps integration for location tagging
- Duplicate post detection
- Comment system
- Complete post detail pages

📋 **Next Steps:**
1. Complete post creation form with all features
2. Implement Google Maps integration
3. Add duplicate post detection logic
4. Build comprehensive commenting system
5. Add real-time features
6. Testing and optimization

## Contributing

This project is built for a hackathon. To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project as a starting point for your own civic engagement applications.

## Hackathon Notes

This application addresses the hackathon challenge of creating a "Crowdsourced Civic Issue Reporting and Resolution System" with a social media approach that encourages community engagement and prevents duplicate reporting through smart suggestions.

The LinkedIn-style interface makes civic engagement more familiar and accessible to users, while the comprehensive categorization and voting system helps prioritize issues for municipal attention.
