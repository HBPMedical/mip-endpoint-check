const axios = require("axios").default
require('dotenv').config()
import fs from 'fs';

const endpoint = process.env.CHECK_ENDPOINT || 'https://hbpmip.link/services/status'
const interval = +(process.env.INTERVAL || 60)
const logFilePath = process.env.LOGS_FILE_PATH || '/logs/mip-endpoint.txt'

async function pollEndpoint(endpoint: string, interval: number, logFilePath: string): Promise<void> {
  while (true) {
    try {
      const response = await axios.request(endpoint);
      const timestamp = new Date().toISOString();
      const logMessage = `${timestamp} - Response from ${endpoint}: ${response.data}\n`;
      fs.appendFileSync(logFilePath, logMessage);
    } catch (err: any) {
      const timestamp = new Date().toISOString();
      const logMessage = `${timestamp} - Error from ${endpoint}: ${err}\n`;
      fs.appendFileSync(logFilePath, logMessage);
      console.error(logMessage);
    }
    await new Promise(resolve => setTimeout(resolve, interval * 1000));
  }
}

pollEndpoint(endpoint, interval, logFilePath).catch(console.error);




