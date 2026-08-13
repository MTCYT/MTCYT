const https = require('https');
const fs = require('fs');

const apiKey = process.env.YOUTUBE_API_KEY;

if (!apiKey) {
    console.error('Error: YOUTUBE_API_KEY environment variable not set');
    // Do not exit with non-zero here so that CI doesn't fail hard; workflow will show logs.
    // Keep running so the workflow can complete and we can inspect logs.
}

// Your channel IDs - Replace these with actual YouTube Channel IDs
// Optional: add a `manualSubs: 12345` property to any channel here to force a server-side/manual value.
// Alternatively, create a file named `manual-subs.json` in the repository root with the shape:
// {
//   "UCaafcsvM-r7rYimABYgjz3w": 42000,
//   "UCFQd2yZnvq-iJI7wz9jC2YA": 12345
// }
// Keys may be channel IDs (recommended) or channel names.
const channels = [
    { name: 'Xrealm', id: 'UCFQd2yZnvq-iJI7wz9jC2YA', img: 'IMG_5499.jpeg', url: 'https://www.youtube.com/@XREALM' },
    { name: 'MultiC12', id: 'UCdCp7TeckzYLlAlxx2AgZlw', img: 'IMG_5500.jpeg', url: 'https://www.youtube.com/@MultiC12' },
    { name: 'JBthecrafter', id: 'UC9u62wcOxIGTFDT8cXGN3_A', img: 'IMG_5501.jpeg', url: 'https://www.youtube.com/@JBTHECRAFTER' },
    { name: 'ItzStrawberry', id: 'UCPretZF6SLAIMIalsOQhBTg', img: 'IMG_5502.jpeg', url: 'https://www.youtube.com/@ItzStrawberry' },
    { name: 'Game1k', id: 'UCIiTOQP44lgYA6duuZnALfg', img: 'IMG_5503.jpeg', url: 'https://www.youtube.com/@game1kyt' },
    { name: 'RiashboGamingProRPG', id: 'UC2mgwdmctt2VW5c1HEqAQdw', img: 'IMG_5504.jpeg', url: 'https://www.youtube.com/@RishabhProGamingRPG' },
    { name: 'Timmyloal', id: 'UCMpMpC01eQv7rUrIyZskwnQ', img: 'IMG_5505.jpeg', url: 'https://www.youtube.com/@TimmyLoal' },
    { name: 'Verxsion', id: 'UC6JRGA_JV4bKPgh8lHCdFWA', img: 'IMG_5506.jpeg', url: 'https://www.youtube.com/@Verxsion' },
    { name: 'ChillPotatoYT', id: 'UCzIHUnv6WfPuqINZDx0aUJg', img: 'IMG_5507.jpeg', url: 'https://www.youtube.com/@ChillPotatoYT' },
    { name: 'x9jm', id: 'UCsXf8ka3i023SLn0y97unbw', img: 'IMG_5508.jpeg', url: 'https://www.youtube.com/@x9jm' },
    { name: 'vorthexisyt', id: 'UCbuLjMwPvR4H-JljH5uC7FQ', img: 'IMG_5509.jpeg', url: 'https://www.youtube.com/@vorthexisyt' },
    { name: 'sxmple', id: 'UCT30rRosI2KpbCVoy7h_-QA', img: 'IMG_5516.jpeg', url: 'https://www.youtube.com/@sxmpleMTC' },
    { name: 'Husky_Multicraft', id: 'UCaafcsvM-r7rYimABYgjz3w', img: 'IMG_5514.jpeg', url: 'https://www.youtube.com/@Husky_Multicraft' },
    { name: 'System117gaming', id: 'UC4JBWjxKcgkvdWY4hAKyqGg', img: 'IMG_5512.jpeg', url: 'https://www.youtube.com/@system1117gaming' },
    { name: 'Prologozrock', id: 'UCcbGvVytWN3_rLOWt1qLx_w', img: 'IMG_5517.jpeg', url: 'https://www.youtube.com/@Prologozrock' },
];

// Try to load manual overrides from manual-subs.json (optional)
let manualOverrides = {};
try {
    if (fs.existsSync('manual-subs.json')) {
        const raw = fs.readFileSync('manual-subs.json', 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
            manualOverrides = parsed;
            console.log('Loaded manual-subs.json overrides for subscriber counts');
        }
    }
} catch (e) {
    console.warn('Could not read/parse manual-subs.json, ignoring overrides:', e.message);
}

