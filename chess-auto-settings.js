// ==UserScript==
// @name         Chess.com auto-settings
// @version      1.0
// @match        https://www.chess.com
// @match        https://www.chess.com/play/online
// @match        https://www.chess.com/settings
// @match        https://www.chess.com/settings/live
// @match        https://www.chess.com/settings/themes
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
// @grant        none
// ==/UserScript==


'use strict';
/* globals rxjs */
// rxjs: https://cdnjs.cloudflare.com/ajax/libs/rxjs/6.6.0/rxjs.umd.js


const ROOT_URL = 'https://www.chess.com';
const PATH = {
   play : {
       online: 'play/online'
   },
   settings: {
       live: 'settings/live',
       themes: 'settings/themes'
   }
}


console.info('chess script start');

run();

function run() {
    findButtonsAndClickThem().then(maybeGoToNextPage);
}

function maybeGoToNextPage() {
    if (location.pathname.endsWith('play/online') && !hasRun('settings')) {
        markAsRun('settings');
        setTimeout(() => goTo(PATH.settings.themes), 1000);
    } else if (location.pathname.endsWith('settings')) {
        goTo(PATH.settings.themes);
    } else if (location.pathname.endsWith('settings/themes')) {
        setTimeout(() => goTo(PATH.settings.live), 1000);
    } else if (location.pathname.endsWith('settings/live')) {
        setTimeout(() => goTo(PATH.play.online), 1000);
    }
}

async function findButtonsAndClickThem() {
    const buttonFinders = getButtonsOrFinders();
    if (!buttonFinders.length) {
        log("Nothing to click => abort");
    } else {
        log("Buttons found => clicking...");
        await clickButtons(buttonFinders);
    }
}

function getButtonsOrFinders() {
    if (location.pathname === '/') {
        return [document.querySelector('.index-guest-button')];
    } else if (location.pathname.endsWith('play/online')) {
        return [
            () => document.querySelectorAll(".authentication-intro-name-v5")[2],
            () => document.getElementById("guest-button"),
        ];
    } else if (location.pathname.endsWith('settings/live')) {
        const toggleSelector = '.cc-switch-checkbox';
        const toggles = [
            document.querySelectorAll(toggleSelector)[0],
            document.querySelectorAll(toggleSelector)[1],
            document.querySelectorAll(toggleSelector)[5]
        ].filter(e => !e?.checked);
        if (toggles.length) toggles.push(document.getElementById('live_chess_save'));
        return toggles;
    } else if (location.pathname.endsWith('settings/themes') && !hasRun('settings/themes')) {
        return [
            () => {
                markAsRun('settings/themes');
                return document.querySelector('.settings-themes-walnut');
            }
        ];
    } else {
        return [];
    }
}

async function clickButtons(buttonsOrFunctions) {
    const reversedButtonsOrFunctions = buttonsOrFunctions.reverse();
    while (reversedButtonsOrFunctions.length) {
        await timer();
        const next = reversedButtonsOrFunctions.pop();
        const button = typeof next === 'function' ? next() : next;
        button?.click();
    }
}

function log(message) {
    console.log("[Tampermonkey cookie auto-agree] " + message);
}

async function timer(timerMs = 300) {
    return await new Promise(res => setTimeout(res, timerMs));
}

function hasRun(key) {
    return localStorage.getItem(key);
}

function markAsRun(key) {
    localStorage.setItem(key, true);
}

function goTo(relativePath) {
    window.location.href = ROOT_URL + '/' + relativePath;
}
