# ☕ My Daily Brew

A cozy habit tracker and daily schedule app with a warm café aesthetic. Built as a Progressive Web App (PWA) for offline use with notification reminders.

![Daily Brew Screenshot](icons/icon-512.png)

## Features

- 📅 **Daily Overview** - See all your habits and tasks at a glance
- ⭐ **Habit Tracking** - Track daily rituals with streak counting
- ✓ **Task Management** - Prioritize tasks with high/medium/low levels
- 🔔 **Reminder Notifications** - Get alerted at scheduled times for your tasks
- ⏱️ **Focus Timer** - Pomodoro-style timer with preset and custom durations
- 📆 **Calendar View** - Monthly overview of your mood and activity history
- 📊 **Statistics** - Track mood trends, habit streaks, and task completion rates
- 😊 **Mood Tracker** - Log your daily mood and see patterns over time
- ☀️🌙 **Light & Dark Brew** - Toggle between light and dark themes
- 📱 **Mobile Optimized** - Works great on phones and tablets
- 🔌 **Offline Support** - Use the app without internet
- 📲 **Installable** - Add to home screen for app-like experience
- 🔋 **Battery Conscious** - Only checks for updates when opening the app
- 💾 **Persistent Data** - Your data is saved locally

## New in v2.0

### 🌙 Dark Brew Mode
Switch between Light Brew (warm beige theme) and Dark Brew (cozy dark theme) using the toggle button in the header. Your preference is saved automatically.

### ⏱️ Focus Timer
- Preset durations: 5, 15, 25, 45 minutes
- Start timer directly from any incomplete task
- Get notified when your focus session ends
- Pause and reset functionality

### 📆 Calendar View
- Monthly calendar showing your tracked days
- Mood emoji indicators for each day
- Navigate between months
- Visual mood legend

### 📊 Statistics Dashboard
- Average mood for the month
- Mood distribution chart
- Habit streak rankings
- Task completion by priority level

### 😊 Mood Tracking
- Quick daily mood logging (5 levels from 😢 to 🤩)
- Mood history saved with timestamps
- Integrated into calendar and statistics

## Deployment to GitHub Pages

### Quick Setup

1. **Create a new GitHub repository**
   - Go to github.com and create a new repository
   - Name it something like `daily-brew` or `my-daily-brew`

2. **Upload the files**
   ```bash
   # Initialize git in this folder
   git init
   
   # Add all files
   git add .
   
   # Commit
   git commit -m "Initial commit - My Daily Brew PWA"
   
   # Add your GitHub repo as remote
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   
   # Push to GitHub
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click **Settings** → **Pages**
   - Under "Source", select **Deploy from a branch**
   - Select **main** branch and **/ (root)** folder
   - Click **Save**

4. **Access your app**
   - Your app will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
   - It may take a few minutes for the first deployment

### File Structure

```
daily-brew-pwa/
├── index.html          # Main app file
├── sw.js               # Service worker for offline support
├── manifest.json       # PWA manifest for installation
├── README.md           # This file
├── generate_icons.py   # Icon generation script (optional)
└── icons/
    ├── icon-32.png
    ├── icon-72.png
    ├── icon-96.png
    ├── icon-128.png
    ├── icon-144.png
    ├── icon-152.png
    ├── icon-192.png
    ├── icon-384.png
    ├── icon-512.png
    ├── screenshot-wide.png
    └── screenshot-narrow.png
```

## How Updates Work

The app is designed to be battery-conscious:

1. **On first visit**: All assets are cached for offline use
2. **On subsequent visits**: The app checks for updates only when you open it (not in the background)
3. **When an update is found**: A toast notification appears asking if you want to refresh
4. **Offline mode**: The app works completely offline using cached assets

## Updating the App

To push updates to users:

1. Make your changes to `index.html`
2. Update the `CACHE_VERSION` in `sw.js` (e.g., change `v1.1.0` to `v1.1.1`)
3. Commit and push to GitHub
4. Users will see the update notification next time they open the app

```javascript
// In sw.js, update this line:
const CACHE_VERSION = 'v1.1.1';  // Increment version number
```

## Customization

### Changing Colors

The app uses these café-themed colors (defined in `index.html`):

- Background: `#F5E6D3` (warm beige)
- Card background: `#FDFBF7` (cream)
- Primary brown: `#5D4037`
- Medium brown: `#8B7355`
- Accent: `#C4A77D`

### Changing Fonts

The app uses Google Fonts:
- **Caveat** - Handwritten style for titles
- **Cormorant Garamond** - Elegant serif for headings
- **Lora** - Readable serif for body text

## Browser Support

- ✅ Chrome/Edge (full PWA support)
- ✅ Firefox (partial PWA support)
- ✅ Safari iOS (Add to Home Screen)
- ✅ Samsung Internet

## License

MIT License - Feel free to use and modify!

---

Made with ☕ and warmth
