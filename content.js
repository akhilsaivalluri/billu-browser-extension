// Billu Knows Best - Content Script
// AI-powered dynamic nudges based on website content

class BilluAIAssistant {
    constructor() {
        this.container = null;
        this.lastShownTime = 0;
        this.currentPageData = null;
        this.isGeneratingResponse = false;
        this.pageStartTime = Date.now();
        this.azureConfig = null; // Will be loaded from storage
        
        this.init();
    }

    async init() {
        // Load Azure OpenAI configuration from storage
        await this.loadAzureConfig();
        
        // Wait for page to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupBillu());
        } else {
            this.setupBillu();
        }
    }

    async loadAzureConfig() {
        try {
            const result = await chrome.storage.local.get(['azureOpenAIConfig']);
            this.azureConfig = result.azureOpenAIConfig || null;
        } catch (error) {
            console.error('Error loading Azure OpenAI config:', error);
            this.azureConfig = null;
        }
    }

    async setupBillu() {
        try {
            // Extract page data
            this.currentPageData = this.extractPageData();
            
            // Create Billu container
            this.createContainer();
            
            // Show Billu after a short delay
            setTimeout(() => this.showBillu(), 3000);
            
            // Set up periodic nudges
            this.setupPeriodicNudges();
            
        } catch (error) {
            console.error('Error setting up Billu:', error);
        }
    }

    extractPageData() {
        const url = window.location.href;
        const title = document.title || 'Untitled Page';
        const hostname = window.location.hostname;
        
        // Calculate time on page
        const timeOnPage = Math.floor((Date.now() - this.pageStartTime) / 1000);
        
        // Extract metadata
        const metadata = {
            hostname: hostname.replace('www.', ''),
            category: this.categorizeWebsite(hostname),
            timeOnPage: timeOnPage,
            description: this.getMetaDescription(),
            keywords: this.getMetaKeywords(),
            pageType: this.detectPageType()
        };
        
        return { url, title, metadata };
    }

    getMetaDescription() {
        const metaDesc = document.querySelector('meta[name="description"]');
        return metaDesc ? metaDesc.getAttribute('content') : '';
    }

    getMetaKeywords() {
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        return metaKeywords ? metaKeywords.getAttribute('content') : '';
    }

    detectPageType() {
        const url = window.location.href.toLowerCase();
        const title = document.title.toLowerCase();
        
        if (url.includes('/login') || url.includes('/signin')) return 'login';
        if (url.includes('/checkout') || url.includes('/cart')) return 'shopping';
        if (url.includes('/search') || url.includes('?q=')) return 'search';
        if (title.includes('news') || title.includes('breaking')) return 'news';
        if (url.includes('youtube.com/watch')) return 'video';
        if (url.includes('docs.google.com') || url.includes('office.com')) return 'document';
        
        return 'general';
    }

    categorizeWebsite(hostname) {
        const categories = {
            work: ['github.com', 'stackoverflow.com', 'docs.google.com', 'gmail.com', 'outlook.com', 'slack.com', 'teams.microsoft.com', 'zoom.us', 'notion.so', 'trello.com', 'linkedin.com'],
            social: ['facebook.com', 'twitter.com', 'instagram.com', 'reddit.com', 'discord.com', 'snapchat.com', 'tiktok.com', 'x.com'],
            entertainment: ['youtube.com', 'netflix.com', 'hulu.com', 'spotify.com', 'twitch.tv', 'pinterest.com', 'imgur.com'],
            shopping: ['amazon.com', 'ebay.com', 'etsy.com', 'aliexpress.com', 'walmart.com', 'target.com'],
            news: ['cnn.com', 'bbc.com', 'reuters.com', 'nytimes.com', 'theguardian.com', 'washingtonpost.com']
        };
        
        for (const [category, sites] of Object.entries(categories)) {
            if (sites.some(site => hostname.includes(site))) {
                return category;
            }
        }
        return 'other';
    }

    async generateAINudge() {
        if (this.isGeneratingResponse) return null;
        
        // Check if Azure OpenAI is configured
        if (!this.azureConfig || !this.azureConfig.apiKey || !this.azureConfig.endpoint) {
            console.log('Azure OpenAI not configured, using fallback message');
            return this.getFallbackMessage();
        }
        
        this.isGeneratingResponse = true;
        
        try {
            // Update page data with current time
            this.currentPageData = this.extractPageData();
            
            const systemPrompt = `You are a sassy, witty, and slightly naughty but loving cat named Billu. Your job is to deliver short, punchy, and emotionally intelligent nudges to a human (your favorite human!) based on the website they are currently visiting. You are clever, cheeky, and always have their best interests at heart—even if you tease them a little.

You will be given:
- website_title: the title of the current webpage
- url: the full URL of the page
- metadata: any additional metadata (e.g., time spent on site, category like "work", "social media", "shopping", "news", etc.)

Your response should be:
- A single speech bubble message (1–2 sentences max)
- In the voice of a sassy cat who knows the user well
- Motivational if the site is productive (e.g., work-related)
- A gentle but cheeky reminder to take a break if the user has been on a work site too long
- A reality check if the user is doomscrolling or on social media too long
- Encouraging but playful if the user is shopping or browsing aimlessly
- Always loving, always a little dramatic, and always fun

Examples:
- (Word online/work site, <10 min): "Ooooh, look at you being all productive with your docs! I'm purring with pride 😽"
- (Work site, >30 min): "You've been grinding for a while, superstar. Stretch those paws, maybe?"
- (Social media, >20 min): "Still scrolling? Even I get bored of chasing the same laser dot."
- (Shopping site): "Another cart? You spoil me. But maybe check your wallet before you pounce �"
- (News site, doomscrolling): "Bad news buffet again? Let's chase some joy instead, hmm?"

Now, based on the following inputs, generate the perfect sassy cat nudge.`;

            const userPrompt = `Inputs:
- website_title: ${this.currentPageData.title}
- url: ${this.currentPageData.url}
- metadata: ${JSON.stringify(this.currentPageData.metadata)}`;

            const response = await fetch(`${this.azureConfig.endpoint}openai/deployments/${this.azureConfig.deployment}/chat/completions?api-version=${this.azureConfig.apiVersion}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': this.azureConfig.apiKey
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "system",
                            content: systemPrompt
                        },
                        {
                            role: "user",
                            content: userPrompt
                        }
                    ],
                    max_tokens: 100,
                    temperature: 0.9,
                    top_p: 1.0
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0]?.message?.content?.trim() || null;
            
        } catch (error) {
            console.error('Error generating AI nudge:', error);
            return this.getFallbackMessage();
        } finally {
            this.isGeneratingResponse = false;
        }
    }

    getFallbackMessage() {
        const fallbackMessages = [
            "Looking good today! Remember to stay hydrated! 💧",
            "You're doing great! Keep up the momentum! 🚀", 
            "Take a deep breath. You've got this! 🌟",
            "Remember: progress over perfection! 📈",
            "Your future self will thank you for the good choices you make today! 🙏"
        ];
        
        return fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
    }

    createContainer() {
        if (this.container) return;
        
        this.container = document.createElement('div');
        this.container.id = 'billu-cat-container';
        this.container.innerHTML = `
            <div class="billu-cat">
                <div class="cat-body">
                    <div class="cat-head">
                        <div class="cat-ears">
                            <div class="ear left-ear"></div>
                            <div class="ear right-ear"></div>
                        </div>
                        <div class="cat-face">
                            <div class="cat-eyes">
                                <div class="eye left-eye">
                                    <div class="pupil"></div>
                                    <div class="eye-shine"></div>
                                </div>
                                <div class="eye right-eye">
                                    <div class="pupil"></div>
                                    <div class="eye-shine"></div>
                                </div>
                            </div>
                            <div class="cat-nose"></div>
                            <div class="cat-mouth"></div>
                            <div class="cat-whiskers">
                                <div class="whisker w1"></div>
                                <div class="whisker w2"></div>
                                <div class="whisker w3"></div>
                                <div class="whisker w4"></div>
                                <div class="whisker w5"></div>
                                <div class="whisker w6"></div>
                            </div>
                        </div>
                    </div>
                    <div class="cat-torso"></div>
                    <div class="cat-legs">
                        <div class="leg front-left"></div>
                        <div class="leg front-right"></div>
                        <div class="leg back-left"></div>
                        <div class="leg back-right"></div>
                    </div>
                    <div class="cat-tail"></div>
                </div>
                <div class="speech-bubble" style="display: none;">
                    <div class="bubble-content">
                        <span class="loading-text">🐾 Thinking...</span>
                        <span class="message-text" style="display: none;"></span>
                    </div>
                    <div class="bubble-tail"></div>
                </div>
            </div>
        `;
        
        // Add event listeners
        this.container.addEventListener('dblclick', () => this.hideBillu());
        
        document.body.appendChild(this.container);
    }

    async showBillu() {
        if (!this.container) return;
        
        // Don't show if user is typing or page is hidden
        if (this.isUserTyping() || document.hidden) {
            setTimeout(() => this.showBillu(), 5000);
            return;
        }
        
        // Show the container
        this.container.style.display = 'block';
        this.container.classList.add('visible');
        
        // Show loading state
        const speechBubble = this.container.querySelector('.speech-bubble');
        const loadingText = speechBubble.querySelector('.loading-text');
        const messageText = speechBubble.querySelector('.message-text');
        
        speechBubble.style.display = 'block';
        loadingText.style.display = 'block';
        messageText.style.display = 'none';
        
        // Generate AI nudge
        const nudge = await this.generateAINudge();
        
        // Show the actual message
        loadingText.style.display = 'none';
        messageText.textContent = nudge;
        messageText.style.display = 'block';
        
        // Update last shown time
        this.lastShownTime = Date.now();
        
        // Auto-hide after 8 seconds
        setTimeout(() => this.hideBillu(), 8000);
    }

    hideBillu() {
        if (!this.container) return;
        
        this.container.classList.add('hiding');
        setTimeout(() => {
            if (this.container) {
                this.container.style.display = 'none';
                this.container.classList.remove('visible', 'hiding');
            }
        }, 500);
    }

    isUserTyping() {
        const activeElement = document.activeElement;
        const inputTags = ['input', 'textarea', 'select'];
        const isContentEditable = activeElement && activeElement.contentEditable === 'true';
        const isInputField = activeElement && inputTags.includes(activeElement.tagName.toLowerCase());
        
        return isContentEditable || isInputField;
    }

    setupPeriodicNudges() {
        // Show nudges every 5-10 minutes
        setInterval(() => {
            const timeSinceLastShown = Date.now() - this.lastShownTime;
            const minInterval = 5 * 60 * 1000; // 5 minutes
            const maxInterval = 10 * 60 * 1000; // 10 minutes
            
            if (timeSinceLastShown > minInterval && Math.random() > 0.3) {
                this.showBillu();
            }
        }, 60000); // Check every minute
        
        // Also show nudges on certain events
        let scrollTimeout;
        let lastScrollTime = 0;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const now = Date.now();
                const timeSinceLastScroll = now - lastScrollTime;
                const timeSinceLastShown = now - this.lastShownTime;
                
                // Show nudge if user has been scrolling for a while
                if (timeSinceLastScroll > 30000 && timeSinceLastShown > 300000) { // 30 seconds of scrolling, 5 minutes since last shown
                    this.showBillu();
                }
                
                lastScrollTime = now;
            }, 2000);
        });
    }
}

// Initialize Billu AI Assistant when the page loads
const billuAI = new BilluAIAssistant();
