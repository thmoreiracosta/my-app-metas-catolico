// components/NewsTicker.tsx
import { useEffect, useState } from "react";
import "./NewsTicker.css";

interface NewsItem {
  title: string;
  url: string;
}

export default function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("https://newsdata.io/api/1/news?apikey=YOUR_API_KEY&country=br,us&language=pt");
        const data = await res.json();
        const articles = data.results.slice(0, 10).map((item: any) => ({
          title: item.title,
          url: item.link
        }));
        setNews(articles);
      } catch (error) {
        console.error("Erro ao carregar notícias:", error);
      }
    }
    fetchNews();
  }, []);

  return (
    <div className="news-ticker bg-dark text-light py-2 px-3 overflow-hidden">
      <div className="ticker-track">
        {news.map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="me-4 text-warning text-decoration-none"
          >
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );
}
