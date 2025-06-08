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

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ error: 'Missing user ID. Use ?id=USERID in the URL.' });
        }

        const avatarUrl = await fetchDiscordStatus(id);
        res.redirect(avatarUrl);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch Discord avatar' });
    }
}
