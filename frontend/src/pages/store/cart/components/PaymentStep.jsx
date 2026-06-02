import React, { useState } from 'react';
import axios from 'axios';

import {
    PaymentElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../../contexts/CartContext';
import styles from './CheckoutModal.module.scss';

const PaymentStep = ({
    direction, facturation, onBack, onClose,
    total, installConsultar, formatPrice
}) => {
    const stripe     = useStripe();
    const elements   = useElements();
    const navigate   = useNavigate();
    const { fetchCart } = useCart();

    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState(null);

    const handleSubmit = async () => {
        if (!stripe || !elements) return;

        setLoading(true);
        setError(null);

        const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
        });

        if (stripeError) {
            setError(stripeError.message);
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post(
                'http://localhost:8000/api/cart/checkout',
                {
                    payment_intent_id: paymentIntent.id,
                    direction,
                    facturation,
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('api_token')}` } }
            );

            await fetchCart();
            onClose();
            navigate('/mis-compras');

        } catch (err) {
            setError(
                err.response?.data?.message ?? 'Error de conexión. Inténtalo de nuevo.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.scrollArea}>
            <div className={styles.totalSummary}>
                <span>Total a pagar:</span>
                <strong>
                    {installConsultar
                        ? `${formatPrice(total)} + instalación a consultar`
                        : formatPrice(total)}
                </strong>
            </div>

            {/* Formulario de tarjeta de Stripe */}
            <div className={styles.paymentElement}>
                <PaymentElement />
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.paymentActions}>
                <button
                    className={styles.backBtn}
                    onClick={onBack}
                    disabled={loading}
                >
                    ← Volver
                </button>
                <button
                    className={styles.confirmBtn}
                    onClick={handleSubmit}
                    disabled={loading || !stripe}
                >
                    {loading ? 'Procesando...' : 'Pagar ahora'}
                </button>
            </div>
        </div>
    );
};

export default PaymentStep;