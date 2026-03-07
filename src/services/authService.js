/**
 * Auth Service
 * Manages the KBZPay OAuth2 access token lifecycle.
 * Fetches a new token only when the current one is expired or missing.
 * The token is valid for 3600 seconds (1 hour).
 */

const AUTH_URL = '/baas/auth/v1.0/oauth2/token';
const CLIENT_ID = 'c7d8640f6a20cce91bb1f670a41c8ffb';
const CLIENT_SECRET = 'b83dc4306aa20f8c349ce07ec3e7520e6b55723e5a52eeab';

// In-memory token cache (resets on page refresh, which is fine)
let cachedToken = null;
let tokenExpiresAt = null;

/**
 * Returns a valid access token.
 * Fetches a new one from the auth server only if no token exists or if it has expired.
 * @returns {Promise<string>} A valid access token
 */
export const getAccessToken = async () => {
    const now = Date.now();

    // Return cached token if it's still valid (with a 60s buffer before actual expiry)
    if (cachedToken && tokenExpiresAt && now < tokenExpiresAt - 60_000) {
        return cachedToken;
    }

    // Fetch a new token
    const response = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            grant_type: 'client_credentials',
        }),
    });

    if (!response.ok) {
        throw new Error('Authentication failed: Could not retrieve access token.');
    }

    const data = await response.json();
    const token = data.access_token;
    const expiresIn = data.expires_in || 3600; // default to 3600s if not provided

    if (!token) {
        throw new Error('Authentication failed: Missing access token in response.');
    }

    // Cache the token and calculate its expiry time
    cachedToken = token;
    tokenExpiresAt = now + expiresIn * 1000;

    console.log(`[AuthService] New token acquired. Expires in ${expiresIn}s.`);

    return cachedToken;
};
