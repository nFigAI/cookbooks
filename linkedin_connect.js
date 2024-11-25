import { NfigClient } from 'nfig-sdk';
import { chromium } from "playwright";
const main = async () => {
    const browserContext = await chromium.launchPersistentContext('/tmp/chrome/test', {
        executablePath:'/home/mishal/Downloads/inbox/chrome-linux64/chrome',
        headless: false,
    });

    const page = await browserContext.newPage();
    const nfig = new NfigClient({
        apiKey: "API_KEY",
        browserMode: "LOCAL",
  });

    const session = await nfig.createSession({ currentPage: page });
    console.log("session", session);

    try {
        await nfig.act("Go to https://www.linkedin.com/in/mishalat/");
        await nfig.act("await 3 secs");
        await nfig.act("click on the connect button");
        await nfig.act("wait for 3 seconds")
        await nfig.act("click on Add note")
        await nfig.act("wait for 3 seconds")
        await nfig.act("Type 'Hello Would Love To Connect'")
        await nfig.act("Click on the send button")
        console.log("clicked")
       } catch (error) {
        console.error(error.message);
    }
};

(async () => {
    await main();
})();
