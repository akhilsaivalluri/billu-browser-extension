# 🐱 Billu - AI-Powered Productivity Tracker

> Meet Billu, your friendly AI cat assistant that helps you track and understand your browsing habits with witty commentary and insights!

![Billu Extension](https://img.shields.io/badge/Browser-Extension-blue)
![Version](https://img.shields.io/badge/Version-1.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

- **🕒 Real-time Time Tracking**: Automatically tracks time spent on different websites
- **📊 Smart Categorization**: Organizes your browsing into work, social, entertainment, shopping, news, and other categories
- **🤖 AI Commentary**: Billu provides witty, personalized insights about your browsing habits (requires OpenAI API)
- **📈 Beautiful Analytics**: View your productivity stats in a gorgeous new tab page
- **🎨 Adorable Cat Character**: Billu appears with speech bubbles and animations
- **🔒 Privacy-First**: All data stays local, no tracking, user-configurable AI

## 🚀 Installation

### From Source
1. Download or clone this repository
2. Open your browser's extension settings
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension folder
5. Billu will appear in your browser!

### Browser Compatibility
- ✅ Chrome
- ✅ Microsoft Edge
- ✅ Other Chromium-based browsers

## ⚙️ Configuration

### AI Features (Optional)
To enable Billu's AI commentary, you'll need to configure your OpenAI API:

1. Click the Billu extension icon
2. Go to Settings
3. Enter your OpenAI API details:
   - **Endpoint**: Your Azure OpenAI endpoint or `https://api.openai.com/v1`
   - **API Key**: Your OpenAI API key
   - **Model**: `gpt-3.5-turbo` or `gpt-4`

> **Note**: The extension works perfectly without AI - you'll still get time tracking and analytics!

## 📱 Screenshots

### Popup Interface
- Clean, intuitive time tracking display
- Quick access to today's stats
- Settings panel for AI configuration

### New Tab Dashboard
- Beautiful category breakdown
- Time spent visualization
- Productivity insights

### Billu Character
- Animated cat with speech bubbles
- Contextual commentary
- Hover animations and interactions

## 🛠️ Technical Details

### Built With
- **Manifest V3** - Latest browser extension standard
- **Vanilla JavaScript** - No heavy frameworks
- **CSS3 Animations** - Smooth, performant animations
- **Chrome Storage API** - Secure local data storage

### Architecture
- `background.js` - Core time tracking logic
- `content.js` - Billu character and AI integration
- `popup.js` - Extension popup interface
- `newtab.js` - New tab dashboard
- Secure credential storage with Chrome APIs

## 🔒 Privacy & Security

- **No data collection** - Everything stays on your device
- **Optional AI** - Works fully without external APIs
- **Secure storage** - API keys encrypted locally
- **No tracking** - Your browsing data never leaves your browser

## 🎨 Customization

Billu's appearance and behavior can be customized by modifying:
- `content.css` - Visual styling and animations
- `newtab.css` - Dashboard appearance
- `popup.css` - Popup interface styling

## 📝 Development

### Project Structure
```
billu-extension/
├── manifest.json          # Extension configuration
├── background.js          # Core tracking logic
├── content.js            # Billu character & AI
├── popup.html/js/css     # Extension popup
├── newtab.html/js/css    # New tab page
├── icons/                # Extension icons
└── docs/                 # Documentation
```

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/billu-browser-extension/issues)
- **Features**: Request features via GitHub Issues
- **Security**: Report security issues privately

## 🎯 Roadmap

- [ ] Firefox support
- [ ] More AI personality options
- [ ] Advanced analytics
- [ ] Export data functionality
- [ ] Dark mode
- [ ] Multiple cat characters

## 🙏 Acknowledgments

- Inspired by productivity tracking needs
- Built with love for the developer community
- Thanks to all beta testers and contributors

---

**Made with ❤️ and lots of ☕ by [Your Name]**

*Billu says: "Meow! Thanks for using my extension! 🐱"*
