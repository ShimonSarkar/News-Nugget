"use client";

import { useEffect, useState } from "react";
import { scrapeAndSummarizeArticle } from "@/app/actions/scrapeArticle";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Page = () => {
  const [href, setHref] = useState("");
  const [content, setContent] = useState<any>();
  const [loading, setLoading] = useState(true);

  const fetchArticle = async () => {
    setLoading(true);
    try {
      const article = await scrapeAndSummarizeArticle(href);
      setContent(parseResponse(article));
    } catch {
      console.log("Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const href = params.get("href") || "";
    setHref(href);
  }, []);

  useEffect(() => {
    if (href !== "") {
      fetchArticle();
    }
  }, [href]);

  const parseResponse = (response: any) => {
    const titleMatch = response.match(/Title:\s*\*(.*)/);
    const articleMatch = response.match(/Article:\s*\*([\s\S]*)/);

    const title = titleMatch ? titleMatch[1].trim() : "No title found";
    const article = articleMatch
      ? articleMatch[1].replace(/\*\*\*/g, "<br><br>").trim()
      : "No article content found";

    return { title, article };
  };

  return (
    <div className="article-summary-container">
      {loading ? (
        <div className="summary-loading">
          <i className="fas fa-spinner fa-spin"></i>
        </div>
      ) : (
        <div>
          <h1>{content.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: content.article }} />
          <a
            href={href}
            className="view-original"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Original
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="icon" />
          </a>
        </div>
      )}
    </div>
  );
};

export default Page;
