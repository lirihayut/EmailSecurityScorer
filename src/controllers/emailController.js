import { evaluateEmailRisk } from '../analysis/scoringEngine.js';
import { getUrlReputation } from '../analysis/virusTotalService.js';

// Using Set for O(1) lookup performance
const blacklist = new Set(['malicious@attacker.com']);

export const analyzeEmail = async (req, res) => {
  try {
    const { sender, body, links, headers } = req.body;

    // Parallel execution for all links
    const externalResults = links?.length
      ? await Promise.all(links.map(getUrlReputation))
      : [];

    const analysis = evaluateEmailRisk(
      { sender, body, links, headers, externalResults },
      blacklist 
    );

    res.json({ 
      status: 'success', 
      data: analysis,
      meta: {
        scanned_links: externalResults.length
      }
    });
  } catch (error) {
    console.error('Analysis failed:', error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

export const addToBlacklist = (req, res) => {
  const { email } = req.body;
  
  if (email) {
    blacklist.add(email); 
  }
  
  res.status(201).json({ 
    status: 'success', 
    message: 'Added to blacklist', 
    current_list: [...blacklist] 
  });
};

export const removeFromBlacklist = (req, res) => {
  const emailToRemove = req.params.email;
  
  // Set.delete returns true if item existed, false otherwise
  const existed = blacklist.delete(emailToRemove); 
  
  res.json({ 
    status: 'success', 
    message: existed ? 'Removed from blacklist' : 'Email not found in blacklist',
    current_list: [...blacklist]
  });
};

export const getBlacklist = (req, res) => {
    res.json([...blacklist]);
};
