async function getSubscriberCount(channelId) {
    return new Promise((resolve, reject) => {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;

        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    // If the API returns an error object, surface it
                    const json = JSON.parse(data);
                    if (json.error) {
                        // Print the whole error object so logs show the reason (e.g., API key invalid, quota, etc.)
                        console.error(`YouTube API error for channel ${channelId}:`, JSON.stringify(json.error));
                        reject(new Error(json.error.message || 'YouTube API error'));
                        return;
                    }
                    if (!json.items || json.items.length === 0) {
                        console.error(`YouTube API returned no items for channel ${channelId}. Raw response:`, data);
                        reject(new Error('Channel not found'));
                        return;
                    }
                    const subs = parseInt(json.items[0].statistics.subscriberCount);
                    resolve(subs);
                } catch (e) {
                    console.error('Failed to parse YouTube API response for', channelId, 'raw response:', data);
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}
