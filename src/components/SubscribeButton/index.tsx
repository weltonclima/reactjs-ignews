import { Session } from "next-auth";
import { signIn, useSession } from "next-auth/client";
import { useRouter } from "next/dist/client/router";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-js";
import styles from "./styles.module.scss"

interface SessionProps extends Session {
  activeSubscription: string;
}

export function SubscriberButton() {
  const [session] = useSession() ;
  const router = useRouter();
  const user = session as SessionProps

  async function handlesubscriber() {
    if (!session) {
      return signIn('github');
    }

    if(user.activeSubscription){
      return router.push('/posts');
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