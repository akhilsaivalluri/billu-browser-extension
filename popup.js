// Billu Knows Best - Popup Script

class BilluPopup {
    constructor() {
        this.settingsPanel = null;
        this.azureConfig = null;
        this.init();
    }

    async init() {
        console.log('Initializing Billu Popup');
        
        // Load Azure OpenAI configuration
        await this.loadAzureConfig();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Load browsing stats
        await this.loadBrowsingStats();
        
        // Load wisdom
        this.loadWisdom();
        
        console.log('Billu Popup initialized');
    }

    async loadAzureConfig() {
        try {
            const result = await chrome.storage.local.get(['azureOpenAIConfig']);
            this.azureConfig = result.azureOpenAIConfig || {
                endpoint: '',
                apiKey: '',
                deployment: 'gpt-4o',
                apiVersion: '2024-12-01-preview'
            };
            
            // Populate form fields if config exists
            if (this.azureConfig.endpoint) {
                document.getElementById('api-endpoint').value = this.azureConfig.endpoint;
            }
            if (this.azureConfig.apiKey) {
                document.getElementById('api-key').value = this.azureConfig.apiKey;
            }
            if (this.azureConfig.deployment) {
                document.getElementById('deployment-name').value = this.azureConfig.deployment;
            }
            if (this.azureConfig.apiVersion) {
                document.getElementById('api-version').value = this.azureConfig.apiVersion;
            }
            
        } catch (error) {
            console.error('Error loading Azure config:', error);
        }
    }

