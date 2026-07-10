// api/create-vm.js
export default async function handler(req, res) {
  // Enable CORS for the response (optional but helpful)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get API key from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No API key provided in Authorization header' });
    }

    const apiKey = authHeader.replace('Bearer ', '');
    
    // Validate API key isn't empty or placeholder
    if (!apiKey || apiKey === 'YOUR_REAL_API_KEY_HERE') {
      return res.status(400).json({ error: 'Invalid API key provided' });
    }

    // Create the VM using Hyperbeam's API
    const response = await fetch('https://engine.hyperbeam.com/v0/vm', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Hyperbeam API error:', data);
      return res.status(response.status).json({ 
        error: 'Hyperbeam API error', 
        details: data 
      });
    }

    // Return the embed URL
    return res.status(200).json({ 
      embed_url: data.embed_url,
      session_id: data.session_id 
    });
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
