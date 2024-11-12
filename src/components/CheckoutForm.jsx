// src/components/CheckoutForm.jsx

import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Button } from './ui/Button';

export default function CheckoutForm({
  selectedPack,
  discordId,
  setPurchaseMessage,
  setSelectedGooPack,
  refreshUserData,
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  // Obtener la URL del backend desde las variables de entorno
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    try {
      // Enviar solicitud POST al backend para crear un PaymentIntent
      const response = await axios.post(`${BACKEND_URL}/api/create-payment-intent`, {
        amount: selectedPack.price * 100, // Convertir a centavos
        discordId: discordId,
      });

      const clientSecret = response.data.clientSecret;

      // Confirmar el pago con Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          metadata: {
            discordId: discordId,
          },
        },
      });

      if (result.error) {
        console.error('Payment failed:', result.error);
        setPurchaseMessage(`Payment failed: ${result.error.message}`);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          setPurchaseMessage(`Payment successful! You bought ${selectedPack.amount} Venom Goo.`);
          setSelectedGooPack(null);
          refreshUserData();
        }
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      // Mostrar mensaje de error detallado si está disponible
      setPurchaseMessage(error.response?.data?.error || 'Error processing payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md mt-6 bg-gray-700 p-4 rounded-lg"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Complete Payment</h2>
      <CardElement
        options={{ hidePostalCode: true }}
        className="p-2 bg-white rounded mb-4"
      />
      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xl py-4 rounded-lg flex items-center justify-center"
      >
        {loading ? 'Processing...' : `Pay $${selectedPack.price}`}
      </Button>
    </form>
  );
}
