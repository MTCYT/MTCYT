// ========================================
// LIVE SUBSCRIBER COUNTS
// Using embedded Livecounts.io widgets (off-screen)
// Data extracted to populate cards
// ========================================
const youtubers = [
    {
        "name": "MultiC12",
        "id": "UCdCp7TeckzYLlAlxx2AgZlw",
        "img": "IMG_5500.jpeg",
        "url": "https://www.youtube.com/@MultiC12",
        "profileImg": "IMG_5500.jpeg",
        "subs": 0,
        "liveCountsUrl": "https://livecounts.io/youtube-live-subscriber-counter/UCdCp7TeckzYLlAlxx2AgZlw"
    },
    {
        "name": "Game1k",
        "id": "UCIiTOQP44lgYA6duuZnALfg",
        "img": "IMG_5503.jpeg",
        "url": "https://www.youtube.com/@game1kyt",
        "profileImg": "IMG_5503.jpeg",
        "subs": 0,
        "liveCountsUrl": "https://livecounts.io/youtube-live-subscriber-counter/UCIiTOQP44lgYA6duuZnALfg"
    },
    {
        "name": "ItzStrawberry",
        "id": "UCPretZF6SLAIMIalsOQhBTg",
        "img": "IMG_5502.jpeg",
        "url": "https://www.youtube.com/@ItzStrawberry",
        "profileImg": "IMG_5502.jpeg",
        "subs": 0,
        "liveCountsUrl": "https://livecounts.io/youtube-live-subscriber-counter/UCPretZF6SLAIMIalsOQhBTg"
    },
    {
        "name": "Xrealm",
        "id": "UCFQd2yZnvq-iJI7wz9jC2YA",
        "img": "IMG_5499.jpeg",
        "url": "https://www.youtube.com/@XREALM",
        "profileImg": "IMG_5499.jpeg",
        "subs": 0,
        "liveCountsUrl": "https://livecounts.io/youtube-live-subscriber-counter/UCFQd2yZnvq-iJI7wz9jC2YA"
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

// Fetch subscriber count by loading iframe and extracting data
async function getSubscriberCount(channelUrl, youtuberName) {
    return new Promise((resolve) => {
        try {
            // Create an iframe to load the page
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.style.position = 'absolute';
            iframe.style.left = '-9999px';
            iframe.src = channelUrl;
            
            iframe.onload = function() {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    
                    // Try multiple selectors to find the subscriber count
                    let subsText = null;
                    
                    // Try to find span with subscriber count
                    const spans = iframeDoc.querySelectorAll('span');
                    for (let span of spans) {
                        const text = span.textContent.trim();
                        if (text.match(/^\d+(?:,\d+)*(?:\.\d+)?[MK]?$/) && text.length > 2) {
                            subsText = text;
                            break;
                        }
                    }
                    
                    // Try divs if spans didn't work
                    if (!subsText) {
                        const divs = iframeDoc.querySelectorAll('div');
                        for (let div of divs) {
                            const text = div.textContent.trim();
                            if (text.match(/^\d+(?:,\d+)*(?:\.\d+)?[MK]?$/) && text.length > 2) {
                                subsText = text;
                                break;
                            }
                        }
                    }
                    
                    if (subsText) {
                        // Convert formatted number to actual number
                        let numValue = subsText.replace(/,/g, '');
                        if (numValue.endsWith('M')) {
                            numValue = parseFloat(numValue.slice(0, -1)) * 1000000;
                        } else if (numValue.endsWith('K')) {
                            numValue = parseFloat(numValue.slice(0, -1)) * 1000;
                        } else {
                            numValue = parseInt(numValue, 10);
                        }
                        
                        console.log(`✓ ${youtuberName}: ${subsText} (${numValue})`);
                        resolve(Math.floor(numValue));
                    } else {
                        console.warn(`Could not find subscriber count for ${youtuberName}`);
                        resolve(null);
                    }
                } catch (error) {
                    console.error(`Error reading iframe for ${youtuberName}:`, error);
                    resolve(null);
                }
                
                // Remove iframe after we're done
                setTimeout(() => iframe.remove(), 100);
            };
            
            iframe.onerror = function() {
                console.warn(`Failed to load iframe for ${youtuberName}`);
                iframe.remove();
                resolve(null);
            };
            
            document.body.appendChild(iframe);
            
            // Timeout after 10 seconds
            setTimeout(() => {
                if (iframe.parentNode) {
                    console.warn(`Timeout loading ${youtuberName}`);
                    iframe.remove();
                    resolve(null);
                }
            }, 10000);
        } catch (error) {
            console.error(`Error fetching subscriber count for ${youtuberName}:`, error);
            resolve(null);
        }
    });
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

// Show loading spinner
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
        console.log('Fetching subscriber counts from Livecounts.io...');
        
        // Fetch subscriber counts for all channels
        const updatedYoutubers = await Promise.all(
            youtubers.map(async (youtuber) => {
                const subs = await getSubscriberCount(youtuber.liveCountsUrl, youtuber.name);
                return {
                    ...youtuber,
                    subs: subs !== null ? subs : youtuber.subs
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
