import { chromium } from "playwright";
import { NfigClient } from 'nfig-sdk';
import { z } from "zod";


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
        await nfig.act("Go to airbnb");
        await nfig.act("wait for 2 secs");
        await nfig.act("search the location as  himachal pradesh");
        await nfig.act("wait for 2 secs");
        await nfig.act("select the location as  himachal pradesh");
        await nfig.act("wait for 2 secs");
        await nfig.act('click on the check in date');
        await nfig.act("wait for 2 secs");
        await nfig.act('choose the date as december 15 2024')
        await nfig.act("wait for 2 secs");
        await nfig.act('click on the checkout')
        await nfig.act("wait for 2 secs");
        await nfig.act('choose the checkout date as december 20 2024')
        await nfig.act("wait for 2 secs");
        await nfig.act('click on the guests')
        await nfig.act("wait for 2 secs");
        await nfig.act('choose the number of guests as two adults')
        await nfig.act("wait for 2 secs");
        await nfig.act('click on the search button')
        console.log("click completed");
        const answer = await nfig.ask("Get the first 5 hotel names", {
            schema: z.object({
                links: z.array(z.string()),
            }),
        });
        console.log(answer);
    } catch (error) {
        console.error(error.message);
    }
};

(async () => {
    await main();
})();
