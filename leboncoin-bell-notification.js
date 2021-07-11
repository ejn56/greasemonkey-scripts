// ==UserScript==
// @name         Leboncoin auto refresh leboncoin search + bell sound for new results
// @description  Leboncoin auto refresh search tab + little bell sound when new results pop up
// @match        https://www.leboncoin.fr/mes-recherches
// @grant        none
// @run-at       document-end
// ==/UserScript==

// The sound notification to play when new results appear
const notificationSoundUrl = "https://raw.githubusercontent.com/ledestin/twitch-chat-sound-enchantment/main/sounds/bell-candle-damper.mp3"; // "https://files.catbox.moe/m8rq8g.mp3"
// Number of seconds to wait for the page to load
const pageLoadWaitSec = navigator.platform === "Linux armv7l" ? 15 : 2;
// Random reload interval
let minutesBeforeReload = Math.floor(Math.random() * 10) + 10;
// The expected number of results for a notification to be triggered
let resultsCount = '4';

setTimeout(() => { // Wait for the page to load before checking the results
    if(Array.from(document.querySelectorAll("div")).filter(sp => sp.innerHTML === resultsCount)[0]) {
        // New results have appeared: update title + play sound
        new Audio(notificationSoundUrl).play();
        document.title = buildTitle("♥");
    } else {
        // No new results: update title
        document.title = buildTitle("✓");
    }
}, pageLoadWaitSec * 1000);

// Refresh the tab every X minutes
setTimeout(() => location.reload(true), minutesBeforeReload * 60 * 1000);

// ======= Utility functions =======

// The tab title to display when new results appear
function buildTitle(icon) {
    const nextReloadDate = new Date(new Date().getTime() + minutesBeforeReload * 1000 * 60);
    const currentTimestamp = new Date().getHours() + ":" + new Date().getMinutes();
    const nextReloadTimestamp = nextReloadDate.getHours() + ":" +
          (nextReloadDate.getMinutes() < 10 ? "0" + nextReloadDate.getMinutes() : nextReloadDate.getMinutes());
    return "(" + icon + currentTimestamp + " => ⟳" + nextReloadTimestamp + ") " + document.title;
}
