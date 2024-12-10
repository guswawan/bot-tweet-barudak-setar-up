import { Client } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import puppeteer from 'puppeteer';

export const initializeWhatsApp = async () => {
  // Launch browser instance first
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const client = new Client({
    puppeteer: {
      browser: browser,
    },
    // Remove LocalAuth since it's causing issues
    authStrategy: null,
  });

  let isFirstQR = true;

  client.on('qr', (qr) => {
    if (isFirstQR) {
      qrcode.generate(qr, { small: true });
      console.log('Scan the QR code above to login to WhatsApp Web');
      isFirstQR = false;
    }
  });

  client.on('ready', () => {
    console.log('WhatsApp client is ready!');
  });

  client.on('authenticated', () => {
    console.log('WhatsApp client is authenticated!');
  });

  client.on('auth_failure', (msg) => {
    console.error('WhatsApp authentication failed:', msg);
  });

  return client;
};
