import { NfigClient } from 'nfig-sdk';
import { chromium } from "playwright";
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
        await nfig.act("Go to https://markmanson.net/not-giving-a-fuck");
        await nfig.act("read through the whole blog");
        const linkPost = await nfig.ask("generate me 5 twitter posts");
        await nfig.act(`go to https://write-box.appspot.com/`);
        await nfig.act(`wait 3 seconds`);
        await nfig.act(`click on the X close button of the pop up`);
        await nfig.act(`click on the notepad white text area`);
        await nfig.act(`type in the following text: ${JSON.stringify(linkPost)}`);
    } catch (error) {
        console.error(error.message);
    }
};

(async () => {
    await main();
})();
