export const evaluateEmailRisk = (data, blacklist) => {
  // 1. Critical: Blacklist Check
  if (blacklist.has(data.sender)) {
    return {
      score: 100,
      verdict: 'MALICIOUS',
      reasons: ['Sender is explicitly blocked by user policy']
    };
  }

  let score = 0;
  const reasons = [];

  // 2. External Intelligence (VirusTotal)
  if (data.externalResults && data.externalResults.some(r => r.malicious > 0)) {
    score += 70;
    reasons.push('VirusTotal Alert: URLs flagged by security engines');
  }

  // 3. Suspicious Links Patterns
  if (data.links && data.links.length) {
    const patterns = ['bit.ly', 'secure-login', 'verify', 'update-account', 'malware', 'download', '.exe', '.zip'];
    const matches = data.links.filter(l =>
      patterns.some(p => l.toLowerCase().includes(p))
    );

    if (matches.length) {
      score += 25; // Adjusted slightly
      reasons.push(`Suspicious URL patterns detected (${matches.length} links)`);
    }
  }

  // 4. Psychological Triggers (Urgency)
  const urgency = ['urgent', 'suspended', 'immediately', 'action required', 'unauthorized', 'verify your identity'];
  const hits = urgency.filter(w =>
    new RegExp(`\\b${w}\\b`, 'i').test(data.body)
  );

  if (hits.length) {
    score += 35;
    reasons.push(`Psychological pressure detected: "${hits.join(', ')}"`);
  }

  // 5. Technical Headers (SPF)
  if (data.headers && data.headers['x-spf'] === 'fail') {
    score += 40;
    reasons.push('SPF authentication failed (Sender identity not verified)');
  }

  // Final Calculation
  const finalScore = Math.min(score, 100);
  
  let verdict = 'SAFE';
  if (finalScore >= 75) verdict = 'MALICIOUS';
  else if (finalScore >= 40) verdict = 'SUSPICIOUS';

  return {
    score: finalScore,
    verdict,
    reasons: reasons.length ? reasons : ['No suspicious signals identified - Email looks clean']
  };
};
