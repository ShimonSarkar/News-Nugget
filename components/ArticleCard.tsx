import Link from "next/link";

interface ArticleCardProps {
  title: string;
  href: string;
  source: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ title, href, source }) => {
  return (
    <div className="article-card">
      <Link
        href={{
          pathname: `/article/${encodeURIComponent(title)}`,
          query: { href },
        }}
        passHref
      >
        <h3 className="source">{source}</h3>
        <h3>{title}</h3>
      </Link>
    </div>
  );
};

export default ArticleCard;
