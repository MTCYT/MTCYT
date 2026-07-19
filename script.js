// ========================================
// LIVE SUBSCRIBER COUNTS
// Auto-updated by GitHub Actions every 30 minutes
// ========================================
const youtubers = [];

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

// Render dashboard with YouTubers using live subscriber data
function renderDashboard(data) {
    dashboard.innerHTML = '';
    
    if (data.length === 0) {
        dashboard.innerHTML = '<p class="loading" style="color: #ff6666;">No subscriber data available. Please check back soon.</p>';
        return;
    }
    
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

// Show loading spinner briefly
function showLoadingSpinner() {
    dashboard.innerHTML = '<div class="loading"><div class="spinner"></div><p>Loading YouTube channels...</p></div>';
}

// Load and display YouTube data
function loadYouTubers() {
    if (isLoading) return;
    
    isLoading = true;
    
    // Show spinner for visual feedback
    showLoadingSpinner();
    
    // Use setTimeout with 300ms delay to show spinner briefly, then load instantly
    setTimeout(() => {
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
        } finally {
            isLoading = false;
        }
    }, 300); // Brief 300ms delay to show the spinner
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

// Set up auto-refresh every 30 seconds (faster than before)
setInterval(() => {
    console.log('Auto-refreshing dashboard...');
    loadYouTubers();
}, 30000); // 30 seconds

// Optional: Manual refresh
window.manualRefresh = () => {
    console.log('Manual refresh triggered');
    loadYouTubers();
};
