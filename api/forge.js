export default async function handler(req, res) {
  // ── CORS HEADERS ──
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ── HANDLE PRE-FLIGHT REQUEST ──
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ── ONLY ALLOW POST ──
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { systemPrompt, userMessage } = req.body;

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          max_tokens: 2000,
          temperature: 0.7,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userMessage }
          ]
        })
      }
    );

    const data = await response.json();

    return res.status(200).json({
      content: data.choices?.[0]?.message?.content
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}