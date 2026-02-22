import 'dotenv/config';
import express from 'express';
import cors from 'cors';

// Debug: Log env vars right after dotenv import
console.log('[Server Init] ELEVENLABS_API_KEY:', process.env.ELEVENLABS_API_KEY ? 'Loaded' : 'NOT LOADED');
console.log('[Server Init] ELEVENLABS_AGENT_ID:', process.env.ELEVENLABS_AGENT_ID || 'Using default');

const app = express();

app.use(cors());
app.use(express.json());

const ELEVENLABS_AGENT_ID = process.env.ELEVENLABS_AGENT_ID || 'agent_2601kj1apm99fbm983n8krtj6zp8';

// // This "catches" the login/me requests that were failing
// app.get('/api/apps/:id/entities/User/me', (req, res) => {
//     res.json({ id: 1, name: "Dr. Howard" });
// });

// // This is where your ChatGPT logic will eventually go
// app.post('/api/analyze-transcript', (req, res) => {
//     res.json({ analysis: "Server is alive! ChatGPT logic goes here next." });
// });

app.get('/api/elevenlabs/token', async (req, res) => {
	try {
		const apiKey = process.env.ELEVENLABS_API_KEY;
		console.log('[Token Endpoint] Request received');
		console.log('[Token Endpoint] API Key loaded:', !!apiKey ? 'Yes (length: ' + apiKey.length + ')' : 'No');

		if (!apiKey) {
			console.error('[Token Endpoint] ERROR: Missing ELEVENLABS_API_KEY');
			return res.status(500).json({
				error: 'Missing ELEVENLABS_API_KEY on server',
			});
		}

		const agentId = req.query.agentId || ELEVENLABS_AGENT_ID;
		console.log('[Token Endpoint] Agent ID:', agentId);

		const response = await fetch(
			`https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${agentId}`,
			{
				method: 'GET',
				headers: {
					'xi-api-key': apiKey,
				},
			}
		);

		console.log('[Token Endpoint] ElevenLabs Response Status:', response.status);

		if (!response.ok) {
			const body = await response.text();
			console.error('[Token Endpoint] ERROR: ElevenLabs API Error');
			console.error('[Token Endpoint] Status:', response.status);
			console.error('[Token Endpoint] Response:', body);
			return res.status(response.status).json({
				error: 'Failed to fetch ElevenLabs conversation token',
				details: body,
			});
		}

		const data = await response.json();
		console.log('[Token Endpoint] SUCCESS: Token created');
		return res.json(data);
	} catch (error) {
		console.error('[Token Endpoint] CATCH ERROR:', error?.message);
		return res.status(500).json({
			error: 'Unexpected error while creating ElevenLabs token',
			details: error?.message || 'Unknown error',
		});
	}
});

app.listen(3000, () => console.log('Mock Medical Backend running on port 3000'));