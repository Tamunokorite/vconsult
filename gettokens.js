const { google } = require('googleapis');

// Set up OAuth client
const oAuth2Client = new google.auth.OAuth2({
  clientId: '523404803651-ahf6jvj1fai8i84oqmirospu6g1a3j1j.apps.googleusercontent.com',
  clientSecret: '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',
  redirectUri: 'http://localhost:3000/testgoogle',
});

// Exchange authorization code for tokens
const getToken = async (authorizationCode) => {
  const { tokens } = await oAuth2Client.getToken(authorizationCode);
  const accessToken = tokens.access_token;
  const refreshToken = tokens.refresh_token;
  // Store the access and refresh tokens securely for future use
};

// Call `getToken` with the authorization code received in the redirect URI
const authorizationCode = 'AUTHORIZATION_CODE_FROM_REDIRECT';
getToken(authorizationCode)
  .then(() => {
    // Access token and refresh token are obtained and can be used for API requests
  })
  .catch((error) => {
    console.error('Error exchanging authorization code for tokens:', error);
  });
