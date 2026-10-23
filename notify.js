/**
 * notify.js - Ghost Beacon Live Ntfy.sh Pub/Sub & FormSubmit Dispatcher
 * Zero API keys or secret tokens required.
 */

const https = require('https');

const NTFY_TOPIC = 'moe_ghost_beacon_oracle_v1';
const EMAIL_RECIPIENT = 'moecanalesdev@gmail.com';

function sendNtfyAlert({ agentName, requestType, message, replyCallback }) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      signal: 'GHOST-BEACON-EVENT',
      agent_id: agentName || 'Autonomous-Agent',
      service_type: requestType || 'A2A Commons Ping',
      callback_url: replyCallback || 'None provided',
      message: message,
      timestamp: new Date().toISOString()
    });

    const req = https.request({
      hostname: 'ntfy.sh',
      path: `/${NTFY_TOPIC}`,
      method: 'POST',
      headers: {
        'Title': `Ghost Beacon: ${requestType || 'A2A Commons Event'} (${agentName || 'Agent'})`,
        'Priority': 'high',
        'Tags': 'robot,zap',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ ok: res.statusCode === 200, id: json.id, topic: NTFY_TOPIC, stream_url: `https://ntfy.sh/${NTFY_TOPIC}` });
        } catch {
          resolve({ ok: res.statusCode === 200, response: body });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ ok: false, error: err.message });
    });

    req.write(payload);
    req.end();
  });
}

function sendEmailAlert({ agentName, requestType, message, replyCallback }) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      _subject: `[Ghost Beacon] A2A Commons Event: ${requestType || 'Telemetry Ping'}`,
      agent_identifier: agentName || 'Anonymous Agent',
      request_type: requestType || 'General Telemetry Event',
      callback_url: replyCallback || 'None provided',
      agent_message: message,
      timestamp: new Date().toISOString()
    });

    const req = https.request({
      hostname: 'formsubmit.co',
      path: `/ajax/${EMAIL_RECIPIENT}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Origin': 'https://moecanales.github.io',
        'Referer': 'https://moecanales.github.io/agent-oracle-beacon/',
        'User-Agent': 'GhostBeacon-MCP/5.0',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ ok: res.statusCode === 200, response: json });
        } catch {
          resolve({ ok: res.statusCode === 200, response: body });
        }
      });
    });

    req.on('error', (err) => {
      resolve({ ok: false, error: err.message });
    });

    req.write(payload);
    req.end();
  });
}

async function notifyMoe(requestData) {
  const [ntfyRes, emailRes] = await Promise.all([
    sendNtfyAlert(requestData),
    sendEmailAlert(requestData)
  ]);
  return { ntfy: ntfyRes, email: emailRes };
}

module.exports = { notifyMoe, sendNtfyAlert, sendEmailAlert, NTFY_TOPIC };