    setupEventListeners() {
        // Settings button
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.showSettings();
        });

        // Close settings button
        document.getElementById('close-settings').addEventListener('click', () => {
            this.hideSettings();
        });

        // Save settings button
        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveSettings();
        });

        // Test connection button
        document.getElementById('test-connection').addEventListener('click', () => {
            this.testConnection();
        });

        // New tab button
        document.getElementById('open-newtab').addEventListener('click', () => {
            chrome.tabs.create({ url: chrome.runtime.getURL('newtab.html') });
            window.close();
        });

        // Reset stats button
        document.getElementById('reset-stats').addEventListener('click', () => {
            this.resetStats();
        });

        // Click outside settings to close
        document.addEventListener('click', (e) => {
            const settingsPanel = document.getElementById('settings-panel');
            const settingsBtn = document.getElementById('settings-btn');
            
            if (settingsPanel.style.display === 'block' && 
                !settingsPanel.contains(e.target) && 
                !settingsBtn.contains(e.target)) {
                this.hideSettings();
            }
        });
    }

    showSettings() {
        const settingsPanel = document.getElementById('settings-panel');
        settingsPanel.style.display = 'block';
        settingsPanel.scrollIntoView({ behavior: 'smooth' });
    }

    hideSettings() {
        const settingsPanel = document.getElementById('settings-panel');
        settingsPanel.style.display = 'none';
    }

    async saveSettings() {
        const endpoint = document.getElementById('api-endpoint').value.trim();
        const apiKey = document.getElementById('api-key').value.trim();
        const deployment = document.getElementById('deployment-name').value.trim();
        const apiVersion = document.getElementById('api-version').value.trim();

        // Validate inputs
        if (!endpoint || !apiKey || !deployment || !apiVersion) {
            this.showStatus('Please fill in all fields', 'error');
            return;
        }

        // Validate endpoint format
        if (!endpoint.startsWith('https://') || !endpoint.includes('openai.azure.com')) {
            this.showStatus('Please enter a valid Azure OpenAI endpoint', 'error');
            return;
        }

        // Prepare config object
        const config = {
            endpoint: endpoint.endsWith('/') ? endpoint : endpoint + '/',
            apiKey: apiKey,
            deployment: deployment,
            apiVersion: apiVersion
        };

        try {
            // Save to storage
            await chrome.storage.local.set({ azureOpenAIConfig: config });
            this.azureConfig = config;
            
            this.showStatus('Configuration saved successfully!', 'success');
            
            // Hide settings panel after 2 seconds
            setTimeout(() => {
                this.hideSettings();
            }, 2000);
            
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showStatus('Error saving configuration', 'error');
        }
    }

    async testConnection() {
        const endpoint = document.getElementById('api-endpoint').value.trim();
        const apiKey = document.getElementById('api-key').value.trim();
        const deployment = document.getElementById('deployment-name').value.trim();
        const apiVersion = document.getElementById('api-version').value.trim();

        if (!endpoint || !apiKey || !deployment || !apiVersion) {
            this.showStatus('Please fill in all fields first', 'error');
            return;
        }

        this.showStatus('Testing connection...', 'info');

        try {
            const testEndpoint = endpoint.endsWith('/') ? endpoint : endpoint + '/';
            const response = await fetch(`${testEndpoint}openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': apiKey
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: "user",
                            content: "Hello, this is a test message."
                        }
                    ],
                    max_tokens: 10,
                    temperature: 0.1
                })
            });

            if (response.ok) {
                this.showStatus('Connection successful! ✅', 'success');
            } else {
                const errorData = await response.json();
                this.showStatus(`Connection failed: ${errorData.error?.message || 'Unknown error'}`, 'error');
            }

        } catch (error) {
            console.error('Connection test error:', error);
            this.showStatus('Connection failed: Network error', 'error');
        }
    }

    showStatus(message, type) {
        const statusDiv = document.getElementById('settings-status');
        statusDiv.textContent = message;
        statusDiv.className = `settings-status ${type}`;
        statusDiv.style.display = 'block';

        // Auto-hide after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                statusDiv.style.display = 'none';
            }, 5000);
        }
    }

    async loadBrowsingStats() {
        try {
            const result = await chrome.storage.local.get(['browsingStats']);
            const stats = result.browsingStats || {
                totalTime: 0,
                sites: {},
                categories: { work: 0, social: 0, entertainment: 0, shopping: 0, news: 0, other: 0 }
            };

            // Update UI
            this.updateStatsUI(stats);
            
        } catch (error) {
            console.error('Error loading browsing stats:', error);
        }
    }

    updateStatsUI(stats) {
        // Update total time (convert from milliseconds to minutes)
        const totalMinutes = Math.floor(stats.totalTime / 60000);
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        document.getElementById('today-time').textContent = `${hours}h ${minutes}m`;

        // Find most visited site
        const topSite = this.getTopSite(stats.sites);
        document.getElementById('top-site').textContent = topSite || 'No data';
    }

    getTopSite(sites) {
        if (!sites || Object.keys(sites).length === 0) return null;
        
        let topSite = null;
        let maxTime = 0;
        
        for (const [site, time] of Object.entries(sites)) {
            if (time > maxTime) {
                maxTime = time;
                topSite = site;
            }
        }
        
        return topSite;
    }

    loadWisdom() {
        const wisdomTexts = [
            "Your digital habits shape your real life. Choose mindfully! 🌟",
            "Progress over perfection, always! 📈",
            "Small actions compound into big results! 🚀",
            "Remember to take breaks and stretch! 🧘‍♀️",
            "You're doing better than you think! 💪",
            "Focus on what you can control! 🎯",
            "Every website visit is a choice - make it count! ⚡",
            "Your future self will thank you for good habits! 🙏",
            "Quality over quantity in everything you do! ✨",
            "Stay hydrated and keep being awesome! 💧"
        ];

        const randomWisdom = wisdomTexts[Math.floor(Math.random() * wisdomTexts.length)];
        document.getElementById('wisdom').textContent = randomWisdom;
    }

    async resetStats() {
        try {
            const emptyStats = {
                totalTime: 0,
                sites: {},
                categories: { work: 0, social: 0, entertainment: 0, shopping: 0, news: 0, other: 0 }
            };
            
            await chrome.storage.local.set({ 
                browsingStats: emptyStats,
                lastResetDate: new Date().toDateString()
            });
            
            this.updateStatsUI(emptyStats);
            
            // Show temporary confirmation
            const resetBtn = document.getElementById('reset-stats');
            const originalText = resetBtn.innerHTML;
            resetBtn.innerHTML = '<span class="btn-icon">✅</span>Reset';
            resetBtn.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                resetBtn.innerHTML = originalText;
                resetBtn.style.backgroundColor = '';
            }, 2000);
            
        } catch (error) {
            console.error('Error resetting stats:', error);
        }
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BilluPopup();
});
