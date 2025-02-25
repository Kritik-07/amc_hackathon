chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "analyze_site") {
        let url = message.url;
        let domain = new URL(url).hostname;

        // Predefined website classification
        const SAFE_SITES = [
            "www.google.com",
            "www.wikipedia.org",
            "www.github.com"
        ];
        
        const PHISHING_SITES = [
            "phishing.testing.google.test",
            "www.fakebank.com",
            "www.unsafe-login.net"
        ];
        
        const MALICIOUS_SITES = [
            "malware.testing.google.test",
            "www.wicar.org",
            "www.virus-infected-site.com"
        ];

        let result;
        if (PHISHING_SITES.includes(domain)) {
            result = "🚨 WARNING: Phishing site detected!";
            updateStoredStatistics("phishing");
        } else if (MALICIOUS_SITES.includes(domain)) {
            result = "☠️ ALERT: Malicious site detected!";
            updateStoredStatistics("phishing"); // Malicious sites also count as phishing for stats
        } else if (SAFE_SITES.includes(domain)) {
            result = "✅ This site is safe to use.";
            updateStoredStatistics("safe");
        } else {
            result = "⚠️ Unknown site – Proceed with caution.";
            updateStoredStatistics("unknown");
        }

        sendResponse({ result });
    }
});

// Function to update statistics in chrome.storage
function updateStoredStatistics(siteType) {
    chrome.storage.local.get(["totalScans", "safeSites", "phishingSites"], (data) => {
        let totalScans = (data.totalScans || 0) + 1;
        let safeSites = data.safeSites || 0;
        let phishingSites = data.phishingSites || 0;

        if (siteType === "safe") {
            safeSites += 1;
        } else if (siteType === "phishing") {
            phishingSites += 1;
        }

        chrome.storage.local.set({ totalScans, safeSites, phishingSites });
    });
}
