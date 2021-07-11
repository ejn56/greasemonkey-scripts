// ==UserScript==
// @name         Youtube/Google/Leboncoin/Ebay cookie auto agree
// @description  Automatically click on the "I Agree" button on YouTube/Google/Leboncoin/Ebay cookie consent pages
// @match        https://consent.youtube.com/*
// @match        https://consent.google.com/*
// @match        https://www.youtube.com/*
// @match        https://www.google.com/*
// @match        https://www.google.fr/*
// @match        https://www.leboncoin.fr/*
// @match        https://www.ebay.fr/*
// @author       ejn56
// @grant        none
// @run-at       document-end
// ==/UserScript==

switch (location.hostname) {
    case "consent.youtube.com":
    case "consent.google.fr":
    case "consent.google.com":
        clickIfPresent(Array.from(document.querySelectorAll("span")).find(sp => ["J'accepte", "I agree"].includes(sp.innerHTML)));
        break;
    case "www.leboncoin.fr":
        clickIfPresent(Array.from(document.querySelectorAll("span")).find(sp => sp.innerHTML === "Continuer sans accepter"));
        break;
    case "www.google.com":
    case "www.google.fr":
        clickIfPresent(Array.from(document.querySelectorAll("div")).find(el => ["J'accepte", "I agree"].includes(el.innerHTML)).parentNode);
        break;
    case "www.ebay.fr":
        clickIfPresent(Array.from(document.querySelectorAll("button")).find(el => el.innerHTML === "Accepter"));
        break;
}

function clickIfPresent(toClick) {
    addEventListener("load", () => {
        const h = setInterval(() => {
            if (toClick) {
                toClick.click();
                clearInterval(h);
            }
        }, 200);
    });
}
