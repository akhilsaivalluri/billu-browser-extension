# Billu Knows Best - Edge Extension

A wise black cat companion that provides AI-powered, context-aware wisdom and positive nudges while browsing the web, plus comprehensive browsing statistics on your new tab page.

## Features

### 🐱 AI-Powered Cat Companion
- **Billu** appears on websites with personalized, context-aware messages
- **Azure OpenAI GPT-4o integration** for dynamic, intelligent nudges
- **Page analysis** - Extracts title, URL, metadata, and browsing patterns
- **Smart timing** - Avoids interrupting when typing or page is hidden
- **Category-aware** - Tailors messages based on website type (work, social, entertainment)
- Beautiful CSS-animated character with adorable floppy dog ears
- Auto-disappears after 8 seconds or double-click to dismiss
- Smooth animations: floating, tail wagging, blinking, eye movement, and ear flopping on hover

### 🤖 Dynamic Message Generation
- **Real-time AI analysis** of webpage content and user behavior
- **Contextual nudges** based on:
  - Time spent on current page
  - Website category (work, social, entertainment, shopping, news)
  - Page type (login, document, video, search, etc.)
  - User's browsing patterns
- **Sassy personality** - Motivational but playful tone
- **Fallback messages** when AI service is unavailable

### 🏠 Enhanced New Tab Page
- Beautiful gradient background with animated Billu mascot
- Multi-search engine support (Google, Bing, DuckDuckGo)
- Comprehensive browsing statistics dashboard
- Quick access links to frequently visited sites

### 📊 Browsing Analytics
- **Daily time tracking** - Total browsing time
- **Productivity scoring** - Based on work vs. entertainment sites
- **Category breakdown** - Work, Social, Entertainment time distribution
- **Top sites tracking** - Most visited sites with time spent
- **Daily reset** - Statistics reset automatically each day

### 💡 Smart Messaging System
AI-powered messages that adapt to context:
- **Work sites**: "Ooooh, look at you being all productive! I'm purring with pride 😽"
- **Social media**: "Still scrolling? Even I get bored of chasing the same laser dot."
- **Shopping sites**: "Another cart? You spoil me. But maybe check your wallet before you pounce 💳"
- **News sites**: "Bad news buffet again? Let's chase some joy instead, hmm?"
- **Instagram**: "Stop comparing your behind-the-scenes to everyone's highlight reel! ✨"
- **Twitter**: "The bird app again? Remember: Twitter isn't real life! 🐦"
- **Reddit**: "Down another Reddit wormhole? Set a timer, human! ⏰"
- **Netflix**: "Another binge session? Your future self wants to have a word! 📺"
- **Amazon**: "Do you NEED it or do you WANT it? Big difference! 💰"
- Plus motivational messages for other sites!

## Installation & Setup

### 1. Install Extension
1. **Open Microsoft Edge**
2. **Go to Extensions**: Click the three dots menu → Extensions → Manage Extensions
3. **Enable Developer Mode**: Toggle the "Developer mode" switch in the bottom left
4. **Load Extension**: Click "Load unpacked" button
5. **Select Folder**: Navigate to and select the `Billu 2` folder
6. **Done!** Billu should now appear in your extensions

### 2. Configure Azure OpenAI (Optional)
For AI-powered dynamic nudges, you'll need to configure your Azure OpenAI credentials:

1. Click the extension icon in your toolbar
2. Click "Settings" button
3. Enter your Azure OpenAI credentials:
   - **Endpoint**: Your Azure OpenAI resource endpoint
   - **API Key**: Your Azure OpenAI API key
   - **Deployment**: Your GPT-4o deployment name
   - **API Version**: API version (default: 2024-12-01-preview)
4. Click "Test Connection" to verify
5. Click "Save Configuration"

**Note**: The extension works perfectly without AI configuration, using built-in motivational messages.

### 3. Get Azure OpenAI Credentials
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to your Azure OpenAI resource
3. Go to "Keys and Endpoint" section
4. Copy your endpoint URL and API key
5. Ensure you have a GPT-4o deployment created

## Security & Privacy

- **🔐 Your API keys are safe**: No hardcoded keys in source code
- **🏠 Local storage only**: API keys stored locally in your browser
- **🚫 No data collection**: Extension doesn't collect or transmit user data
- **✅ Works offline**: Full functionality without AI configuration
- **🔒 Secure by design**: HTTPS-only communication with Azure OpenAI

## File Structure

