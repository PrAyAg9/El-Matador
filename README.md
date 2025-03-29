# FinAI Assistant - AI-Powered Financial Assistant

FinAI Assistant is a modern web application that combines the power of AI with financial expertise to provide users with personalized financial guidance and insights.

## Features

- **AI-Powered Financial Assistant**: Get personalized financial advice, insights, and recommendations through natural language interactions
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
  - Google Gemini API for AI capabilities
  - IDX Platform API for financial data

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Firebase account
- Google Gemini API key
- (Optional) IDX platform API key

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
   Create a `.env.local` file in the root directory with the following variables:
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

   # IDX Platform API Key (Optional)
   NEXT_PUBLIC_IDX_API_KEY=your_idx_api_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

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
   # or
   yarn build
   ```

5. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

## Project Structure

```
financial-assistant/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # Reusable UI components
│   ├── context/        # React context providers
│   ├── lib/            # Utility functions and API clients
│   │   ├── firebase/   # Firebase related functions
│   │   ├── gemini/     # Google Gemini API client
│   │   └── idx/        # IDX platform API client
│   ├── hooks/          # Custom React hooks
│   └── types/          # TypeScript type definitions
├── .env.local          # Environment variables (git-ignored)
├── tailwind.config.js  # Tailwind CSS configuration
└── package.json        # Project dependencies
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Firebase](https://firebase.google.com/) for backend services
- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [Next.js](https://nextjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling

## Running the Development Server

### Option 1: Standard Start

```bash
npm run dev
# or
yarn dev
```

### Option 2: With Firebase Emulators (PowerShell)

Since PowerShell doesn't support the `&&` operator for command chaining, use one of these methods:

**Method 1: Using separate terminal windows**
1. Start Firebase emulators in one terminal:
   ```powershell
   firebase emulators:start
   ```
   
2. Start Next.js in another terminal:
   ```powershell
   npm run dev
   ```

**Method 2: Using PowerShell's semicolon operator**
```powershell
firebase emulators:start; npm run dev
```

**Method 3: Using the Start-Process cmdlet**
```powershell
Start-Process powershell -ArgumentList "firebase emulators:start" -NoNewWindow; npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

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

### Using Test User Mode

If you want to test the application without setting up Firebase or Gemini API:

1. Navigate to `/auth/simple-login` or `/login`
2. Click on the **Test User** login option
3. This will bypass authentication and use mock AI responses

## Using the PowerShell Script

Since PowerShell doesn't support the `&&` operator for running multiple commands, we've created a helper script:

```powershell
# Run this in PowerShell
./run-dev.ps1
```

This script will:
1. Start Firebase emulators in a background window
2. Run the Next.js development server
3. Provide helpful information about available endpoints
