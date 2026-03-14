# AI & Machine Learning Forum - MERN Stack Application

A full-stack forum application built with MongoDB, Express.js, React, and Node.js (MERN) for AI and Machine Learning enthusiasts to discuss, share knowledge, and collaborate.

## Project Structure

```
/backend - Express.js API server
├── config/          - Database configuration
├── models/          - MongoDB schemas (User, Thread, Reply, Category, Tag)
├── controllers/     - Business logic for routes
├── routes/          - API endpoints
├── middleware/      - Authentication & error handling
└── server.js        - Express app initialization

/frontend - React SPA
├── src/
│   ├── components/  - Reusable UI components
│   ├── pages/       - Page components (Home, Forum, Login, etc.)
│   ├── context/     - React Context (AuthContext)
│   ├── hooks/       - Custom hooks (useAuth)
│   ├── services/    - API service layer (Axios)
│   └── App.jsx      - Main app routing
├── public/          - Static assets
├── vite.config.js   - Vite configuration
└── tailwind.config.js - Tailwind CSS configuration
```

## Features

### Core Features
- User authentication with JWT tokens
- Create, read, update, delete threads
- Reply system with upvote/downvote functionality
- Category management for organizing discussions
- Tag system for content categorization
- User profiles with activity tracking
- Search functionality for threads
- Pagination for threads and replies
- Responsive dark-themed UI with Tailwind CSS

### User Roles
- **User**: Default role for registered members
- **Moderator**: Can pin threads and manage content
- **Admin**: Full administrative access

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Cors** - Cross-origin resource sharing

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Vite** - Build tool

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or pnpm

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-ml-forum
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Threads
- `GET /api/threads` - Get all threads with pagination
- `GET /api/threads/:id` - Get single thread
- `POST /api/threads` - Create thread (protected)
- `PUT /api/threads/:id` - Update thread (protected)
- `DELETE /api/threads/:id` - Delete thread (protected)
- `PATCH /api/threads/:id/pin` - Pin thread (admin/moderator only)
- `GET /api/threads/stats` - Get forum statistics

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (admin only)
- `PUT /api/categories/:id` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Replies
- `GET /api/replies/:threadId` - Get replies for a thread
- `POST /api/replies/:threadId` - Create reply (protected)
- `PUT /api/replies/:id` - Update reply (protected)
- `DELETE /api/replies/:id` - Delete reply (protected)
- `POST /api/replies/:id/upvote` - Upvote reply (protected)
- `POST /api/replies/:id/downvote` - Downvote reply (protected)

### Users
- `GET /api/users/:id` - Get user profile
- `GET /api/users/:id/threads` - Get user's threads
- `PUT /api/users/profile/update` - Update profile (protected)
- `GET /api/users` - Get all users (admin only)
- `PATCH /api/users/:id/role` - Update user role (admin only)

## Key Components

### Frontend Components
- **Header** - Navigation bar with auth links
- **Footer** - Footer section
- **Layout** - Main layout wrapper
- **ThreadCard** - Thread display card
- **CategoryCard** - Category display card
- **ReplyItem** - Individual reply component

### Frontend Pages
- **Home** - Landing page with forum statistics
- **Categories** - All forum categories
- **Forum** - Thread listing with search and pagination
- **ThreadDetail** - Individual thread with replies
- **CreateThread** - Form to create new thread
- **Login** - User login form
- **Register** - User registration form
- **Profile** - User profile page

## Database Schema

### User Collection
- username, email, password (hashed)
- bio, avatar, role
- threadsCount, repliesCount
- createdAt, updatedAt

### Category Collection
- name, description, slug
- icon, color
- threadsCount
- createdAt

### Thread Collection
- title, content, author (ref)
- category (ref), tags, views
- repliesCount, pinnedAt, solved
- createdAt, updatedAt

### Reply Collection
- content, author (ref), thread (ref)
- upvotes, downvotes
- upvotedBy, downvotedBy (arrays)
- isAnswer, isEdited
- createdAt, updatedAt

## Styling

The application uses Tailwind CSS with a custom dark theme:
- **Primary**: #2563eb (Blue)
- **Secondary**: #6366f1 (Indigo)
- **Accent**: #10b981 (Green)
- **Dark Background**: #0f172a
- **Dark Surface**: #1e293b
- **Dark Border**: #334155

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Protected routes with middleware
- Input validation on backend
- CORS configuration
- Role-based access control

## Future Enhancements

- [ ] Real-time notifications with Socket.io
- [ ] Email notifications for thread updates
- [ ] Advanced search with filters
- [ ] User reputation system
- [ ] Thread bookmarking
- [ ] User mentions and notifications
- [ ] Code syntax highlighting in threads
- [ ] Image uploads for threads and replies
- [ ] Discord/GitHub OAuth integration

## Troubleshooting

### Backend Connection Issues
- Ensure MongoDB is running locally or connection string is correct
- Check if port 5000 is not in use
- Verify MONGODB_URI in .env file

### Frontend Build Issues
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear Vite cache: `rm -rf dist`

### CORS Errors
- Make sure backend CLIENT_URL matches frontend URL
- Frontend should be on http://localhost:5173
- Backend API_URL in frontend .env should match backend URL

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the repository or contact the development team.
