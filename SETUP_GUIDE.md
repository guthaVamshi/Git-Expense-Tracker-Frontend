# Expense Tracker - Separated Frontend & Backend Setup Guide

## Overview

The Expense Tracker project has been successfully separated into two independent repositories:

- **Frontend Repository**: React + TypeScript application (this repo)
- **Backend Repository**: Spring Boot API server (separate repo)

## 🚀 Quick Setup

### 1. Backend Setup (Required First)

1. **Clone the backend repository** (if not already done):
   ```bash
   git clone <your-backend-repo-url>
   cd expense-tracker-backend
   ```

2. **Start the backend server**:
   ```bash
   ./mvnw spring-boot:run
   ```
   
   The backend will run on `http://localhost:8080`

### 2. Frontend Setup

1. **Clone this frontend repository** (if not already done):
   ```bash
   git clone <your-frontend-repo-url>
   cd expense-tracker-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` if needed:
   ```
   VITE_API_URL=http://localhost:8080/api
   ```

4. **Start the frontend**:
   ```bash
   npm run dev
   ```
   
   The frontend will run on `http://localhost:5173`

## 🔧 Development Workflow

### Local Development

1. **Start backend first**: `./mvnw spring-boot:run` (port 8080)
2. **Start frontend**: `npm run dev` (port 5173)
3. **Access application**: Open `http://localhost:5173` in your browser

### Environment Variables

#### Frontend (.env)
```bash
# Backend API URL
VITE_API_URL=http://localhost:8080/api

# For production deployment
# VITE_API_URL=https://your-backend-domain.com/api
```

#### Backend (application.properties)
The backend CORS configuration already supports the frontend URLs:
- `http://localhost:5173` (development)
- `https://moneyfind.netlify.app` (production)

## 🚀 Deployment

### Frontend Deployment (Netlify/Vercel)

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Upload the `dist` folder
   - Set environment variable: `VITE_API_URL=https://your-backend-domain.com/api`
   - Redirects are already configured in `public/_redirects`

3. **Deploy to Vercel**:
   - Connect your repository
   - Set build command: `npm run build`
   - Set output directory: `dist`
   - Set environment variable: `VITE_API_URL=https://your-backend-domain.com/api`

### Backend Deployment

The backend can be deployed to:
- **Railway**: Configuration already exists in `railway.toml`
- **Render**: Configuration already exists in `render.yaml`
- **Heroku**: Procfile already exists

**Important**: After deploying the backend, update the frontend's `VITE_API_URL` environment variable to point to your deployed backend URL.

### CORS Configuration

If you deploy the frontend to a new domain, update the backend's CORS configuration in `CorsConfig.java`:

```java
config.setAllowedOrigins(List.of(
    "http://localhost:5173",
    "http://localhost:3000", 
    "https://moneyfind.netlify.app",
    "https://your-new-frontend-domain.com"  // Add your new domain here
));
```

## 📁 Repository Structure

```
Frontend Repository:
├── src/
│   ├── components/
│   ├── pages/
│   ├── lib/api.ts          # API client configuration
│   ├── store/
│   └── main.tsx
├── .env                    # Environment variables
├── .env.example           # Example environment file
├── package.json
└── README.md

Backend Repository:
├── src/main/java/
│   └── org/learnspring/expensetracker/
│       ├── Controllers/
│       ├── Model/
│       ├── Service/
│       ├── repo/
│       └── config/CorsConfig.java  # CORS configuration
├── src/main/resources/
│   └── application.properties
└── pom.xml
```

## 🔗 API Integration

The frontend communicates with the backend through:

- **Base URL**: Configured via `VITE_API_URL` environment variable
- **Authentication**: Basic Auth (stored in localStorage)
- **Endpoints**:
  - `GET /api/all` - Get all expenses
  - `POST /api/add` - Create expense
  - `PUT /api/updateExpense` - Update expense
  - `DELETE /api/delete/{id}` - Delete expense
  - `POST /api/register` - User registration

## 🔍 Troubleshooting

### Common Issues

1. **CORS errors**: Make sure the backend includes your frontend domain in CORS configuration
2. **API connection failed**: Verify `VITE_API_URL` points to the correct backend URL
3. **Authentication issues**: Check if backend is running and accepting requests

### Checking Configuration

1. **Frontend API URL**:
   ```bash
   echo $VITE_API_URL
   ```

2. **Backend CORS settings**: Check `CorsConfig.java` for allowed origins

3. **Network connectivity**: Test backend API directly:
   ```bash
   curl http://localhost:8080/api/all
   ```

## 📝 Next Steps

1. **Set up CI/CD**: Configure automated deployment for both repositories
2. **Environment management**: Set up staging environments for both frontend and backend
3. **Monitoring**: Add logging and error tracking for production deployments
4. **Security**: Review and enhance authentication and authorization

## 📞 Support

If you encounter issues:
1. Check this setup guide
2. Verify environment variables
3. Check browser console for frontend errors
4. Check backend logs for API errors
5. Ensure CORS configuration includes your frontend domain
