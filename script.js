// ========================================
// EDITABLE SUBSCRIBER COUNTS
// Edit the subscriber values below and save to update the dashboard
// ========================================
const youtubers = [
    { name: 'Xrealm', url: 'https://www.youtube.com/@XREALM', profileImg: 'IMG_5499.jpeg', subs: 22400 },
    { name: 'MultiC12', url: 'https://www.youtube.com/@MultiC12', profileImg: 'IMG_5500.jpeg', subs: 0 },
    { name: 'JBthecrafter', url: 'https://www.youtube.com/@JBTHECRAFTER', profileImg: 'IMG_5501.jpeg', subs: 0 },
    { name: 'ItzStrawberry', url: 'https://www.youtube.com/@ItzStrawberry', profileImg: 'IMG_5502.jpeg', subs: 0 },
    { name: 'Game1k', url: 'https://www.youtube.com/@game1kyt', profileImg: 'IMG_5503.jpeg', subs: 0 },
    { name: 'RiashboGamingProRPG', url: 'https://www.youtube.com/@RishabhProGamingRPG', profileImg: 'IMG_5504.jpeg', subs: 0 },
    { name: 'Timmyloal', url: 'https://www.youtube.com/@TimmyLoal', profileImg: 'IMG_5505.jpeg', subs: 0 },
    { name: 'Verxsion', url: 'https://www.youtube.com/@Verxsion', profileImg: 'IMG_5506.jpeg', subs: 0 }
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

// Render dashboard with YouTubers using local subscriber data
function renderDashboard(data) {
    dashboard.innerHTML = '';
    
    data.forEach((youtuber, index) => {
        const card = document.createElement('div');
        card.className = 'youtuber-card';
        card.innerHTML = `
            <div class="rank-badge">#${index + 1}</div>
            <img src="${youtuber.profileImg}" alt="${youtuber.name}" class="profile-img" onerror="this.src='https://via.placeholder.com/120?text=${youtuber.name}'">
            <h2 class="channel-name">${youtuber.name}</h2>
            <div class="subscriber-count">${formatNumber(youtuber.subs)}</div>
            <p class="subscriber-label">Subscribers</p>
            <a href="${youtuber.url}" target="_blank" class="channel-link">Visit Channel →</a>
        `;
        dashboard.appendChild(card);
    });
}

// Load and display YouTube data
function loadYouTubers() {
    dashboard.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading YouTube channels...</p></div>';
    
    try {
        // Sort by subscriber count (highest first)
        const sortedData = [...youtubers].sort((a, b) => b.subs - a.subs);
        
        // Render the dashboard
        renderDashboard(sortedData);
        
        // Update timestamp
        updateTimestamp();
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

// Set up auto-refresh every 60 seconds
setInterval(() => {
    console.log('Auto-refreshing dashboard...');
    loadYouTubers();
}, 60000); // 60 seconds

// Optional: Manual refresh
window.manualRefresh = () => {
    console.log('Manual refresh triggered');
    loadYouTubers();
};
