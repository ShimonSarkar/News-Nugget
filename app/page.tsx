"use client";

import { useEffect, useState } from "react";
import { scrapeTrendingTopics } from "./actions/scrapeTrending";
import ArticleCard from "@/components/ArticleCard";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Landing from "@/components/Landing";

const LINKS = {
  USA: "https://news.google.com/topics/CAAqIggKIhxDQkFTRHdvSkwyMHZNRGxqTjNjd0VnSmxiaWdBUAE?hl=en-US&gl=US&ceid=US%3Aen",
  WORLD:
    "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx1YlY4U0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen",
  BUSINESS:
    "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGx6TVdZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen",
  TECHNOLOGY:
    "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen",
  ENTERTAINMENT:
    "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNREpxYW5RU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen",
  SPORTS:
    "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp1ZEdvU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen",
  SCIENCE:
    "https://news.google.com/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRFp0Y1RjU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US%3Aen",
  HEALTH:
    "https://news.google.com/topics/CAAqIQgKIhtDQkFTRGdvSUwyMHZNR3QwTlRFU0FtVnVLQUFQAQ?hl=en-US&gl=US&ceid=US%3Aen",
};

interface Topic {
  text: string;
  href: string;
  divContent: string;
}

function Home() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selected, setSelected] = useState<string>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  const fetchTopics = async (url: string) => {
    setSelected(url);
    setCurrentPage(1);
    setLoading(true);
    try {
      const topics = await scrapeTrendingTopics({ url });
      setTopics(topics);
    } catch (error) {
      console.error("Failed to fetch topics", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics(LINKS.USA);
    setSelected(LINKS.USA);
  }, []);

  // Calculate the current topics to display based on pagination
  const indexOfLastTopic = currentPage * itemsPerPage;
  const indexOfFirstTopic = indexOfLastTopic - itemsPerPage;
  const currentTopics = topics.slice(indexOfFirstTopic, indexOfLastTopic);

  // Generate page numbers for pagination controls
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(topics.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <Landing />
      <div className="outside-button-container">
        <div className="button-container">
          <button
            className={selected === LINKS.USA ? "active" : ""}
            onClick={() => fetchTopics(LINKS.USA)}
          >
            USA
          </button>
          <button
            className={selected === LINKS.WORLD ? "active" : ""}
            onClick={() => fetchTopics(LINKS.WORLD)}
          >
            World
          </button>
          <button
            className={selected === LINKS.BUSINESS ? "active" : ""}
            onClick={() => fetchTopics(LINKS.BUSINESS)}
          >
            Business
          </button>
          <button
            className={selected === LINKS.TECHNOLOGY ? "active" : ""}
            onClick={() => fetchTopics(LINKS.TECHNOLOGY)}
          >
            Technology
          </button>
          <button
            className={selected === LINKS.ENTERTAINMENT ? "active" : ""}
            onClick={() => fetchTopics(LINKS.ENTERTAINMENT)}
          >
            Entertainment
          </button>
          <button
            className={selected === LINKS.SPORTS ? "active" : ""}
            onClick={() => fetchTopics(LINKS.SPORTS)}
          >
            Sports
          </button>
          <button
            className={selected === LINKS.SCIENCE ? "active" : ""}
            onClick={() => fetchTopics(LINKS.SCIENCE)}
          >
            Science
          </button>
          <button
            className={selected === LINKS.HEALTH ? "active" : ""}
            onClick={() => fetchTopics(LINKS.HEALTH)}
          >
            Health
          </button>
        </div>
      </div>
      <div className="article-container">
        {loading ? (
          <div className="spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
        ) : (
          <div>
            {currentTopics.map((topic, index) => (
              <ArticleCard
                key={index}
                title={topic.text}
                href={topic.href}
                source={topic.divContent}
              />
            ))}
          </div>
        )}
      </div>
      {!loading && (
        <div className="outside-button-container">
          <div className="button-container">
            {pageNumbers.map((number) => (
              <button
                className={currentPage === number ? "active" : ""}
                key={number}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
