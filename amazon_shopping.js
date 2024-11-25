import { chromium } from "playwright";
import { NfigClient } from 'nfig-sdk';


const main = async () => {
    const browser = await chromium.launch({
        headless: false,
    });
    const page = await browser.newPage();
    const nfig = new NfigClient({
        apiKey: "API_KEY",
        browserMode: "LOCAL",
  });
    const session = await nfig.createSession({ currentPage: page });

    console.log("session", session);
    try {
        await nfig.act("Go to amazon.in");
        await nfig.act("wait for 2 secs");
        await nfig.act("search for iphone 16");
        await nfig.act("wait for 2 secs");
        await nfig.act("click on search");
        await nfig.act("wait for 2 secs");
        await nfig.act("scroll down");
        await nfig.act("click on the first search result");
        await nfig.act("click on add to cart")
    } catch (error) {
        console.error(error.message);
    }
};

(async () => {
    await main();
})();
