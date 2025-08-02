# Troubleshooting Guide for Judge0 API Integration

## Issue: API Key Not Working

If you're experiencing issues with the Judge0 API key, follow these steps to diagnose and fix the problem:

### 1. Check Environment Variable Setup

1. Navigate to the `.env` file in the `editor` directory
2. Verify that the file contains the following line:
   ```
   REACT_APP_JUDGE0_API_KEY=your_actual_api_key_here
   ```
3. Make sure you've replaced `your_actual_api_key_here` with your actual API key from RapidAPI

### 2. Verify API Key on RapidAPI

1. Go to https://rapidapi.com/judge0-official/api/judge0-ce
2. Log in to your RapidAPI account
3. Ensure you've subscribed to the Judge0 CE API
4. Copy your API key from the dashboard

### 3. Test Environment Variables

1. Visit `/env-test` in your application to check if the environment variable is loaded correctly
2. Check the browser console for any error messages

### 4. Restart Development Server

After making changes to the `.env` file:
1. Stop the development server (Ctrl+C)
2. Start the development server again (`npm start` or `yarn start`)

### 5. Check Browser Console

Open the browser's developer tools (F12) and check the console for:
- Error messages related to the API key
- Network requests to the Judge0 API
- Any CORS-related issues

### 6. Common Issues

1. **API Key Not Updated**: Make sure you've replaced `YOUR_RAPIDAPI_KEY` with your actual API key
2. **Environment Variable Name**: Ensure the variable name is exactly `REACT_APP_JUDGE0_API_KEY`
3. **Server Not Restarted**: Environment variables are only loaded when the server starts
4. **Subscription Issues**: Verify you've subscribed to the Judge0 CE API on RapidAPI

### 7. Manual Testing

If you want to test the API directly, you can temporarily replace the environment variable with your actual API key in the `PlaygroundScreen/index.js` file:

```javascript
// Temporarily replace this:
"X-RapidAPI-Key": process.env.REACT_APP_JUDGE0_API_KEY,

// With this (replace with your actual API key):
"X-RapidAPI-Key": "your_actual_api_key_here",
```

Remember to revert this change and use environment variables for security.
