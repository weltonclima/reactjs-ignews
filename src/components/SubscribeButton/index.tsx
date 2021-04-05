
import { signIn, useSession } from "next-auth/client";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss"

export function SubscriberButton() {
  const [session] = useSession();

  async function handlesubscriber() {
    if (!session) {
      return signIn('github');
    }

    try {
      const { data } = await api.post('/subscriber');
      const { sessionId } = data;

      const stripe = await getStripeJs();
      await stripe.redirectToCheckout({sessionId});
    }catch (err) {
      alert(err.message);
    }
  }

  return (
    <button
      type="button"
      className={styles.sbscriberButton}
      onClick={handlesubscriber}
    >
      Subscribe Now
    </button>
  );
}