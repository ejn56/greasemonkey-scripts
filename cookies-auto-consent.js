// ==UserScript==
// @name            Cookie auto-agree
// @description     Automatically click the "I Agree" cookie consent button on multiple websites: Youtube, Google, Leboncoin, Ebay, etc
// @match           https://consent.youtube.com/*
// @match           https://consent.google.com/*
// @match           https://consent.google.fr/*
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
// @require         http://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==

'use strict';
// Here we need to declare all the jQuery types in order for tslint to recognize them
const $ = window.$; // Trick tslint into recognizing the jquery '$' character
const jQuery = window.jQuery;

clickCookieButtonIfPresent(location.hostname);

function findCookieButton(hostname) {
    switch (hostname) {
        case "consent.youtube.com":
        case "consent.google.fr":
        case "consent.google.com":
        case "www.google.com":
        case "www.google.fr":
            log("site=youtube/google");
            return $('span,div').filter(function() {return ["J'accepte", "I agree"].includes($(this).text());});
        case "www.leboncoin.fr":
            log("site=leboncoin");
            return $("#didomi-notice-disagree-button");
        case "www.boursorama.com":
        case "clients.boursorama.com":
            log("site=boursorama");
            return $(".didomi-continue-without-agreeing");
        case "unix.stackexchange.com":
            log("site=unix stackexchange");
            return $(".js-consent-banner-hide");
        case "www.ebay.fr":
            log("site=ebay");
            return $("#gdpr-banner-accept");
        case "superuser.com":
            log("site=superuser.com");
            return $(".js-consent-banner-hide");
        case "www.lemonde.fr":
            log("site=lemonde.fr");
            return $("[data-gdpr-expression='denyAll']");
    }
}

function clickCookieButtonIfPresent(hostname) {
    addEventListener("load", () => {
        const waitMs = 200;
        const timeoutMs = 20 * 1000;
        log("Checking every " + waitMs + "ms...");
        let count = 0;
        const h = setInterval(() => {
            const cookieButton = findCookieButton(hostname);
            if (cookieButton) {
                if (cookieButton instanceof jQuery){
                    cookieButton.each(function() {$(this).click();});
                } else {
                    cookieButton.click();
                }
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
