import { Confirmation } from "../components/Confirmation";

type ThankYouPageProps = {
  name: string;
  reference: string;
  onNavigate: (path: string) => void;
};

export function ThankYouPage({
  name,
  reference,
  onNavigate,
}: ThankYouPageProps) {
  return (
    <div className="page-content thank-you-page">
      <p className="eyebrow">Order complete</p>
      <h1>Thank you for shopping with us.</h1>
      <Confirmation name={name} reference={reference} />
      <button
        className="button button-dark"
        onClick={() => onNavigate("/products")}
      >
        Continue shopping
      </button>
    </div>
  );
}