```
Billu 2/
├── manifest.json          # Extension configuration
├── content.js             # Injects Billu cat on web pages
├── content.css            # Cat animation and styling
├── background.js          # Tracks browsing time and statistics
├── newtab.html           # Custom new tab page
├── newtab.css            # New tab page styling
├── newtab.js             # New tab page functionality
├── popup.html            # Extension popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── icon-generator.html   # Tool to generate icons
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md            # This file
```

## Usage

### Browsing with Billu
- **Visit any website** - Billu will appear in the bottom right corner
- **Read the message** - Each site gets personalized wisdom
- **Double-click Billu** to dismiss early
- **Messages cycle** every 3 seconds if multiple are available

### New Tab Experience
- **Open a new tab** to see your custom dashboard
- **Search the web** using your preferred search engine
- **View daily stats** including time spent and productivity score
- **Access quick links** to frequently visited sites
- **Read Billu's wisdom** in the dedicated card

### Extension Popup
- **Click the Billu icon** in the toolbar for quick stats
- **View today's summary** with time, productivity, and top site
- **Reset statistics** if needed
- **Open new tab** directly from popup

## Customization

### Adding New Site Messages
Edit `content.js` and add entries to the `siteMessages` object:

```javascript
'yoursite.com': [
    "Your custom message here! 😸",
    "Another wise saying for this site! 🎯"
]
```

### Modifying Site Categories
Edit `background.js` and update the `siteCategories` object:

```javascript
work: ['yourworksite.com', 'anothertool.com'],
social: ['newsocialsite.com'],
entertainment: ['newstreamingsite.com']
```

### Styling Changes
- **Cat appearance**: Modify `content.css`
- **New tab design**: Edit `newtab.css`
- **Popup layout**: Update `popup.css`

## Technical Details

### Permissions
- `activeTab` - To inject Billu on web pages
- `storage` - To save browsing statistics
- `tabs` - To track active tabs for time counting
- `scripting` - To inject content scripts

### Storage
- Uses `chrome.storage.local` for persistent statistics
- Data includes: total time, per-site time, category breakdown
- Automatically resets daily at midnight

### Performance
- Lightweight content script injection
- Efficient time tracking with 30-second save intervals
- CSS animations use GPU acceleration
- Background script only runs when needed

## Browser Compatibility

- ✅ **Microsoft Edge** (Chromium-based)
- ✅ **Google Chrome** (with minor manifest tweaks)
- ❌ Firefox (requires Manifest V2 conversion)

## Development Notes

### Adding Features
1. **New messages**: Add to `content.js` siteMessages
2. **UI changes**: Modify respective CSS files
3. **Statistics**: Extend storage schema in `background.js`
4. **New pages**: Add to manifest and create HTML/CSS/JS files

### Testing
- Use Edge Developer Tools for debugging
- Check console for errors in content scripts
- Test time tracking with `chrome.storage.local.get(['browsingStats'])`
- Verify permissions in extension details

## Troubleshooting

### Billu Doesn't Appear
1. Check if content script permissions are granted
2. Verify the site isn't blocked (chrome://, edge:// pages)
3. Look for console errors in Developer Tools

### Statistics Not Tracking
1. Ensure storage permissions are enabled
2. Check background script is running
3. Verify active tab detection is working

### New Tab Not Loading
1. Check if "chrome_url_overrides" permission is granted
2. Look for JavaScript errors in new tab console
3. Ensure all files are present in extension folder

## Future Enhancements (Roadmap)

### Version 1.1
- [ ] Weekly/Monthly statistics view
- [ ] Custom message creation interface
- [ ] Site blocking/time limit features
- [ ] Export statistics functionality

### Version 1.2
- [ ] Advanced productivity insights
- [ ] Goal setting and tracking
- [ ] Integration with calendar apps
- [ ] Mood tracking with browsing habits

### Version 2.0
- [ ] Multiple cat companions to choose from
- [ ] Machine learning for personalized messages
- [ ] Cross-device synchronization
- [ ] Social features (anonymous productivity comparison)

## Credits

- **Inspired by**: Your adorable black cat photos! 🐱
- **Design**: Modern gradient UI with glass morphism effects
- **Animations**: Smooth CSS transitions and keyframe animations
- **Wisdom**: Curated collection of mindful browsing quotes

## License

This extension is created for personal use. Feel free to modify and distribute as needed.

---

**Billu Knows Best v1.0** - *Mindful browsing, one paw at a time* 🐾
