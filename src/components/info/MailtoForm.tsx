import { useState, type FormEvent } from "react";

/**
 * A short form that sends itself as an email to Lore (opens the visitor's
 * email app, prefilled) and then shows a confirmation.
 *
 * Interim: replace with the returns / subscription app's own form or a form
 * endpoint before launch, so the request reaches Lore without an email app
 * and the visitor gets an automatic receipt.
 */

export interface Field {
  name: string;
  label: string;
  type?: "text" | "email" | "date";
  required?: boolean;
  autoComplete?: string;
}

const MailtoForm = ({
  fields,
  submitLabel,
  subject,
  doneTitle,
  doneBody,
}: {
  fields: Field[];
  submitLabel: string;
  subject: (values: Record<string, string>) => string;
  doneTitle: string;
  doneBody: string;
}) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const body = fields.map((f) => `${f.label}: ${values[f.name] ?? ""}`).join("\n");
    window.location.href = `mailto:info@lore-organics.com?subject=${encodeURIComponent(subject(values))}&body=${encodeURIComponent(body)}`;
    setDone(true);
  };

  if (done) {
    return (
      <div className="rounded-xl bg-sage-light/40 p-6 md:p-8" role="status">
        <p className="t-h3 mb-2">{doneTitle}</p>
        <p className="t-body text-foreground/80">{doneBody}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {fields.map((f) => (
        <div key={f.name}>
          <label htmlFor={`f-${f.name}`} className="text-label mb-2 block text-muted-foreground">
            {f.label}
          </label>
          <input
            id={`f-${f.name}`}
            name={f.name}
            type={f.type ?? "text"}
            required={f.required}
            autoComplete={f.autoComplete}
            value={values[f.name] ?? ""}
            onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
            className="h-12 w-full rounded-lg border border-border bg-background px-4 text-[15px] focus:border-primary focus:outline-none"
          />
        </div>
      ))}
      <button type="submit" className="btn-primary">
        {submitLabel}
      </button>
    </form>
  );
};

export default MailtoForm;
