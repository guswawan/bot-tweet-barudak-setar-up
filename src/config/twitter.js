import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

dotenv.config();

// Create client with elevated access (read + write)
const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Create read-write client
export const twitterClient = client;

// Verify credentials on startup
try {
  const verifyCredentials = async () => {
    const result = await client.v2.me();
    console.log('✅ Twitter credentials verified successfully!');
    return result;
  };

  verifyCredentials().catch((error) => {
    console.error('❌ Twitter credentials verification failed:', error);
  });
} catch (error) {
  console.error('❌ Error initializing Twitter client:', error);
}
