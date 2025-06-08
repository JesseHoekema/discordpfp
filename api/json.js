const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const fetchDiscordStatus = async (userId) => {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return `https://cdn.discordapp.com/avatars/${data.data.discord_user.id}/${data.data.discord_user.avatar}?size=2048`;
    } catch (error) {
        console.error('Error fetching Discord status:', error);
        throw error;
    }
};

// API route that returns JSON
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ error: 'Missing user ID. Use ?id=USERID in the URL.' });
        }

        const avatarUrl = await fetchDiscordStatus(id);
        res.json({ 
            success: true,
            avatar_url: avatarUrl
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch Discord avatar'
        });
    }
}
