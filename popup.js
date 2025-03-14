document.addEventListener("DOMContentLoaded", function () {
    const timeList = document.getElementById("time-list");
    const clearDataBtn = document.getElementById("clear-data");

    if (!timeList || !clearDataBtn) {
        console.error("Required elements not found in popup.html");
        return;
    }

    // Load time data from storage
    chrome.storage.local.get("timeSpent", (data) => {
        const timeSpent = data.timeSpent || {};
        timeList.innerHTML = Object.keys(timeSpent)
            .map(domain => `<li>${domain}: ${formatTime(timeSpent[domain])}</li>`)
            .join("");
    });

    // Clear data on button click
    clearDataBtn.addEventListener("click", () => {
        chrome.storage.local.set({ timeSpent: {} }, () => {
            timeList.innerHTML = "";
        });
    });
});

// Convert milliseconds to minutes & seconds
function formatTime(ms) {
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    return `${minutes}m ${seconds}s`;
}
