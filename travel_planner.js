import { NfigClient } from 'nfig-sdk';
import { z } from "zod";
import { chromium } from "playwright";

const main = async () => {
  const browser = await chromium.launch({
    healess: false,
    executablePath:'/home/mishal/Downloads/inbox/chrome-linux64/chrome'
  })

  const page = await browser.newPage()
  const nfig = new NfigClient({
        apiKey: "API_KEY",
        browserMode: "LOCAL",
  });


    const session = await nfig.createSession({ currentPage: page });
    console.log("session", session);

    try {
        await nfig.act("Go to https://thehosteller.com");

        const locations = await nfig.ask("Go through all the locations present", {
            schema: z.object({
                locations: z.array(z.string()),
            }),
        });

        const bestPlace = await nfig.ask("Which place is the best to visit on December and January?", {
            schema: z.object({
                bestPlace: z.string(),
            }),
        });

        console.log("Best place to visit in December and January:", bestPlace);
    } catch (error) {
        console.error(error.message);
    }
};

(async () => {
    await main();
})();
