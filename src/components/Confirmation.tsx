type ConfirmationProps = { name: string; reference: string };

export function Confirmation({ name, reference }: ConfirmationProps) {
  return (
    <section
      className="confirmation"
      role="status"
      aria-labelledby="confirmation-heading"
    >
      <div className="confirmation-mark" aria-hidden="true">
        ✓
      </div>
      <p className="eyebrow">All set</p>
      <h2 id="confirmation-heading">Thanks, {name}!</h2>
      <p>Your order is confirmed. We’ll take it from here.</p>
      <div className="reference-card">
        <span>Order reference</span>
        <strong>{reference}</strong>
      </div>
    </section>
  );
}
