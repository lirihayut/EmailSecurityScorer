# Email Security Scorer – Backend

## Overview

Backend service for evaluating the risk of emails.
Provides a REST API to scan emails for malicious content, suspicious links, phishing patterns, and authentication issues. Includes a simple user-managed blacklist.

---
## Features

* **Email Risk Scoring**: Computes a risk score (0–100) and verdict (`SAFE`, `SUSPICIOUS`, `MALICIOUS`) based on multiple signals.
* **External URL Reputation**: Checks URLs in emails against VirusTotal.
* **Phishing & Urgency Detection**: Detects suspicious URL patterns and psychological pressure cues.
* **Authentication Checks**: Identifies SPF failures to detect spoofing.
* **User-Managed Blacklist**: Users can add/remove email addresses to force a `MALICIOUS` verdict.
* **Stateless & Simple Architecture**: Easy to understand and extend.

---
## Architecture

```
src/
├── analysis/
│   ├── scoringEngine.js      # Risk scoring logic
│   └── reputationService.js  # VirusTotal API integration
├── controllers/
│   └── emailController.js    # API handlers
├── routes/
│   └── emailRoutes.js        # Express routes
└── server.js                 # Entry point
```

* **Scoring Engine**: Computes score and verdict based on email content, headers, links, and external intelligence.
* **Reputation Service**: Fetches URL reputation from VirusTotal API.
* **Controller**: Handles API requests and updates blacklist.
* **Routes**: Maps HTTP endpoints to controllers.
* **Server**: Express app running on port 3000.

---
## API Endpoints

### POST `/api/v1/scan`

Scan an email.

**Request Body:**

```json
{
  "sender": "user@example.com",
  "body": "Email content here",
  "links": ["http://bit.ly/test"],
  "headers": { "x-spf": "fail" }
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "score": 95,
    "verdict": "MALICIOUS",
    "reasons": [
      "SPF authentication failed",
      "Suspicious URL patterns detected: 1 links",
      "Psychological pressure detected (urgent)"
    ]
  }
}
```

---

### POST `/api/v1/settings/blacklist`

Add an email to the blacklist.

**Request Body:**

```json
{ "email": "malicious@attacker.com" }
```

**Response:**

```json
{ "status": "ok" }
```

---

### DELETE `/api/v1/settings/blacklist/:email`

Remove an email from the blacklist.

**Response:**

```json
{ "status": "ok" }
```

---

## Environment Variables

* `VT_API_KEY` – VirusTotal API key (required for URL reputation checks)

---

## Installation

```bash
git clone <repo-url>
cd GmailAddOn
npm install
```

---

## Running

```bash
npm start
```

* Server runs on **port 3000** by default.
* Use REST client (Postman / curl) to test endpoints.

---

## Limitations

* No persistent storage; blacklist resets on server restart.
* VirusTotal integration depends on API quota.
* No authentication for endpoints (for demo purposes only).
