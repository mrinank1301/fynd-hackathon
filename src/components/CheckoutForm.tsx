type CheckoutFormProps = {
  name: string;
  error: string;
  submitting: boolean;
  disabled: boolean;
  onNameChange: (value: string) => void;
  onSubmit: () => void;
};

export function CheckoutForm({
  name,
  error,
  submitting,
  disabled,
  onNameChange,
  onSubmit,
}: CheckoutFormProps) {
  return (
    <form
      className="checkout-form"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Almost yours</p>
          <h2>Delivery details</h2>
        </div>
        <span className="step-pill">1 of 1</span>
      </div>
      <label className="field-label" htmlFor="customer-name">
        Your name <span aria-hidden="true">*</span>
      </label>
      <input
        id="customer-name"
        name="name"
        autoComplete="name"
        placeholder="e.g. Alex Morgan"
        value={name}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? "checkout-error" : undefined}
        onChange={(event) => onNameChange(event.target.value)}
      />
      {error && (
        <p className="validation-message" id="checkout-error" role="alert">
          {error}
        </p>
      )}
      <p className="form-note">
        We’ll use this to address your order confirmation.
      </p>
      <button
        className="button button-accent place-order"
        type="submit"
        disabled={disabled || submitting}
      >
        {submitting ? "Placing order…" : "Place order"}{" "}
        <span aria-hidden="true">→</span>
      </button>
      <p className="secure-note">
        <span aria-hidden="true">✓</span> Secure, simple, and ready to go
      </p>
    </form>
  );
}
