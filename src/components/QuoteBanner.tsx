// components/QuoteBanner.tsx
import { Card } from "react-bootstrap";

interface QuoteBannerProps {
  verse: string;
  saintQuote: string;
}

export default function QuoteBanner({ verse, saintQuote }: QuoteBannerProps) {
  return (
    <Card className="my-3 shadow-sm text-center bg-light border-0">
      <Card.Body>
        <h5 className="text-primary">Versículo do Dia</h5>
        <blockquote className="blockquote mb-3">
          <p>{verse}</p>
        </blockquote>
        <h6 className="text-secondary">Frase de Santo</h6>
        <blockquote className="blockquote">
          <p>{saintQuote}</p>
        </blockquote>
      </Card.Body>
    </Card>
  );
}
