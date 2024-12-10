import { initializeWhatsApp } from './config/whatsapp.js';
import { twitterClient } from './config/twitter.js';
import { handleMessage } from './services/messageHandler.js';
import dotenv from 'dotenv';

dotenv.config();

const startBot = async () => {
  try {
    // Initialize WhatsApp client
    const whatsappClient = await initializeWhatsApp();

    // Handle incoming messages
    whatsappClient.on('message_create', async (message) => {
      await handleMessage(message, twitterClient);
    });

    // Handle connection events
    whatsappClient.on('ready', () => {
      console.log('🤖 Bot is ready to receive messages from WhatsApp mobile!');
      console.log('📱 You can now use the bot from your WhatsApp mobile app');
      console.log('💡 Send !help in the group to see available commands');
    });

    // Initialize WhatsApp connection
    await whatsappClient.initialize();
  } catch (error) {
    console.error('Error starting the bot:', error);
    process.exit(1);
  }
};

startBot();
