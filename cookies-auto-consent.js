// ==UserScript==
// @name         Cookie auto-agree
// @description  Automatically click on the "I Agree" button on Youtube/Google/Leboncoin/Ebay/Boursorama/UnixStackexchange cookie consent pages
// @match           https://consent.youtube.com/*
// @match           https://consent.google.com/*
// @match           https://www.youtube.com/*
// @match           https://www.google.com/*
// @match           https://www.google.fr/*
// @match           https://www.leboncoin.fr/*
// @match           https://www.ebay.fr/*
// @match           https://www.boursorama.com/*
// @match           https://clients.boursorama.com/*
// @match           https://unix.stackexchange.com/*
// @updateURL       https://raw.githubusercontent.com/ejn56/greasemonkey-scripts/main/cookies-auto-consent.js
// @downloadURL     https://raw.githubusercontent.com/ejn56/greasemonkey-scripts/main/cookies-auto-consent.js
// @author          ejn56
// @grant           none
// @run-at          document-end
// ==/UserScript==

'use strict';

switch (location.hostname) {
    case "consent.youtube.com":
    case "consent.google.fr":
    case "consent.google.com":
        log("site=youtube/google");
        clickIfPresent(() => Array.from(document.querySelectorAll("span")).find(sp => ["J'accepte", "I agree"].includes(sp.innerHTML)));
        break;
    case "www.leboncoin.fr":
        log("site=leboncoin");
        clickIfPresent(() => document.getElementById("didomi-notice-disagree-button"));
        break;
    case "www.boursorama.com":
    case "clients.boursorama.com":
        log("site=boursorama");
        clickIfPresent(() => document.querySelector(".didomi-continue-without-agreeing"));
        break;
    case "unix.stackexchange.com":
        log("site=unix stackexchange");
        clickIfPresent(() => document.querySelector(".js-consent-banner-hide"));
        break;
    case "www.google.com":
    case "www.google.fr":
        log("site=google");
        clickIfPresent(() => Array.from(document.querySelectorAll("div")).find(el => ["J'accepte", "I agree"].includes(el.innerHTML)));
        break;
    case "www.ebay.fr":
        log("site=ebay");
        clickIfPresent(() => Array.from(document.querySelectorAll("button")).find(el => el.innerHTML === "Accepter"));
        break;
}

function clickIfPresent(findElementToClick) {
    addEventListener("load", () => {
        const waitMs = 200;
        const timeoutMs = 20 * 1000;
        log("Checking every " + waitMs + "ms...");
        let count = 0;
        const h = setInterval(() => {
            const toClick = findElementToClick();
            if (toClick) {
                toClick.click();
                log("Cookie-agreement button clicked");
                clearInterval(h);
            } else if (++count * waitMs > timeoutMs) {
                // Stop the loop if it has been running for too long
                log("No cookie-agreement button to click was found => stop the script");
                clearInterval(h);
            }
        }, waitMs);
    });
}

function log(message) {
    console.log("[Tampermonkey cookie auto-agree] " + message)
}