async function getSubscriberCount(channelId) {
    return new Promise((resolve, reject) => {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    // Log status code for debugging
                    if (res && res.statusCode && res.statusCode !== 200) {
                        console.warn(`YouTube API HTTP status ${res.statusCode} for channel ${channelId}`);
                    }

                    let json;
                    try {
                        json = JSON.parse(data);
                    } catch (parseErr) {
                        console.error(`YouTube API: failed to parse JSON for channel ${channelId}. Raw response:`, data);
                        return reject(new Error('Invalid JSON from YouTube API'));
                    }

                    if (json.error) {
                        console.error(`YouTube API error for channel ${channelId}:`, JSON.stringify(json.error));
                        return reject(new Error(json.error.message || 'YouTube API error'));
                    }

                    if (!json.items || json.items.length === 0) {
                        console.error(`YouTube API returned no items for channel ${channelId}. Raw response:`, data);
                        return reject(new Error('Channel not found'));
                    }

                    const subs = parseInt(json.items[0].statistics.subscriberCount, 10);
                    resolve(subs);
                } catch (e) {
                    console.error('Unexpected error handling YouTube API response for', channelId, e, 'raw response:', data);
                    reject(e);
                }
            });
        }).on('error', (err) => {
            console.error('HTTP request error when calling YouTube API for', channelId, err);
            reject(err);
        });
    });
}

async function updateSubscribers() {
    console.log('Fetching latest subscriber counts from YouTube API (manual overrides supported)...');
    const youtubers = [];

    for (const channel of channels) {
        try {
            // Prefer manualSubs property on the channel, then manual-subs.json overrides (by id or name), then API
            let manual = null;
            if (typeof channel.manualSubs === 'number') {
                manual = channel.manualSubs;
            } else if (manualOverrides && (manualOverrides[channel.id] || manualOverrides[channel.name])) {
                const keyVal = manualOverrides[channel.id] || manualOverrides[channel.name];
                const parsed = parseInt(keyVal, 10);
                if (Number.isFinite(parsed)) manual = parsed;
            }

            if (manual !== null) {
                youtubers.push({ ...channel, profileImg: channel.img, subs: manual, manualSubs: manual });
                console.log(`● ${channel.name}: using manualSubs = ${manual.toLocaleString()}`);
                continue;
            }

            if (!apiKey) {
                console.warn(`Skipping API fetch for ${channel.name} because YOUTUBE_API_KEY is not set`);
                continue;
            }

            const subs = await getSubscriberCount(channel.id);
            // include profileImg so the front-end can reference it consistently
            youtubers.push({ ...channel, profileImg: channel.img, subs });
            console.log(`✓ ${channel.name}: ${subs.toLocaleString()} subscribers`);
        } catch (err) {
            console.error(`✗ Failed to fetch ${channel.name}:`, err.message);
        }
    }

    if (youtubers.length === 0) {
        console.error('Fatal error: No subscriber data was fetched. Check your API key and channel IDs or add manual overrides.');
        console.error('Leaving script.js unchanged so the site can continue to serve existing data (if any).');
        // Do not exit with an error code so the workflow can finish and show the logs.
        return;
    }

    // Read existing script.js to preserve other content
    let existingScript;
    try {
        existingScript = fs.readFileSync('script.js', 'utf8');
    } catch (readErr) {
        console.error('Failed to read script.js from disk:', readErr);
        // Still attempt to write a new script.js if possible
        existingScript = `// Auto-generated script.js - fallback\nconst youtubers = ${JSON.stringify(youtubers, null, 4)};\n`;
    }

    // Replace the youtubers array while keeping the rest of the script
    // Use a permissive regex so we don't miss the declaration if it's var/let/const or has different spacing
    const pattern = /(?:const|let|var)\s+youtubers\s*=\s*\[[\s\S]*?\];/;
    let updatedScript;
    if (pattern.test(existingScript)) {
        updatedScript = existingScript.replace(pattern, `const youtubers = ${JSON.stringify(youtubers, null, 4)};`);
    } else {
        // If we can't find the declaration, append it at the end so the site still gets the data
        console.warn('Could not find existing youtubers declaration in script.js; appending a new one to the end of script.js');
        updatedScript = existingScript + `\n\n// Auto-generated youtubers list (appended)\nconst youtubers = ${JSON.stringify(youtubers, null, 4)};\n`;
    }

    try {
        // Write updated script.js
        fs.writeFileSync('script.js', updatedScript, 'utf8');
        console.log(`✓ Updated script.js with ${youtubers.length} channels (latest subscriber counts)`);
    } catch (writeErr) {
        console.error('Failed to write updated script.js:', writeErr);
    }
}

updateSubscribers().catch(err => {
    console.error('Unhandled error in updateSubscribers:', err);
    // Do not exit with non-zero to avoid failing the whole workflow; keep logs for diagnosis.
});
