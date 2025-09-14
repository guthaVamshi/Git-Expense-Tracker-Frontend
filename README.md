# Expense Tracker Frontend

A modern React + TypeScript frontend for the Expense Tracker application.

## Features

- 📊 **Dashboard**: View and manage your expenses with beautiful charts and analytics
- 💰 **Expense Management**: Add, edit, and delete expenses with categorization
- 🔐 **Authentication**: Secure login system
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🎨 **Modern UI**: Built with Tailwind CSS for a clean, modern interface

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Axios** for API communication
- **ESLint** for code quality

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running (see backend repository)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-frontend-repo-url>
   cd expense-tracker-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your backend API URL:
   ```
   VITE_API_URL=http://localhost:8080/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `/api` |

## Backend Integration

This frontend requires the Expense Tracker backend to be running. Make sure to:

1. Start the backend server (typically on port 8080)
2. Update the `VITE_API_URL` in your `.env` file to point to your backend
3. Ensure CORS is properly configured in the backend for your frontend domain

## Deployment

### Netlify (Recommended)

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard
4. Configure redirects for SPA routing (already included in `public/_redirects`)

### Vercel

1. Connect your repository to Vercel
2. Set the build command to `npm run build`
3. Set the output directory to `dist`
4. Configure environment variables

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
│   ├── DashboardPage.tsx
│   └── LoginPage.tsx
├── lib/                # Utilities and API client
│   └── api.ts
├── store/              # State management
│   └── auth.ts
├── assets/             # Static assets
└── main.tsx           # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run linting: `npm run lint`
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## License

This project is licensed under the MIT License.