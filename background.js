let activeTabId = null;
let startTime = null;
let timeSpent = {};

// Function to update time spent on a domain
function updateTimeSpent(tabId, changeInfo, tab) {
    if (changeInfo.status !== "complete" || !tab.url) return;

    const url = new URL(tab.url);
    const domain = url.hostname;

    // Stop tracking previous tab
    if (activeTabId && startTime) {
        const elapsedTime = Date.now() - startTime;
        chrome.storage.local.get("timeSpent", (data) => {
            const storedTime = data.timeSpent || {};
            storedTime[domain] = (storedTime[domain] || 0) + elapsedTime;
            chrome.storage.local.set({ timeSpent: storedTime });
        });
    }

    // Start tracking new tab
    activeTabId = tabId;
    startTime = Date.now();
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener(updateTimeSpent);

// Listen for tab switches
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        if (chrome.runtime.lastError || !tab || !tab.url) return;
        updateTimeSpent(activeInfo.tabId, { status: "complete" }, tab);
    });
});

// Track when a tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabId === activeTabId && startTime) {
        const elapsedTime = Date.now() - startTime;
        chrome.storage.local.get("timeSpent", (data) => {
            const storedTime = data.timeSpent || {};
            storedTime[activeTabId] = (storedTime[activeTabId] || 0) + elapsedTime;
            chrome.storage.local.set({ timeSpent: storedTime });
        });
    }
});
