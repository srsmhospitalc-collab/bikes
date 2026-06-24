// RichAds Initialize
window.TelegramAdsController = new TelegramAdsController();
window.TelegramAdsController.initialize({
    pubId: "1013423", // Tera pubId
    appId: "7744", // Tera appId
    debug: false // Live me false rakhna
});

// Native Ad Function - Har level ke baad call hoga
function showNativeAd() {
    window.TelegramAdsController.triggerNativeNotification().then((result) => {
        console.log('Native ad shown:', result);
    }).catch((err) => {
        console.log('No ad available:', err);
    });
}

// Rewarded Ad Function - Hint ya Extra Tube ke liye
function showRewardedAd(type) {
    Telegram.WebApp.showConfirm('Watch ad to get ' + type + '?', (confirmed) => {
        if(confirmed) {
            window.TelegramAdsController.triggerNativeNotification().then((result) => {
                // resolve = User ne ad dekha
                if(type === 'hint') {
                    Telegram.WebApp.showAlert('Hint: Top wali ball ko khali tube me daalo!');
                } else if(type === 'tube') {
                    tubes.push([]); // Extra khali tube de do
                    renderTubes();
                    Telegram.WebApp.showAlert('Extra tube mil gaya!');
                }
            }).catch((result) => {
                Telegram.WebApp.showAlert('Ad load nahi hua. Try again.');
            });
        }
    });
}

// Page load pe ek native ad dikha de
setTimeout(showNativeAd, 2000);
