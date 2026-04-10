# ShopEZ - E-Commerce Platform

## 🚀 Deployment Guide

### Prerequisites
- Node.js 16+
- MongoDB Atlas account
- Git & GitHub account

### Backend Deployment (Render)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: shopez-backend
     - **Root Directory**: backend
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   
3. **Add Environment Variables** (in Render dashboard):
   ```
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/shopez?retryWrites=true&w=majority
   JWT_SECRET=<generate-strong-secret-min-32-chars>
   JWT_EXPIRE=30d
   NODE_ENV=production
   FRONTEND_URL=<your-vercel-url>
   ```

4. **Copy your backend URL** (e.g., `https://shopez-backend.onrender.com`)

### Frontend Deployment (Vercel)

1. **Update Frontend Environment**
   - Create `.env.production` in frontend folder:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

2. **Deploy on Vercel**
   ```bash
   npm install -g vercel
   cd frontend
   vercel
   ```
   - Follow prompts
   - Add environment variable in Vercel dashboard:
     - `VITE_API_URL` = your backend URL + `/api`

3. **Update Backend CORS**
   - Go back to Render dashboard
   - Add your Vercel URL to `FRONTEND_URL` environment variable
   - Redeploy backend

### Local Development

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Important Security Notes

⚠️ **NEVER commit `.env` files to Git**
- Use `.env.example` as template
- Generate strong JWT secret: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Keep MongoDB credentials secure
- Update CORS origins for production

### Environment Variables

**Backend (.env):**
- `PORT` - Server port
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT (min 32 characters)
- `JWT_EXPIRE` - Token expiration time
- `NODE_ENV` - Environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS

**Frontend (.env):**
- `VITE_API_URL` - Backend API URL

## 📦 Tech Stack

**Frontend:**
- React + Vite
- React Router
- Axios

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT authentication
- CORS protection
- Environment variable protection
- Input validation

## 📝 License

MIT
