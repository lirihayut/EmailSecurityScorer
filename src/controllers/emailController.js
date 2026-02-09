import { evaluateEmailRisk } from '../analysis/scoringEngine.js';
import { getUrlReputation } from '../analysis/virusTotalService.js';

let blacklist = ['malicious@attacker.com'];

export const analyzeEmail = async (req, res) => {
  try {
    const { sender, body, links, headers } = req.body;

    const externalResults = links?.length
      ? await Promise.all(links.map(getUrlReputation))
      : [];

    const analysis = evaluateEmailRisk(
      { sender, body, links, headers, externalResults },
      blacklist
    );

    res.json({ status: 'success', data: analysis });
  } catch {
    res.status(500).json({ status: 'error' });
  }
};

export const addToBlacklist = (req, res) => {
  const { email } = req.body;
  if (email && !blacklist.includes(email)) {
    blacklist.push(email);
  }
  res.status(201).json({ status: 'ok' });
};

export const removeFromBlacklist = (req, res) => {
  blacklist = blacklist.filter(e => e !== req.params.email);
  res.json({ status: 'ok' });
};
