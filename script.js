const youtubers = [
    { name: 'XREALM', url: 'https://www.youtube.com/@XREALM', channelId: 'UC_placeholder1' },
    { name: 'MultiC12', url: 'https://www.youtube.com/@MultiC12', channelId: 'UC_placeholder2' },
    { name: 'JBTHECRAFTER', url: 'https://www.youtube.com/@JBTHECRAFTER', channelId: 'UC_placeholder3' },
    { name: 'ItzStrawberry', url: 'https://www.youtube.com/@ItzStrawberry', channelId: 'UC_placeholder4' },
    { name: 'game1kyt', url: 'https://www.youtube.com/@game1kyt', channelId: 'UC_placeholder5' },
    { name: 'RishabhProGamingRPG', url: 'https://www.youtube.com/@RishabhProGamingRPG', channelId: 'UC_placeholder6' },
    { name: 'TimmyLoal', url: 'https://www.youtube.com/@TimmyLoal', channelId: 'UC_placeholder7' },
    { name: 'Verxsion', url: 'https://www.youtube.com/@Verxsion', channelId: 'UC_placeholder8' }
];

// Mock data for subscriber counts (replace with real API calls)
const mockSubscribers = {
    'XREALM': 1250000,
    'MultiC12': 890000,
    'JBTHECRAFTER': 756000,
    'ItzStrawberry': 645000,
    'game1kyt': 534000,
    'RishabhProGamingRPG': 423000,
    'TimmyLoal': 312000,
    'Verxsion': 201000
};

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

// Fetch channel data from YouTube (requires API key)
async function getYouTubeChannelData(youtuber) {
    try {
        // For now, return mock data
        // To use real data, replace with actual YouTube Data API calls
        return {
            name: youtuber.name,
            url: youtuber.url,
            subscriberCount: mockSubscribers[youtuber.name] || 0,
            thumbnail: `https://via.placeholder.com/120?text=${youtuber.name}`,
            channelId: youtuber.channelId
        };
    } catch (error) {
        console.error(`Error fetching data for ${youtuber.name}:`, error);
        return null;
    }
}

// Fetch all YouTubers' data
async function fetchAllYouTubers() {
    dashboard.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading YouTube channels...</p></div>';
    
    try {
        const promises = youtubers.map(youtuber => getYouTubeChannelData(youtuber));
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
            <a href="${youtuber.url}" target="_blank" class="channel-link">Visit Channel</a>
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

// Optional: Manual refresh on button click (you can add a button to HTML)
window.manualRefresh = () => {
    console.log('Manual refresh triggered');
    fetchAllYouTubers();
};