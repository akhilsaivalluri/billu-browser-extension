// Billu Knows Best - Background Service Worker

class BrowsingTracker {
    constructor() {
        this.activeTabId = null;
        this.startTime = null;
        this.stats = null;
        this.siteCategories = {
            work: ['github.com', 'stackoverflow.com', 'docs.', 'gmail.com', 'outlook.com', 'slack.com', 'teams.microsoft.com', 'zoom.us', 'notion.so', 'trello.com', 'jira.', 'confluence.', 'asana.com', 'monday.com'],
            social: ['facebook.com', 'twitter.com', 'instagram.com', 'linkedin.com', 'reddit.com', 'discord.com', 'snapchat.com', 'tiktok.com', 'x.com', 'threads.net'],
            entertainment: ['youtube.com', 'netflix.com', 'hulu.com', 'spotify.com', 'twitch.tv', 'pinterest.com', 'imgur.com', 'disney.com', 'hbo.com', 'prime.com'],
            shopping: ['amazon.com', 'ebay.com', 'etsy.com', 'aliexpress.com', 'walmart.com', 'target.com', 'shopify.com', 'mercadolibre.com'],
            news: ['cnn.com', 'bbc.com', 'reuters.com', 'nytimes.com', 'theguardian.com', 'washingtonpost.com', 'npr.org', 'techcrunch.com', 'ars-technica.com']
        };
        
        this.init();
    }

    async init() {
        console.log('Initializing BrowsingTracker');
        try {
            await this.loadStats();
            this.setupEventListeners();
            await this.trackActiveTab();
            console.log('BrowsingTracker initialized successfully');
        } catch (error) {
            console.error('Error initializing BrowsingTracker:', error);
        }
    }

    async loadStats() {
        try {
            const result = await chrome.storage.local.get(['browsingStats', 'lastResetDate']);
            const today = new Date().toDateString();
            
            console.log('Loading stats:', result);
            
            if (!result.browsingStats || result.lastResetDate !== today) {
                // Reset stats for new day
                this.stats = {
                    totalTime: 0,
                    sites: {},
                    categories: { work: 0, social: 0, entertainment: 0, shopping: 0, news: 0, other: 0 }
                };
                await this.saveStats();
                console.log('Reset stats for new day');
            } else {
                this.stats = result.browsingStats;
                // Ensure all categories exist (for backwards compatibility)
                this.stats.categories = {
                    work: this.stats.categories.work || 0,
                    social: this.stats.categories.social || 0,
                    entertainment: this.stats.categories.entertainment || 0,
                    shopping: this.stats.categories.shopping || 0,
                    news: this.stats.categories.news || 0,
                    other: this.stats.categories.other || 0
                };
                console.log('Loaded existing stats:', this.stats);
            }
        } catch (error) {
            console.error('Error loading stats:', error);
            this.stats = {
                totalTime: 0,
                sites: {},
                categories: { work: 0, social: 0, entertainment: 0, shopping: 0, news: 0, other: 0 }
            };
        }
    }

    async saveStats() {
        try {
            await chrome.storage.local.set({
                browsingStats: this.stats,
                lastResetDate: new Date().toDateString()
            });
        } catch (error) {
            console.error('Error saving stats:', error);
        }
    }

    setupEventListeners() {
        // Track tab changes
        chrome.tabs.onActivated.addListener((activeInfo) => {
            this.onTabChanged(activeInfo.tabId);
        });

        // Track tab updates (URL changes)
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.active) {
                this.onTabChanged(tabId);
            }
        });

        // Track window focus changes
        chrome.windows.onFocusChanged.addListener((windowId) => {
            if (windowId === chrome.windows.WINDOW_ID_NONE) {
                // Window lost focus
                this.stopTracking();
            } else {
                // Window gained focus
                chrome.tabs.query({ active: true, windowId: windowId }, (tabs) => {
                    if (tabs.length > 0) {
                        this.onTabChanged(tabs[0].id);
                    }
                });
            }
        });

        // Periodic save (every 30 seconds)
        setInterval(() => {
            if (this.activeTabId && this.startTime) {
                this.updateCurrentSession();
                this.saveStats();
            }
        }, 30000);
    }

    async onTabChanged(tabId) {
        // Stop tracking current tab
        this.stopTracking();
        
        // Start tracking new tab
        try {
            const tab = await chrome.tabs.get(tabId);
            if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('edge://')) {
                this.startTracking(tabId, tab.url);
            }
        } catch (error) {
            // Tab might not exist anymore
            console.log('Tab not found:', tabId);
        }
    }

    startTracking(tabId, url) {
        this.activeTabId = tabId;
        this.activeUrl = url;
        this.startTime = Date.now();
        
        console.log('Started tracking:', url);
    }

    stopTracking() {
        if (this.activeTabId && this.startTime) {
            this.updateCurrentSession();
            this.saveStats();
        }
        
        this.activeTabId = null;
        this.activeUrl = null;
        this.startTime = null;
    }

    updateCurrentSession() {
        if (!this.startTime || !this.activeUrl) return;
        
        const sessionTime = Date.now() - this.startTime;
        const hostname = this.extractHostname(this.activeUrl);
        
        // Update total time
        this.stats.totalTime += sessionTime;
        
        // Update site-specific time
        if (!this.stats.sites[hostname]) {
            this.stats.sites[hostname] = 0;
        }
        this.stats.sites[hostname] += sessionTime;
        
        // Update category time
        const category = this.categorizeWebsite(hostname);
        this.stats.categories[category] += sessionTime;
        
        // Reset start time for next session
        this.startTime = Date.now();
        
        console.log(`Updated stats for ${hostname}: +${Math.round(sessionTime/1000)}s`);
    }

    extractHostname(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.replace('www.', '');
        } catch (error) {
            return 'unknown';
        }
    }

    categorizeWebsite(hostname) {
        for (const [category, sites] of Object.entries(this.siteCategories)) {
            if (sites.some(site => hostname.includes(site))) {
                return category;
            }
        }
        return 'other';
    }

    async trackActiveTab() {
        try {
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs.length > 0) {
                this.onTabChanged(tabs[0].id);
            }
        } catch (error) {
            console.error('Error getting active tab:', error);
        }
    }
}

// Message handling for popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getStats') {
        chrome.storage.local.get(['browsingStats']).then((result) => {
            sendResponse(result.browsingStats || {});
        });
        return true; // Indicates async response
    }
});

// Initialize the browsing tracker
const tracker = new BrowsingTracker();
