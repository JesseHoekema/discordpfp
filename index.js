const express = require('express');
const app = express();
const port = 3000;

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

app.get('/avatar', async (req, res) => {
    try {
        const userId = req.query.id;
        if (!userId) {
            return res.status(400).json({ error: 'Missing user ID. Use ?id=USERID in the URL.' });
        }

        const avatarUrl = await fetchDiscordStatus(userId);
        res.redirect(avatarUrl);
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch Discord avatar'
        });
    }
});
app.get('/api/avatar', async (req, res) => {
    try {
        const userId = req.query.id;
        if (!userId) {
            return res.status(400).json({ error: 'Missing user ID. Use ?id=USERID in the URL.' });
        }

        const avatarUrl = await fetchDiscordStatus(userId);
        res.json({ 
            success: true,
            avatar_url: avatarUrl
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: 'Failed to fetch Discord avatar'
        });
    }
});

app.get('/', async (req, res) => {
    res.send(`
        <h1>Discord Avatar Fetcher</h1>
        <p>Use the endpoint <code>/avatar?id=USERID</code> to redirect the avatar URL.</p>
        <p>Or use the API endpoint <code>/api/avatar?id=USERID</code> to get a JSON response with the avatar url.</p>
        <p>Powered by <a href="https://lanyard.rest/">Lanyard API</a>.</p>
    `);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});