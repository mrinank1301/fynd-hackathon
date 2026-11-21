import { useState } from "react";
import { CheckoutForm } from "../../../src/components/CheckoutForm";

export function FormHarness() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  return (
    <div style={{ width: 420 }}>
      <CheckoutForm
        name={name}
        error={
          submitted && !name.trim() ? "Please enter your name to continue." : ""
        }
        submitting={false}
        disabled={false}
        onNameChange={setName}
        onSubmit={() => setSubmitted(true)}
      />
    </div>
  );
}
