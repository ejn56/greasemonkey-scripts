// ==UserScript==
// @name         Leboncoin auto refresh leboncoin search + bell sound for new results
// @description  Leboncoin auto refresh search tab + little bell sound when new results pop up
// @version      1.0.3
// @match        https://www.leboncoin.fr/mes-recherches
// @grant        none
// @author       ejn56
// @run-at       document-end
// @downloadURL  https://raw.githubusercontent.com/ejn56/greasemonkey-scripts/main/leboncoin-bell-notification.js
// @updateURL  https://raw.githubusercontent.com/ejn56/greasemonkey-scripts/main/leboncoin-bell-notification.js
// ==/UserScript==

// The sound notification to play when new results appear
const notificationSoundUrl = "https://raw.githubusercontent.com/ejn56/greasemonkey-scripts/main/bell_low_pitch.mp3";
// Number of seconds to wait for the page to load
const pageLoadWaitSec = navigator.platform === "Linux armv7l" ? 15 : 2;
// Random reload interval
const minutesBeforeReload = Math.floor(Math.random() * 10) + 10;
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
setTimeout(() => {
    window.location.href = window.location.href;
}, minutesBeforeReload * 60 * 1000);

// ======= Utility functions =======

// The tab title to display when new results appear
function buildTitle(icon) {
    const currentDate = new Date();
    const currentTimestamp = dateToString(currentDate);
    const nextReloadTimestamp = dateToString(new Date(currentDate.getTime() + minutesBeforeReload * 1000 * 60));
    return "(" + icon + currentTimestamp + "  ⟳" + nextReloadTimestamp + ") " + document.title;
}

function dateToString(date) {
    const minutes = date.getMinutes();
    return date.getHours() + ":" + (minutes < 10 ? "0" + minutes : minutes);
}
