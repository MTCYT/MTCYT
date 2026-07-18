const youtubers = [
    { name: 'XREALM', url: 'https://www.youtube.com/@XREALM', profileImg: 'IMG_5499.jpg' },
    { name: 'MultiC12', url: 'https://www.youtube.com/@MultiC12', profileImg: 'IMG_5500.jpg' },
    { name: 'JBTHECRAFTER', url: 'https://www.youtube.com/@JBTHECRAFTER', profileImg: 'IMG_5501.jpg' },
    { name: 'ItzStrawberry', url: 'https://www.youtube.com/@ItzStrawberry', profileImg: 'IMG_5502.jpg' },
    { name: 'game1kyt', url: 'https://www.youtube.com/@game1kyt', profileImg: 'IMG_5503.jpg' },
    { name: 'RishabhProGamingRPG', url: 'https://www.youtube.com/@RishabhProGamingRPG', profileImg: 'IMG_5504.jpg' },
    { name: 'TimmyLoal', url: 'https://www.youtube.com/@TimmyLoal', profileImg: 'IMG_5505.jpg' },
    { name: 'Verxsion', url: 'https://www.youtube.com/@Verxsion', profileImg: 'IMG_5506.jpg' }
];

const dashboard = document.getElementById('dashboard');
const lastUpdateSpan = document.getElementById('lastUpdate');
const timestampSpan = document.getElementById('timestamp');

// Format large numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    }
    return num.toString();
}

// Fetch subscriber count using YouTube Scraper API (free)
async function getSubscriberCount(channelUrl) {
    try {
        const channelHandle = channelUrl.split('@')[1];
        
        // Using YouTube Scraper API
        const apiUrl = `https://www.youtube.com/@${channelHandle}`;
        
        // Fetch the page
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`);
        const data = await response.json();
        
        if (data.contents) {
            // Extract subscriber count from page content
            const match = data.contents.match(/([0-9.]+[KMB])\s*subscribers/i) || 
                         data.contents.match(/"subscriberCountText":\{"simpleText":"([^"]+)"/);
            
            if (match) {
                let count = match[1];
                count = count.replace(/[A-Z]/gi, (char) => {
                    if (char.toUpperCase() === 'K') return '000';
                    if (char.toUpperCase() === 'M') return '000000';
                    if (char.toUpperCase() === 'B') return '000000000';
                    return '';
                });
                return parseInt(count.replace(/[^0-9]/g, '')) || 0;
            }
        }
        return 0;
    } catch (error) {
        console.error(`Error fetching subscriber count:`, error);
        return 0;
    }
}

// Fetch YouTube channel data
async function fetchYouTubeData(youtuber) {
    try {
        const channelHandle = youtuber.url.split('@')[1];
        
        // Fetch subscriber count
        const subscriberCount = await getSubscriberCount(youtuber.url);
        
        // Use custom profile image if provided
        const thumbnail = youtuber.profileImg 
            ? `./images/${youtuber.profileImg}` 
            : `https://via.placeholder.com/120?text=${channelHandle}`;
        
        return {
            name: youtuber.name,
            url: youtuber.url,
            subscriberCount: subscriberCount || 0,
            thumbnail: thumbnail
        };
    } catch (error) {
        console.error(`Error fetching data for ${youtuber.name}:`, error);
        return {
            name: youtuber.name,
            url: youtuber.url,
            subscriberCount: 0,
            thumbnail: youtuber.profileImg 
                ? `./images/${youtuber.profileImg}` 
                : `https://via.placeholder.com/120?text=${youtuber.name}`
        };
    }
}

// Fetch all YouTubers' data
async function fetchAllYouTubers() {
    dashboard.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading YouTube channels...</p></div>';
    
    try {
        const promises = youtubers.map(youtuber => fetchYouTubeData(youtuber));
        let data = await Promise.all(promises);
        
        // Filter out null entries
        data = data.filter(item => item !== null);
        
        // Sort by subscriber count (highest first)
        data.sort((a, b) => b.subscriberCount - a.subscriberCount);
        
        // Render the dashboard
        renderDashboard(data);
        
        // Update timestamp
        updateTimestamp();
    } catch (error) {
        console.error('Error fetching YouTube data:', error);
        dashboard.innerHTML = '<p class="loading" style="color: #ff6666;">Error loading channel data. Please try again later.</p>';
    }
}

// Render dashboard with YouTubers
function renderDashboard(data) {
    dashboard.innerHTML = '';
    
    data.forEach((youtuber, index) => {
        const card = document.createElement('div');
        card.className = 'youtuber-card';
        card.innerHTML = `
            <div class="rank-badge">#${index + 1}</div>
            <img src="${youtuber.thumbnail}" alt="${youtuber.name}" class="profile-img" onerror="this.src='https://via.placeholder.com/120?text=${youtuber.name}'">
            <h2 class="channel-name">${youtuber.name}</h2>
            <div class="subscriber-count">${formatNumber(youtuber.subscriberCount)}</div>
            <p class="subscriber-label">Subscribers</p>
            <a href="${youtuber.url}" target="_blank" class="channel-link">Visit Channel →</a>
        `;
        dashboard.appendChild(card);
    });
}

// Update timestamp
function updateTimestamp() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: true 
    });
    timestampSpan.textContent = timeString;
    lastUpdateSpan.textContent = `Last updated: ${timeString}`;
}

// Initial load
fetchAllYouTubers();

// Set up auto-refresh every 60 seconds
setInterval(() => {
    console.log('Auto-refreshing dashboard...');
    fetchAllYouTubers();
}, 60000); // 60 seconds

// Optional: Manual refresh
window.manualRefresh = () => {
    console.log('Manual refresh triggered');
    fetchAllYouTubers();
};
