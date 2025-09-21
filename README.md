# AI Work Engine

AI-powered project collaboration platform with Solana blockchain integration.

## 🚀 Railway Deployment

### Backend Deployment
1. Create new Railway project
2. Connect this repository
3. Set root directory to `backend`
4. Add environment variables:
   ```
   DATABASE_URL=postgresql://...
   JWT_SECRET=your-secret-key
   OPENAI_API_KEY=your-openai-key
   SOLANA_RPC_URL=https://api.devnet.solana.com
   NODE_ENV=production
   ```
5. Deploy automatically

### Frontend Deployment
1. Create another Railway service
2. Connect same repository
3. Set root directory to `frontend`
4. Add environment variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend.railway.app
   NODE_ENV=production
   ```
5. Deploy automatically

### Database Setup
1. Add PostgreSQL service in Railway
2. Copy DATABASE_URL to backend environment
3. Run migrations: `npx prisma migrate deploy`

## 🔧 Local Development

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 🌟 Features
- Solana wallet authentication
- AI-powered team matching
- SPL token creation & management
- Real-time project collaboration
- Transparent contribution rewards