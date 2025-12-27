# ☕ My Daily Brew

A cozy habit tracker and daily schedule app with a warm café aesthetic. Built as a Progressive Web App (PWA) for offline use with notification reminders.

![Daily Brew Screenshot](icons/icon-512.png)

## Features

- 📅 **Daily Overview** - See all your habits and tasks at a glance
- ⭐ **Habit Tracking** - Track daily rituals with streak counting
- ✓ **Task Management** - Prioritize tasks with high/medium/low levels
- 🔔 **Reminder Notifications** - Get alerted at scheduled times for your tasks
- 📱 **Mobile Optimized** - Works great on phones and tablets
- 🔌 **Offline Support** - Use the app without internet
- 📲 **Installable** - Add to home screen for app-like experience
- 🔋 **Battery Conscious** - Only checks for updates when opening the app
- 💾 **Persistent Data** - Your habits and tasks are saved locally

## Notification Features

The app supports native push notifications that:
- **Appear on lock screen** - See reminders without unlocking your phone
- **Use system sounds** - Plays your device's default notification sound
- **Vibrate** - Gets your attention with a vibration pattern
- **Quick actions** - Mark as done or snooze (+10 min) directly from the notification
- **Stay visible** - Notifications remain until you interact with them

### How Reminders Work

1. When creating a task, set a time and enable "Remind me at this time"
2. Grant notification permission when prompted
3. At the scheduled time, you'll receive a notification
4. From the notification, you can:
   - Tap **✓ Done** to mark the task complete
   - Tap **⏰ +10 min** to snooze the reminder
   - Tap the notification to open the app

### iOS Note
On iOS, notifications work best when the app is installed to the home screen (Add to Home Screen). Safari PWA notifications have some limitations compared to Android.

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
