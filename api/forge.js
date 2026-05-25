export default async function handler(req, res) {
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

    res.status(200).json({
      content: data.choices?.[0]?.message?.content
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}