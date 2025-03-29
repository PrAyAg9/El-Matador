const { execSync } = require('child_process');

console.log('Initializing Firebase project...');

try {
  // Install Firebase CLI if not already installed
  console.log('Checking Firebase CLI installation...');
  try {
    execSync('firebase --version', { stdio: 'ignore' });
    console.log('Firebase CLI is already installed.');
  } catch (error) {
    console.log('Installing Firebase CLI...');
    execSync('npm install -g firebase-tools', { stdio: 'inherit' });
  }

  // Login to Firebase
  console.log('Logging in to Firebase...');
  execSync('firebase login', { stdio: 'inherit' });

  // Initialize Firebase project
  console.log('Initializing Firebase project...');
  execSync('firebase init', { stdio: 'inherit' });

  console.log('Firebase project initialized successfully!');
} catch (error) {
  console.error('Error initializing Firebase project:', error.message);
  process.exit(1);
} 