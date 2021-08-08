// ==UserScript==
// @name            Cookie auto-agree
// @description     Automatically click the "I Agree" cookie consent button on multiple websites: Youtube, Google, Leboncoin, Ebay, etc
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
// @match           https://superuser.com/*
// @match           https://www.lemonde.fr/*
// @updateURL       https://raw.githubusercontent.com/ejn56/greasemonkey-scripts/main/cookies-auto-consent.js
// @downloadURL     https://raw.githubusercontent.com/ejn56/greasemonkey-scripts/main/cookies-auto-consent.js
// @author          ejn56
// @grant           none
// @run-at          document-end
// ==/UserScript==

'use strict';

let elementFinder = buildElementFinder(location.hostname);
clickIfPresent(elementFinder);

function buildElementFinder(hostname) {
    switch (hostname) {
        case "consent.youtube.com":
        case "consent.google.fr":
        case "consent.google.com":
            log("site=youtube/google");
            return () => Array.from(document.querySelectorAll("span")).find(sp => ["J'accepte", "I agree"].includes(sp.innerHTML));
        case "www.leboncoin.fr":
            log("site=leboncoin");
            return () => document.getElementById("didomi-notice-disagree-button");
        case "www.boursorama.com":
        case "clients.boursorama.com":
            log("site=boursorama");
            return () => document.querySelector(".didomi-continue-without-agreeing");
        case "unix.stackexchange.com":
            log("site=unix stackexchange");
            return document.querySelector(".js-consent-banner-hide");
        case "www.google.com":
        case "www.google.fr":
            log("site=google");
            return () => Array.from(document.querySelectorAll("div")).find(el => ["J'accepte", "I agree"].includes(el.innerHTML));
        case "www.ebay.fr":
            log("site=ebay");
            return () => Array.from(document.querySelectorAll("button")).find(el => el.innerHTML === "Accepter");
        case "superuser.com":
            log("site=superuser.com");
            return () => document.querySelector(".js-consent-banner-hide");
        case "www.lemonde.fr":
            log("site=lemonde.fr");
            return () => document.querySelector('[data-gdpr-expression="denyAll"]');
    }
}

function clickIfPresent(elementFinder) {
    addEventListener("load", () => {
        const waitMs = 200;
        const timeoutMs = 20 * 1000;
        log("Checking every " + waitMs + "ms...");
        let count = 0;
        const h = setInterval(() => {
            const toClick = elementFinder();
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
