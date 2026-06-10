import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../../contexts/CartContext';
import styles from './CheckoutModal.module.scss';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import AddressStep from './AddressStep';
import PaymentStep from './PaymentStep';


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutModal = ({ onClose, total, installConsultar, formatPrice }) => {
    const [step,          setStep]          = useState(1); // 1=adreça, 2=pagament
    const [direction,     setDirection]     = useState(null);
    const [facturation,   setFacturation]   = useState(null);
    const [clientSecret,  setClientSecret]  = useState(null);
    const [loadingIntent, setLoadingIntent] = useState(false);

    const handleAddressConfirm = async (dir, fact) => {
        setDirection(dir);
        setFacturation(fact);
        setLoadingIntent(true);

        try {
            const res = await axios.post(
                'http://localhost:8000/api/cart/payment-intent',
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem('api_token')}` } }
            );
            setClientSecret(res.data.client_secret);
            setStep(2);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingIntent(false);
        }
    };


    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>✕</button>

                <div className={styles.steps}>
                    <span className={step === 1 ? styles.activeStep : styles.doneStep}>
                        1. Adreça
                    </span>
                    <span className={styles.stepDivider}>›</span>
                    <span className={step === 2 ? styles.activeStep : styles.inactiveStep}>
                        2. Pagament
                    </span>
                </div>

                {step === 1 && (
                    <AddressStep
                        onConfirm={handleAddressConfirm}
                        loading={loadingIntent}
                        total={total}
                        installConsultar={installConsultar}
                        formatPrice={formatPrice}
                    />
                )}

                {step === 2 && clientSecret && (
                    <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <PaymentStep
                            clientSecret={clientSecret}
                            direction={direction}
                            facturation={facturation}
                            onBack={() => setStep(1)}
                            onClose={onClose}
                            total={total}
                            installConsultar={installConsultar}
                            formatPrice={formatPrice}
                        />
                    </Elements>
                )}
            </div>
        </div>
    );
};

export default CheckoutModal;