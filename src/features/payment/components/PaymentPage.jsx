import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useDispatch, useSelector } from 'react-redux';
import { confirmPayment, selectClientSecret } from '../paymentSlice';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { Spinner } from 'react-bootstrap';

const stripePromise = loadStripe(import.meta.env.VITE_Publishable_Key); //  public key only on frontend

 const CheckoutForm = ({ clientSecret }) => {
  // import.meta.env.VITE_Success_Url
  const appUrl=import.meta.env.VITE_API_URL
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    //  Stripe collects and tokenizes card — you never touch card data
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${appUrl}/payments/payment-success`,
      },
      redirect: 'if_required'
    });

    if (error) {
      toast.error(error.message);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      //  Send only the paymentIntentId to your backend
      await dispatch(confirmPayment({ paymentIntentId: paymentIntent.id }));
      navigate('/payments/payment-success');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement /> {/* Stripe's hosted UI — no raw card data touches your code */}
      <button type="submit">Pay</button>
    </form>
  );
};

// Wrap with Elements provider
export const PaymentPage = () => {

  const clientSecret = useSelector(selectClientSecret); // ✅ already there
  const loading = useSelector(state => state.payment.loading);

  if (loading || !clientSecret) return <Spinner />;
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm clientSecret={clientSecret} />
    </Elements>
  );
};