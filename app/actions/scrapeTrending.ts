"use server";

import axios from "axios";
import { load } from "cheerio";

interface Topic {
  text: string;
  href: string;
  divContent: string;
}

export async function scrapeTrendingTopics({
  url,
}: {
  url: string;
}): Promise<Topic[]> {
  try {
    const { data } = await axios.get(url);
    const $ = load(data);
    const topics: Topic[] = [];

    $("article").each((i, elem) => {
      const link = $(elem).find("a.gPFEn").first();
      const href = "https://news.google.com" + link.attr("href");
      const text = link.text().trim();
      const divContent = $(elem).find("div.vr1PYe").text().trim();

      if (href && text) {
        topics.push({ text, href, divContent });
      }
    });

    return topics;
  } catch (error) {
    console.error("Error scraping trending topics:", error);
    throw new Error("Failed to scrape trending topics");
  }
}
