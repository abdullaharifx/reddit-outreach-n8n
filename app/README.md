# Reddit Marketing Automation Frontend

A modern React application for managing Reddit marketing automation campaigns. This frontend connects to n8n workflows to provide a user-friendly interface for product management, comment approval, and analytics tracking.

## Features

- **Authentication System**: Secure login with token-based authentication
- **Product Management**: Add, edit, and delete products with comprehensive details
- **Comment Approval Dashboard**: Review AI-generated comments with scoring and filtering
- **Analytics Dashboard**: Track performance metrics and conversions
- **Settings Management**: Configure Reddit API and automation preferences
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend Framework**: React 18 with functional components and hooks
- **Routing**: React Router DOM for client-side navigation
- **Styling**: Tailwind CSS for responsive design
- **State Management**: React Context API + Zustand for complex state
- **HTTP Client**: Axios with interceptors and retry logic
- **UI Components**: Custom components with Lucide React icons
- **Notifications**: React Hot Toast for user feedback
- **Charts**: Recharts for data visualization
- **Date Handling**: date-fns for date utilities

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- n8n instance with configured webhooks

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd reddit-marketing-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your n8n configuration:
   ```env
   REACT_APP_N8N_BASE_URL=https://your-n8n-instance.com/webhook
   REACT_APP_N8N_API_KEY=your-api-key-here
   REACT_APP_NAME=Reddit Marketing Automation
   REACT_APP_VERSION=1.0.0
   ```

4. **Start development server**
   ```bash
   npm start
   ```
   
   The application will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── CommentCard.jsx
│   ├── LoadingSpinner.jsx
│   ├── Navbar.jsx
│   ├── ProductCard.jsx
│   ├── ProductForm.jsx
│   └── ProtectedRoute.jsx
├── context/             # React Context providers
│   └── AuthContext.jsx
├── pages/              # Page components
│   ├── Analytics.jsx
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── Products.jsx
│   └── Settings.jsx
├── services/           # API service layer
│   └── api.js
├── utils/             # Utility functions
│   └── helpers.js
├── App.js             # Main app component
└── index.js          # React entry point
```

## API Integration

The application expects the following n8n webhook endpoints:

### Authentication
- `POST /auth/login` - User authentication

### Products
- `GET /products` - Fetch all products
- `POST /products` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Comments
- `GET /comments/pending` - Fetch pending comments
- `POST /comments/approve` - Approve comment
- `POST /comments/reject` - Reject comment

### Analytics
- `GET /analytics/engagement` - Engagement metrics
- `GET /analytics/traffic` - Traffic metrics
- `GET /analytics/conversions` - Conversion metrics
- `GET /analytics/performance` - Performance breakdown

### Settings
- `GET /settings` - Fetch current settings
- `PUT /settings` - Update settings

## Available Scripts

### `npm start`

Runs the app in development mode at [http://localhost:3000](http://localhost:3000).

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder with optimized performance.

## Deployment

### Netlify (Recommended)

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `build`
   - Add environment variables in Netlify dashboard

The `netlify.toml` and `public/_redirects` files are already configured for optimal deployment.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_N8N_BASE_URL` | Base URL for n8n webhooks | `https://n8n.example.com/webhook` |
| `REACT_APP_N8N_API_KEY` | API key for n8n authentication | `your-secret-api-key` |
| `REACT_APP_NAME` | Application name | `Reddit Marketing Automation` |
| `REACT_APP_VERSION` | Application version | `1.0.0` |

## Features Overview

### Dashboard
- Real-time statistics display
- Pending comments feed with filtering
- Bulk approve/reject functionality
- Comment editing capabilities
- Opportunity scoring visualization

### Product Management
- CRUD operations for products
- Form validation and error handling
- Search and filtering
- Responsive grid layout
- Category organization

### Analytics (Coming Soon)
- Engagement metrics visualization
- Traffic tracking from Reddit
- Conversion analytics
- Performance breakdowns
- CSV export functionality

### Settings (Coming Soon)
- Reddit API configuration
- Automation preferences
- User account management
- Notification settings

## Troubleshooting

### Common Issues

**CORS Errors**
- Ensure your n8n instance has proper CORS headers configured
- Check that the API base URL is correct in your environment variables

**Authentication Issues**
- Verify the API key is correctly set in environment variables
- Check that the authentication endpoint is responding correctly

**Build Errors**
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for any missing dependencies

## License

This project is licensed under the MIT License.

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
