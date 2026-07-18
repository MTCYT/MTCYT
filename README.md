# 🎮 Multicraft YouTuber Dashboard

A dynamic dashboard displaying top Multicraft YouTubers ranked by their subscriber counts with live updates.

## Features

- ✨ **Live Subscriber Counts** - Display real-time subscriber data
- 🔄 **Auto-Refresh** - Automatically updates every 60 seconds
- 🎯 **Ranking System** - YouTubers ranked by subscriber count (highest to lowest)
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile devices
- 🎨 **Modern UI** - Gaming-themed dark design with gradient accents
- 🚀 **Smooth Animations** - Card animations and hover effects

## YouTubers Tracked

1. XREALM
2. MultiC12
3. JBTHECRAFTER
4. ItzStrawberry
5. game1kyt
6. RishabhProGamingRPG
7. TimmyLoal
8. Verxsion

## Files

- **index.html** - Main HTML structure
- **style.css** - Styling and animations
- **script.js** - JavaScript logic for data fetching and rendering
- **README.md** - This file

## Setup Instructions

### Option 1: Using Mock Data (Default)
The dashboard currently uses mock subscriber data. Simply open `index.html` in a browser.

### Option 2: Using YouTube API (Real Data)
To use real subscriber counts from YouTube:

1. Get a YouTube Data API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Update the `getYouTubeChannelData()` function in `script.js` with your API key
3. Replace the mock data calls with actual API requests

Example API call:
```javascript
const response = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?key=YOUR_API_KEY&forUsername=${youtuber.name}&part=statistics,snippet`
);
```

## How to Use

1. Clone or download this repository
2. Open `index.html` in a web browser
3. The dashboard will automatically load and refresh every 60 seconds
4. Click on any "Visit Channel" button to go to that YouTuber's channel

## Customization

### Add More YouTubers
Edit the `youtubers` array in `script.js`:
```javascript
const youtubers = [
    { name: 'ChannelName', url: 'https://www.youtube.com/@ChannelName', channelId: 'UC_xxxxx' },
    // Add more...
];
```

### Change Refresh Interval
Edit the interval value in `script.js` (currently 60000 milliseconds = 60 seconds):
```javascript
setInterval(() => {
    fetchAllYouTubers();
}, 60000); // Change this value
```

### Customize Colors
Edit the CSS variables in `style.css`:
```css
:root {
    --primary-color: #ff0000;
    --accent: #ffcc00;
    /* ... more variables ... */
}
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## License

Open source - Feel free to use and modify!

## Notes

- Currently using placeholder/mock data for demonstration
- To display actual subscriber counts, you'll need to integrate the YouTube Data API
- The dashboard is fully responsive and works on all devices
- All images are using placeholder service (can be replaced with actual channel thumbnails)

---

**Created for Multicraft YouTuber Community** 🎮
