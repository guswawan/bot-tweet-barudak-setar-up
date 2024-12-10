import dotenv from 'dotenv';

dotenv.config();

const TWEET_COMMAND = '!tweet';
const HELP_COMMAND = '!help';

export const handleMessage = async (message, twitterClient) => {
  try {
    const chat = await message.getChat();
    const messageContent = message.body.trim();

    // Handle help command
    if (messageContent === HELP_COMMAND) {
      const helpMessage =
        `*WhatsApp Twitter Bot Commands* 📱\n\n` +
        `*!tweet* your_message\n` +
        `Posts your message to Twitter\n\n` +
        `*Example:*\n` +
        `!tweet Hello Twitter from WhatsApp! 🐦\n\n` +
        `*Note:*\n` +
        `- Tweet must be under 280 characters`;
      await chat.sendMessage(helpMessage);
      return;
    }

    // Check if message starts with the tweet command
    if (!messageContent.startsWith(TWEET_COMMAND)) return;

    // Extract the tweet content (remove the command)
    const tweetContent = messageContent.slice(TWEET_COMMAND.length).trim();

    if (!tweetContent) {
      await chat.sendMessage(
        '⚠️ Tweet content cannot be empty! Type *!help* for usage instructions.'
      );
      return;
    }

    if (tweetContent.length > 280) {
      await chat.sendMessage(
        `⚠️ Tweet is too long (${tweetContent.length}/280 characters). Please shorten your message.`
      );
      return;
    }

    try {
      // Post the tweet using v2 endpoint
      const tweet = await twitterClient.v2.tweet(tweetContent);
      const tweetUrl = `https://twitter.com/user/status/${tweet.data.id}`;
      await chat.sendMessage(
        `✅ Tweet posted successfully!\n\nView your tweet: ${tweetUrl}`
      );
    } catch (tweetError) {
      console.error('Twitter API Error:', tweetError);
      if (tweetError.code === 403) {
        await chat.sendMessage(
          '❌ Twitter authentication failed. Please check your API credentials and permissions.'
        );
      } else {
        await chat.sendMessage(
          '❌ Failed to post tweet. Please try again later.'
        );
      }
    }
  } catch (error) {
    console.error('Error handling message:', error);
    await chat.sendMessage(
      '❌ An error occurred. Please try again later.\n\nType *!help* for usage instructions.'
    );
  }
};
