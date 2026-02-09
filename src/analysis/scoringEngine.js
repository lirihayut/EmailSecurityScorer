export const evaluateEmailRisk = (data, blacklist) => {
  if (blacklist.includes(data.sender)) {
    return {
      score: 100,
      verdict: 'MALICIOUS',
      reasons: ['Sender is explicitly blocked by user policy']
    };
  }

  let score = 0;
  const reasons = [];

  if (data.externalResults?.some(r => r.malicious > 0)) {
    score += 70;
    reasons.push('VirusTotal Alert: URLs flagged by security engines');
  }

  if (data.links?.length) {
    const patterns = ['bit.ly', 'secure-login', 'verify', 'update-account', 'malware', 'download'];
    const matches = data.links.filter(l =>
      patterns.some(p => l.toLowerCase().includes(p))
    );

    if (matches.length) {
      score += 55;
      reasons.push(`Suspicious URL patterns detected: ${matches.length} links`);
    }
  }

  const urgency = ['urgent', 'suspended', 'immediately', 'action required', 'unauthorized'];
  const hits = urgency.filter(w =>
    new RegExp(`\\b${w}\\b`, 'i').test(data.body)
  );

  if (hits.length) {
    score += 35;
    reasons.push(`Psychological pressure detected (${hits.join(', ')})`);
  }

  if (data.headers?.['x-spf'] === 'fail') {
    score += 40;
    reasons.push('SPF authentication failed');
  }

  const finalScore = Math.min(score, 100);
  const verdict =
    finalScore >= 75 ? 'MALICIOUS' :
    finalScore >= 40 ? 'SUSPICIOUS' :
    'SAFE';

  return {
    score: finalScore,
    verdict,
    reasons: reasons.length ? reasons : ['No suspicious signals identified']
  };
};
