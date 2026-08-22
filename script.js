// ========================================
// LIVE SUBSCRIBER COUNTS
// Using embedded Livecounts.io widgets on cards
// ========================================
const youtubers = [
    {
        "name": "MultiC12",
        "id": "UCdCp7TeckzYLlAlxx2AgZlw",
        "img": "IMG_5500.jpeg",
        "url": "https://www.youtube.com/@MultiC12",
        "profileImg": "IMG_5500.jpeg",
        "liveCountsUrl": "https://livecounts.io/youtube-live-subscriber-counter/UCdCp7TeckzYLlAlxx2AgZlw"
    },
    {
        "name": "Game1k",
        "id": "UCIiTOQP44lgYA6duuZnALfg",
        "img": "IMG_5503.jpeg",
        "url": "https://www.youtube.com/@game1kyt",
        "profileImg": "IMG_5503.jpeg",
        "liveCountsUrl": "https://livecounts.io/youtube-live-subscriber-counter/UCIiTOQP44lgYA6duuZnALfg"
    },
    {
        "name": "ItzStrawberry",
        "id": "UCPretZF6SLAIMIalsOQhBTg",
        "img": "IMG_5502.jpeg",
        "url": "https://www.youtube.com/@ItzStrawberry",
        "profileImg": "IMG_5502.jpeg",
        "liveCountsUrl": "https://livecounts.io/youtube-live-subscriber-counter/UCPretZF6SLAIMIalsOQhBTg"
    },
    {
        "name": "Xrealm",
        "id": "UCFQd2yZnvq-iJI7wz9jC2YA",
        "img": "IMG_5499.jpeg",
        "url": "https://www.youtube.com/@XREALM",
        "profileImg": "IMG_5499.jpeg",
        "liveCountsUrl": "https://livecounts.io/youtube-live-subscriber-counter/UCFQd2yZnvq-iJI7wz9jC2YA"
    }
];

const dashboard = document.getElementById('dashboard');
const lastUpdateSpan = document.getElementById('lastUpdate');
const timestampSpan = document.getElementById('timestamp');

// Render dashboard with YouTubers and embedded widgets
function renderDashboard(data) {
    dashboard.innerHTML = '';
    
    if (data.length === 0) {
        dashboard.innerHTML = '<p class="loading" style="color: #ff6666;">No subscriber data available.</p>';
        return;
    }
    
    data.forEach((youtuber, index) => {
        const card = document.createElement('div');
        card.className = 'youtuber-card';
        const imgSrc = youtuber.profileImg || youtuber.img || (`https://via.placeholder.com/120?text=${encodeURIComponent(youtuber.name)}`);
        const onErrorSrc = `https://via.placeholder.com/120?text=${encodeURIComponent(youtuber.name)}`;
        
        card.innerHTML = `
            <div class="rank-badge">#${index + 1}</div>
            <img src="${imgSrc}" alt="${youtuber.name}" class="profile-img" onerror="this.src='${onErrorSrc}'">
            <h2 class="channel-name">${youtuber.name}</h2>
            <div class="subscriber-widget" style="margin: 10px 0; min-height: 40px;">
                <iframe 
                    src="${youtuber.liveCountsUrl}" 
                    width="100%" 
                    height="50" 
                    style="border: none; border-radius: 8px; overflow: hidden;"
                    frameborder="0"
                    allowfullscreen>
                </iframe>
            </div>
            <p class="subscriber-label">Subscribers</p>
            <a href="${youtuber.url}" target="_blank" class="channel-link">Visit Channel →</a>
        `;
        dashboard.appendChild(card);
    });
    
    // Update timestamp
    updateTimestamp();
}

// Show loading spinner
function showLoadingSpinner() {
    dashboard.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading Multicraft Channels...</p></div>';
}

// Load and display YouTube data
function loadYouTubers() {
    showLoadingSpinner();
    
    try {
        // Sort by name (you can change this to sort by subs if you want)
        const sortedData = [...youtubers].sort((a, b) => a.name.localeCompare(b.name));
        
        // Render the dashboard
        renderDashboard(sortedData);
        
        console.log('Dashboard loaded with Livecounts.io widgets');
    } catch (error) {
        console.error('Error loading YouTube data:', error);
        dashboard.innerHTML = '<p class="loading" style="color: #ff6666;">Error loading channel data. Please try again later.</p>';
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

// Optional: Manual refresh (reloads the page to refresh widgets)
window.manualRefresh = () => {
    console.log('Manual refresh triggered');
    location.reload();
};
