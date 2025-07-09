// Billu Knows Best - New Tab Page JavaScript

class NewTabManager {
    constructor() {
        this.currentEngine = 'google';
        this.searchEngines = {
            google: 'https://www.google.com/search?q=',
            bing: 'https://www.bing.com/search?q=',
            duckduckgo: 'https://duckduckgo.com/?q='
        };
        
        this.wisdomQuotes = [
            "The internet is vast, but your time is not. Choose wisely!",
            "Every website you visit is a choice. Make it count!",
            "Focus is not about saying yes to the thing you've got to focus on. It's about saying no to the hundred other good ideas.",
            "The best way to take care of the future is to take care of the present moment.",
            "Your attention is your most valuable currency. Spend it mindfully!",
            "Progress, not perfection. Small steps lead to big changes!",
            "The internet can be a tool or a trap. You choose which one!",
            "Mindful browsing leads to mindful living. Meow!",
            "Quality over quantity - in websites and in life!",
            "Remember: You're in control of your digital habits, not the other way around!"
        ];

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
        console.log('Initializing NewTabManager');
        
        this.setupSearchFunctionality();
        await this.loadBrowsingStats();
        this.displayRandomWisdom();
        this.setupQuickLinks();
        this.updateStats();
        
        // Update stats every 30 seconds
        setInterval(() => {
            this.loadBrowsingStats().then(() => {
                this.updateStats();
            });
        }, 30000);
        
        console.log('NewTabManager initialized with stats:', this.stats);
    }

    setupSearchFunctionality() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const engineBtns = document.querySelectorAll('.engine-btn');

        // Handle search
        const performSearch = () => {
            const query = searchInput.value.trim();
            if (query) {
                // Check if it's a URL
                if (this.isURL(query)) {
                    window.location.href = query.startsWith('http') ? query : 'https://' + query;
                } else {
                    // Search using selected engine
                    window.location.href = this.searchEngines[this.currentEngine] + encodeURIComponent(query);
                }
            }
        };

        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Handle search engine selection
        engineBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                engineBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentEngine = btn.dataset.engine;
            });
        });

        // Focus on search input when page loads
        searchInput.focus();
    }

    isURL(string) {
        try {
            new URL(string);
            return true;
        } catch {
            // Check for domain-like patterns
            const domainPattern = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
            return domainPattern.test(string) || string.includes('.');
        }
    }

    async loadBrowsingStats() {
        try {
            const result = await chrome.storage.local.get(['browsingStats', 'lastResetDate']);
            const today = new Date().toDateString();
            
            console.log('Loading browsing stats:', result);
            
            if (!result.browsingStats || result.lastResetDate !== today) {
                // Reset stats for new day
                this.stats = {
                    totalTime: 0,
                    sites: {},
                    categories: { work: 0, social: 0, entertainment: 0, shopping: 0, news: 0, other: 0 }
                };
                await chrome.storage.local.set({
                    browsingStats: this.stats,
                    lastResetDate: today
                });
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
            console.error('Error loading browsing stats:', error);
            this.stats = {
                totalTime: 0,
                sites: {},
                categories: { work: 0, social: 0, entertainment: 0, shopping: 0, news: 0, other: 0 }
            };
        }
    }

    updateStats() {
        console.log('Updating stats display with:', this.stats);
        this.updateTimeDisplay();
        this.updateTopSite();
        this.updateCategoryBreakdown();
    }

    updateTimeDisplay() {
        const totalMinutes = Math.floor((this.stats.totalTime || 0) / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        
        const timeDisplay = `${hours}h ${minutes}m`;
        console.log('Setting time display to:', timeDisplay);
        
        const timeElement = document.getElementById('total-time');
        if (timeElement) {
            timeElement.textContent = timeDisplay;
        }
    }

    updateTopSite() {
        const topSiteElement = document.getElementById('top-site');
        if (!topSiteElement) return;
        
        if (!this.stats.sites || Object.keys(this.stats.sites).length === 0) {
            topSiteElement.textContent = 'No sites visited yet';
            return;
        }

        const topSite = Object.entries(this.stats.sites)
            .sort(([,a], [,b]) => b - a)[0];
        
        if (topSite) {
            const siteName = topSite[0].replace('www.', '');
            const timeSpent = Math.floor(topSite[1] / 60000);
            topSiteElement.textContent = timeSpent > 0 ? `${siteName} (${timeSpent}m)` : siteName;
        } else {
            topSiteElement.textContent = 'No sites visited yet';
        }
    }

    updateCategoryBreakdown() {
        const categories = this.stats.categories || { work: 0, social: 0, entertainment: 0, shopping: 0, news: 0, other: 0 };
        const totalTime = this.stats.totalTime || 0; // Use total time from stats instead of category sum
        
        console.log('Updating category breakdown:', categories, 'Total time:', totalTime);
        
        Object.entries(categories).forEach(([category, time]) => {
            const percentage = totalTime > 0 ? (time / totalTime) * 100 : 0;
            const minutes = Math.floor(time / 60000);
            
            const fillElement = document.querySelector(`.category-fill.${category}`);
            const timeElement = document.querySelector(`.category-item:has(.category-fill.${category}) .category-time`);
            
            if (fillElement) {
                fillElement.style.width = `${percentage}%`;
            }
            if (timeElement) {
                timeElement.textContent = `${minutes}m`;
            }
        });
    }

    displayRandomWisdom() {
        const wisdomElement = document.getElementById('daily-wisdom');
        const randomQuote = this.wisdomQuotes[Math.floor(Math.random() * this.wisdomQuotes.length)];
        wisdomElement.textContent = randomQuote;
    }

    setupQuickLinks() {
        const quickLinksGrid = document.getElementById('quick-links-grid');
        
        const defaultLinks = [
            { name: 'Gmail', url: 'https://gmail.com', icon: '📧' },
            { name: 'Calendar', url: 'https://calendar.google.com', icon: '📅' },
            { name: 'GitHub', url: 'https://github.com', icon: '🐙' },
            { name: 'YouTube', url: 'https://youtube.com', icon: '📺' },
            { name: 'Netflix', url: 'https://netflix.com', icon: '🎬' },
            { name: 'LinkedIn', url: 'https://linkedin.com', icon: '💼' },
            { name: 'Reddit', url: 'https://reddit.com', icon: '🔴' },
            { name: 'Amazon', url: 'https://amazon.com', icon: '📦' }
        ];

        defaultLinks.forEach(link => {
            const linkElement = document.createElement('a');
            linkElement.href = link.url;
            linkElement.className = 'quick-link';
            linkElement.innerHTML = `
                <div class="quick-link-icon">${link.icon}</div>
                <div class="quick-link-name">${link.name}</div>
            `;
            quickLinksGrid.appendChild(linkElement);
        });
    }

    categorizeWebsite(hostname) {
        for (const [category, sites] of Object.entries(this.siteCategories)) {
            if (sites.some(site => hostname.includes(site))) {
                return category;
            }
        }
        return 'other';
    }
}

// Initialize the new tab manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new NewTabManager();
});
