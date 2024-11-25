import { NfigClient } from "nfig-sdk";
import { z } from "zod";
import { chromium } from "playwright";

async function importESModule() {
  // Launching Chrome in persistent context mode
  const browser = await chromium.launchPersistentContext("/tmp/chrome/test", {
    executablePath: "/usr/bin/google-chrome", // Adjust based on your Chrome installation path
    headless: false,
  });
  const page = await browser.newPage();

  // Define schema for tech stack extraction
  const techStackSchema = z.object({
    jobTitle: z.string(),
    techStack: z.array(z.string()),
  });

  // Initialize NfigClient
  const nfig = new NfigClient({
    apiKey: "",
    browserMode: "LOCAL",
    debug: true,
  });

  const session = await nfig.createSession({ currentPage: page });
  console.log("session", session);

  try {
    // Navigate to the Cerebras Systems LinkedIn page
    await nfig.act("Go to https://www.linkedin.com/company/stripe/");

    // Navigate to the job postings section
    await nfig.act("Go to job postings section of the company");

    // Handle scrolling to find 'Show all jobs' button
    let visible = false;
    let endofPage = false;

    while (!visible && !endofPage) {
      await nfig.act("Scroll down if 'Show all jobs' is not visible");
      const visibleResponse = await nfig.ask("Is 'Show all jobs' visible?", {
        schema: z.object({ visible: z.boolean() }),
      });
      visible = visibleResponse.answer.visible;

      const endOfPageResponse = await nfig.ask("Is End of Page reached?", {
        schema: z.object({ endofPage: z.boolean() }),
      });
      endofPage = endOfPageResponse.answer.endofPage;

      console.log("Visible:", visible, "End of Page:", endofPage);
    }

    if (visible) {
      await nfig.act("Click on 'Show all jobs'");
    } else {
      console.error("Could not find the 'Show all jobs' button");
      return [];
    }

    // Extract job details for the top 5 jobs
    const techStacks = [];
    for (let i = 1; i <= 3; i++) {
      await nfig.act(`Click on job listing number ${i} in the current page`);
      // await nfig.act(`Scroll to job listing number ${i}`);
      await nfig.act("Wait for 4 seconds");

      await page.evaluate(() => {
        const jobDetailsSection = document.querySelector(
          ".jobs-search__job-details--wrapper "
        );
        if (jobDetailsSection) {
          jobDetailsSection.scrollBy(0, 1300); // Scroll down by 200 pixels
        }
      });
      await nfig.act("Wait for 4 seconds");

      // Extract tech stack information
      const techStackResponse = await nfig.ask(
        "Extract the job title and the technologies required for this job. Provide the output as an object with 'jobTitle' and 'techStack' properties. The 'techStack' should be an array of technologies (e.g., 'Python', 'JavaScript').",
        {
          schema: techStackSchema,
        }
      );

      if (techStackResponse.status && techStackResponse.answer) {
        console.log(`Tech Stack for job ${i}:`, techStackResponse.answer);
        techStacks.push(techStackResponse.answer);
      } else {
        console.warn(`Failed to extract data for job ${i}`);
      }

      await nfig.act("Go back to the job listing page.");
    }

    // console.log("Raw Extracted Tech Stacks:", techStacks);
    const techStackstring = JSON.stringify(techStacks);
    // Ask for final aggregated tech stack summary
    const aggregatedTechStackResponse = await nfig.ask(
      `Use the extracted tech stacks to find all the unique technologies used in the company. Provide the output as an array of unique technologies. ${techStackstring}`,
      {
        schema: z.object({
          aggregatedTechStack: z.array(z.string()),
        }),
      }
    );

    console.log(
      "Aggregated Tech Stack:",
      aggregatedTechStackResponse.answer.aggregatedTechStack
    );

    // await nfig.endSession();
  } catch (error) {
    console.error("Task Failed:", error.message);
  } finally {
    await nfig.endSession(); // Ensure cleanup always happens
  }
}

importESModule();
