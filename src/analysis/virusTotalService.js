import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const VT_API_KEY = process.env.VT_API_KEY;

export const getUrlReputation = async (url) => {
  try {
    // VirusTotal API v3 requires base64 encoding without padding
    const id = Buffer.from(url).toString('base64').replace(/=/g, '');
    
    const res = await axios.get(`https://www.virustotal.com/api/v3/urls/${id}`, {
      headers: { 'x-apikey': VT_API_KEY },
      timeout: 5000 // 5 seconds timeout to avoid hanging
    });

    const { malicious, suspicious } = res.data.data.attributes.last_analysis_stats;
    return { url, malicious, suspicious };
  } catch (error) {
    // Fail open: If API fails (rate limit/network), assume safe to avoid blocking legitimate work
    console.error(`Error scanning URL ${url}:`, error.message);
    return { url, malicious: 0, suspicious: 0, error: true };
  }
};
