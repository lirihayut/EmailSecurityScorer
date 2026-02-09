import axios from 'axios';

const VT_API_KEY = '5e488506eda34bb579f20aed85daa299d4f4f764a40ed1e06b15e80d4fdf42ff';

export const getUrlReputation = async url => {
  try {
    const id = Buffer.from(url).toString('base64').replace(/=/g, '');
    const res = await axios.get(`https://www.virustotal.com/api/v3/urls/${id}`, {
      headers: { 'x-apikey': VT_API_KEY }
    });

    const { malicious, suspicious } = res.data.data.attributes.last_analysis_stats;
    return { malicious, suspicious };
  } catch {
    return { malicious: 0, suspicious: 0 };
  }
};
