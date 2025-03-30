# El Matador Financial Assistant

An AI-powered financial assistant that combines cutting-edge artificial intelligence with financial expertise to provide personalized financial guidance.

![El Matador Financial Assistant](./public/elmatador.png)

## Quick Start

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Firebase account
- Google Gemini API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/financial-assistant.git
   cd financial-assistant
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:
   Create a `.env.local` file in the root directory with:
   ```
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

   # Google Gemini API Key
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## El Matador: The Future of Financial AI

El Matador represents the next generation of AI-powered financial assistance, delivering advanced capabilities beyond traditional financial tools.

### Revolutionary Features

- **Fully Automated Financial Agent**: The upcoming El Matador Autopilot feature will revolutionize personal finance by autonomously managing investments, optimizing expenses, and making smart financial decisions in real-time.

- **Advanced AI Financial Analysis**: Utilizes state-of-the-art AI models to analyze market trends, economic indicators, and your personal financial data to deliver insights human advisors might miss.

- **Premium Visualization & Reporting**: Converts complex financial data into intuitive visualizations and actionable insights through beautifully formatted Markdown-rich reports.

- **Personalized Investment Strategies**: Tailors investment recommendations to your specific financial situation, risk tolerance, and long-term goals using advanced machine learning algorithms.

- **Wealth Growth Automation**: Continuously monitors your financial ecosystem to optimize wealth growth through tax-efficient strategies, automated portfolio rebalancing, and smart debt management.

### El Matador Premium Services

![El Matador Premium Services](./public/elmatador-services.png)

Our platform offers specialized financial services, each powered by the El Matador AI:

| Service | Description |
|---------|-------------|
| Budget Creation & Management | Automated budget creation based on income, expenses, and goals with intelligent categorization |
| Credit Score Improvement | Strategic recommendations to boost credit scores through personalized debt management plans |
| Retirement Planning | Sophisticated modeling for retirement goals with tax-optimized contribution strategies |
| Investment Opportunities | AI-curated investment opportunities tailored to your risk profile and financial objectives |
| Tax Planning & Optimization | Proactive tax planning with strategies to minimize liabilities and maximize returns |
| Stock & Mutual Fund Analysis | In-depth analysis of potential investments using proprietary valuation models |
| Estate Planning & Asset Protection | Comprehensive guidance for wealth preservation and transfer strategies |
| Banking & Financial Services | Optimized recommendations for banking products and services based on your needs |

## Application Routes

The application is structured with the following key routes:

- **/** - Homepage with introduction to El Matador
- **/login** - Authentication page with Google and email/password sign-in
- **/dashboard** - Main user dashboard with financial overview
  - **/dashboard/elmatador** - El Matador AI dashboard with premium features
  - **/dashboard/investments** - Investment portfolio tracking and El Matador investment opportunities
  - **/dashboard/profile** - User profile management and financial preferences
- **/assistant** - AI financial assistant interface for natural language interactions

## Main Features

- **AI-Powered Financial Assistant**: Get personalized financial advice, insights, and recommendations through natural language interactions
- **El Matador Premium Services**: Access specialized financial analysis tools with enhanced visualizations and detailed recommendations
- **Markdown-Powered Responses**: View beautifully formatted financial advice with charts, tables, and rich formatting
- **User Authentication**: Secure user registration and login using Firebase Authentication
- **Personalized Dashboard**: View financial insights tailored to your profile and preferences
- **Investment Tracking**: Monitor your investments and portfolio performance
- **Real-time Data**: Access up-to-date financial information and market trends
- **Responsive Design**: Enjoy a seamless experience across desktop and mobile devices

## Tech Stack

- **Frontend**:
  - Next.js with TypeScript
  - Tailwind CSS for styling
  - React Query for data fetching
  - Zustand for state management

- **Backend & Services**:
  - Firebase (Authentication, Firestore, Cloud Functions)
  - Google Gemini AI for sophisticated financial analysis
  - Markdown rendering for rich text responses

## Deployment

The application can be deployed on Firebase Hosting:

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase:
   ```bash
   firebase init
   ```
   Select Hosting, Firestore, and Functions options.

4. Build the application:
   ```bash
   npm run build
   ```

5. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## Project Structure

```
financial-assistant/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js app router pages
│   │   ├── dashboard/       # Dashboard routes
│   │   ├── assistant/       # AI assistant route
│   │   └── login/           # Authentication pages
│   ├── components/          # Reusable UI components
│   │   ├── auth/            # Authentication components
│   │   ├── dashboard/       # Dashboard components
│   │   └── layout/          # Layout components
│   ├── lib/                 # Utility functions and API clients
│   │   ├── firebase/        # Firebase related functions
│   │   └── gemini/          # Google Gemini API client
│   └── types/               # TypeScript type definitions
├── functions/               # Firebase cloud functions
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Project dependencies
```

## Google Authentication & Gemini AI Setup

### Setting up Google Authentication

1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Select your project or create a new one.
3. Navigate to **Authentication** > **Sign-in method**.
4. Enable **Google** as a sign-in provider.
5. Add your domain (including localhost for testing) to the authorized domains list.

### Setting up Google Gemini API

1. Go to the [Google AI Studio](https://makersuite.google.com/app/apikey).
2. Create an API key if you don't have one already.
3. Add the API key to your `.env.local` file:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Firebase](https://firebase.google.com/) for backend services
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [Next.js](https://nextjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
