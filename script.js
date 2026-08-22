// ========================================
// LIVE SUBSCRIBER COUNTS
// Fetching from Livecounts.io using JSONP
// ========================================
const youtubers = [
    {
        "name": "MultiC12",
        "id": "UCdCp7TeckzYLlAlxx2AgZlw",
        "img": "IMG_5500.jpeg",
        "url": "https://www.youtube.com/@MultiC12",
        "profileImg": "IMG_5500.jpeg",
        "subs": 0
    },
    {
        "name": "Game1k",
        "id": "UCIiTOQP44lgYA6duuZnALfg",
        "img": "IMG_5503.jpeg",
        "url": "https://www.youtube.com/@game1kyt",
        "profileImg": "IMG_5503.jpeg",
        "subs": 0
    },
    {
        "name": "ItzStrawberry",
        "id": "UCPretZF6SLAIMIalsOQhBTg",
        "img": "IMG_5502.jpeg",
        "url": "https://www.youtube.com/@ItzStrawberry",
        "profileImg": "IMG_5502.jpeg",
        "subs": 0
    },
    {
        "name": "Xrealm",
        "id": "UCFQd2yZnvq-iJI7wz9jC2YA",
        "img": "IMG_5499.jpeg",
        "url": "https://www.youtube.com/@XREALM",
        "profileImg": "IMG_5499.jpeg",
        "subs": 0
    }
];

const dashboard = document.getElementById('dashboard');
const lastUpdateSpan = document.getElementById('lastUpdate');
const timestampSpan = document.getElementById('timestamp');
let isLoading = false;

// Format large numbers
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    }
    return num.toString();
}

// Fetch subscriber count by scraping from Livecounts.io page
async function getSubscriberCount(channelId) {
    try {
        // Use a CORS proxy to bypass restrictions
        const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(`https://www.livecounts.io/youtube-live-subscriber-counter/${channelId}`)}`);
        
        if (!response.ok) {
            console.warn(`Failed to fetch page for ${channelId}`);
            return null;
        }
        
        const html = await response.text();
        
        // Look for the subscriber count in the HTML
        const match = html.match(/subscribers['"]\s*:\s*['"]*(\d+(?:,\d+)*)/i) || 
                      html.match(/subscriberCount['"]\s*:\s*['"]*(\d+(?:,\d+)*)/i) ||
                      html.match(/>(\d+(?:,\d+)*)\s*<\/span>\s*<\/div>\s*<p>Subscribers/);
        
        if (match && match[1]) {
            const subsStr = match[1].replace(/,/g, '');
            return parseInt(subsStr, 10);
        }
        
        console.warn(`Could not extract subscriber count from ${channelId}`);
        return null;
    } catch (error) {
        console.error(`Error fetching subscriber count for ${channelId}:`, error);
        return null;
    }
}

// Render dashboard with YouTubers using live subscriber data
function renderDashboard(data) {
    dashboard.innerHTML = '';
    
    if (data.length === 0) {
        dashboard.innerHTML = '<p class="loading" style="color: #ff6666;">No subscriber data available. Waiting for first data fetch...</p>';
        return;
    }
    
    data.forEach((youtuber, index) => {
        const card = document.createElement('div');
        card.className = 'youtuber-card';
        // Use profileImg if present, otherwise fall back to img, otherwise a placeholder with the channel name
        const imgSrc = youtuber.profileImg || youtuber.img || (`https://via.placeholder.com/120?text=${encodeURIComponent(youtuber.name)}`);
        const onErrorSrc = `https://via.placeholder.com/120?text=${encodeURIComponent(youtuber.name)}`;
        card.innerHTML = `
            <div class="rank-badge">#${index + 1}</div>
            <img src="${imgSrc}" alt="${youtuber.name}" class="profile-img" onerror="this.src='${onErrorSrc}'">
            <h2 class="channel-name">${youtuber.name}</h2>
            <div class="subscriber-count">${formatNumber(youtuber.subs)}</div>
            <p class="subscriber-label">Subscribers</p>
            <a href="${youtuber.url}" target="_blank" class="channel-link">Visit Channel →</a>
        `;
        dashboard.appendChild(card);
    });
}

// Show loading spinner briefly
function showLoadingSpinner() {
    dashboard.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading Multicraft Channels...</p></div>';
}

// Load and display YouTube data
async function loadYouTubers() {
    if (isLoading) return;
    
    isLoading = true;
    
    // Show spinner for visual feedback
    showLoadingSpinner();
    
    try {
        // Fetch subscriber counts for all channels
        const updatedYoutubers = await Promise.all(
            youtubers.map(async (youtuber) => {
                const subs = await getSubscriberCount(youtuber.id);
                return {
                    ...youtuber,
                    subs: subs !== null ? subs : youtuber.subs // Use fetched count or keep existing
                };
            })
        );
        
        // Sort by subscriber count (highest first)
        const sortedData = updatedYoutubers.sort((a, b) => b.subs - a.subs);
        
        // Render the dashboard
        renderDashboard(sortedData);
        
        // Update timestamp
        updateTimestamp();
        
        console.log('Dashboard updated with live subscriber counts');
    } catch (error) {
        console.error('Error loading YouTube data:', error);
        dashboard.innerHTML = '<p class="loading" style="color: #ff6666;">Error loading channel data. Please try again later.</p>';
    } finally {
        isLoading = false;
    }
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
loadYouTubers();

// Set up auto-refresh every 60 seconds (one minute)
setInterval(() => {
    console.log('Auto-refreshing Multicraft Channels...');
    loadYouTubers();
}, 60000); // 60 seconds (one minute)

// Optional: Manual refresh
window.manualRefresh = () => {
    console.log('Manual refresh triggered');
    loadYouTubers();
};
