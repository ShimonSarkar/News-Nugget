"use server";

import puppeteer from "puppeteer";
import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function sendPromptToChatGPT(prompt: string) {
  console.log(prompt);
  const apiUrl = "https://api.openai.com/v1/chat/completions";

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${OPENAI_API_KEY}`,
  };

  const data = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1000,
  };

  try {
    const response = await axios.post(apiUrl, data, { headers });
    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error(
      "Error communicating with the ChatGPT API:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to get response from ChatGPT");
  }
}

export async function scrapeArticle({ url }: { url: string }): Promise<string> {
  let browser;
  try {
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });
    const page = await browser.newPage();

    console.log(`Navigating to URL: ${url}`);
    await page.goto(url, { waitUntil: "networkidle2" });
    console.log(`Page loaded: ${url}`);

    await page.waitForSelector("body");
    console.log("Body selector found");

    const content = await page.evaluate(() => {
      const selectors = [
        "p",
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6",
        "li",
        "blockquote",
        "pre",
      ];

      let textContent = "";
      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((element) => {
          // @ts-ignores
          textContent += element.innerText + "\n";
        });
      });

      return textContent.replace(/\s\s+/g, " ").trim();
    });

    await browser.close();
    return content;
  } catch (error) {
    if (browser) await browser.close();
    console.error("Error scraping article:", error);
    throw new Error("Failed to scrape article");
  }
}

export async function scrapeAndSummarizeArticle(url: string): Promise<string> {
  try {
    const content = await scrapeArticle({ url });
    const summaryPrompt = `Please provide a robust and comprehensive summary of the following article content, phrased as it would be in the New York Times. Retain all key parts and provide context if possible. Additionally, provide a suitable title for the article. The format should be *Title:* (title content) and *Article:* (article content). Indicate paragraph breaks using ***:\n\n${content}`;
    // const summary = await sendPromptToChatGPT(summaryPrompt);
    return summaryPrompt;
  } catch (error: any) {
    console.error("Error scraping and summarizing article:", error);
    throw new Error(`Failed to scrape and summarize article: ${error.message}`);
  }
}
