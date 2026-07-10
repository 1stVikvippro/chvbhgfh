export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' })
    }

    // Get API key from request or use environment variable
    const apiKey = req.headers.authorization?.replace('Bearer ', '') || process.env.HYPERBEAM_API_KEY

    if (!apiKey) {
        return res.status(400).json({ error: 'API key is required' })
    }

    try {
        const response = await fetch('https://engine.hyperbeam.com/v0/vm', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })

        const data = await response.json()

        if (!response.ok) {
            return res.status(response.status).json(data)
        }

        return res.status(200).json(data)
    } catch (error) {
        console.error('Error creating VM:', error)
        return res.status(500).json({ error: 'Failed to create virtual computer' })
    }
}
