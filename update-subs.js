const https = require('https');
const fs = require('fs');

const apiKey = process.env.YOUTUBE_API_KEY;

if (!apiKey) {
    console.error('Error: YOUTUBE_API_KEY environment variable not set');
    process.exit(1);
}

// Your channel IDs - Replace these with actual YouTube Channel IDs
const channels = [
    { name: 'Xrealm', id: 'UCWf8rVphxXaXBpMqx3eL8Bg', img: 'IMG_5499.jpeg', url: 'https://www.youtube.com/@XREALM' },
    { name: 'MultiC12', id: 'UC_placeholder_1', img: 'IMG_5500.jpeg', url: 'https://www.youtube.com/@MultiC12' },
    { name: 'JBthecrafter', id: 'UC_placeholder_2', img: 'IMG_5501.jpeg', url: 'https://www.youtube.com/@JBTHECRAFTER' },
    { name: 'ItzStrawberry', id: 'UC_placeholder_3', img: 'IMG_5502.jpeg', url: 'https://www.youtube.com/@ItzStrawberry' },
    { name: 'Game1k', id: 'UC_placeholder_4', img: 'IMG_5503.jpeg', url: 'https://www.youtube.com/@game1kyt' },
    { name: 'RiashboGamingProRPG', id: 'UC_placeholder_5', img: 'IMG_5504.jpeg', url: 'https://www.youtube.com/@RishabhProGamingRPG' },
    { name: 'Timmyloal', id: 'UC_placeholder_6', img: 'IMG_5505.jpeg', url: 'https://www.youtube.com/@TimmyLoal' },
    { name: 'Verxsion', id: 'UC_placeholder_7', img: 'IMG_5506.jpeg', url: 'https://www.youtube.com/@Verxsion' },
    { name: 'ChillPotatoYT', id: 'UC_placeholder_8', img: 'IMG_5507.jpeg', url: 'https://www.youtube.com/@ChillPotatoYT' },
    { name: 'x9jm', id: 'UC_placeholder_9', img: 'IMG_5508.jpeg', url: 'https://www.youtube.com/@x9jm' },
    { name: 'vorthexisyt', id: 'UC_placeholder_10', img: 'IMG_5509.jpeg', url: 'https://www.youtube.com/@vorthexisyt' },
    { name: 'sxmples', id: 'UC_placeholder_11', img: 'IMG_5516.jpeg', url: 'https://www.youtube.com/@sxmpleMTC' },
    { name: 'Husky_Multicraft', id: 'UC_placeholder_12', img: 'IMG_5514.jpeg', url: 'https://www.youtube.com/@Husky_Multicraft' },
    { name: 'System117gaming', id: 'UC_placeholder_13', img: 'IMG_5512.jpeg', url: 'https://www.youtube.com/@system1117gaming' },
    { name: 'Prologozrock', id: 'UC_placeholder_14', img: 'IMG_5517.jpeg', url: 'https://www.youtube.com/@Prologozrock' },
];

async function getSubscriberCount(channelId) {
    return new Promise((resolve, reject) => {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (!json.items || json.items.length === 0) {
                        reject(new Error('Channel not found'));
                        return;
                    }
                    const subs = parseInt(json.items[0].statistics.subscriberCount);
                    resolve(subs);
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function updateSubscribers() {
    console.log('Fetching latest subscriber counts from YouTube API...');
    const youtubers = [];
    
    for (const channel of channels) {
        try {
            const subs = await getSubscriberCount(channel.id);
            youtubers.push({ ...channel, subs });
            console.log(`✓ ${channel.name}: ${subs.toLocaleString()} subscribers`);
        } catch (err) {
            console.error(`✗ Failed to fetch ${channel.name}:`, err.message);
        }
    }
    
    // Read existing script.js to preserve other content
    const existingScript = fs.readFileSync('script.js', 'utf8');
    
    // Replace the youtubers array while keeping the rest of the script
    const updatedScript = existingScript.replace(
        /const youtubers = \[\s*[\s\S]*?\];/,
        `const youtubers = ${JSON.stringify(youtubers, null, 4)};`
    );
    
    // Write updated script.js
    fs.writeFileSync('script.js', updatedScript);
    console.log('✓ Updated script.js with latest subscriber counts');
}

updateSubscribers().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
