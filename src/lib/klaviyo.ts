/**
 * Klaviyo client-side list subscriptions (popup and footer newsletter).
 *
 * TODO (team): create/confirm a "Welcome 10%" list in Klaviyo with a flow
 * that sends the one-time 10% code, and put its id in SIGNUP_LIST_ID.
 * `XdjM7r` is the "Waitlist Pre-Launch" list and is only a placeholder.
 * German sign-ups need double opt-in: turn it on for this list in Klaviyo
 * (List settings → Opt-in process → Double opt-in).
 */

const KLAVIYO_COMPANY_ID = "YiRTrJ";
export const SIGNUP_LIST_ID = "XdjM7r";

export async function subscribeEmail(email: string, source: string, language?: string): Promise<void> {
  const res = await fetch(`https://a.klaviyo.com/client/subscriptions/?company_id=${KLAVIYO_COMPANY_ID}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", revision: "2024-10-15" },
    body: JSON.stringify({
      data: {
        type: "subscription",
        attributes: {
          custom_source: source,
          profile: {
            data: {
              type: "profile",
              attributes: { email, ...(language ? { properties: { language } } : {}) },
            },
          },
        },
        relationships: { list: { data: { type: "list", id: SIGNUP_LIST_ID } } },
      },
    }),
  });
  if (!res.ok) throw new Error(`Klaviyo ${res.status}`);
}
