import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../../contexts/CartContext';
import styles from './CheckoutModal.module.scss';

const emptyAddress = {
    name: '', surnames: '', nif: '',
    address: '', postal_code: '', city: '', phone_number: ''
};

const fields = [
    { name: 'name',         label: 'Nombre',       type: 'text' },
    { name: 'surnames',     label: 'Apellidos',     type: 'text' },
    { name: 'nif',          label: 'NIF / CIF',     type: 'text' },
    { name: 'phone_number', label: 'Teléfono',      type: 'tel'  },
    { name: 'address',      label: 'Dirección',     type: 'text' },
    { name: 'postal_code',  label: 'Código postal', type: 'text' },
    { name: 'city',         label: 'Ciudad',        type: 'text' },
];

// ← Fuera de CheckoutModal
const AddressForm = ({ values, onChange, title }) => (
    <div className={styles.addressBlock}>
        <h3>{title}</h3>
        <div className={styles.formGrid}>
            {fields.map(f => (
                <label key={f.name} className={styles.field}>
                    <span>{f.label}</span>
                    <input
                        type={f.type}
                        name={f.name}
                        value={values[f.name]}
                        onChange={onChange}
                        required={f.name !== 'surnames'}
                    />
                </label>
            ))}
        </div>
    </div>
);

const CheckoutModal = ({ onClose, total, installConsultar, formatPrice }) => {
    const navigate      = useNavigate();
    const { fetchCart } = useCart();

    const [direction,   setDirection]   = useState({ ...emptyAddress });
    const [facturation, setFacturation] = useState({ ...emptyAddress });
    const [sameAddress, setSameAddress] = useState(true);
    const [loading,     setLoading]     = useState(false);
    const [error,       setError]       = useState(null);

    const handleChange = (setter) => (e) => {
        setter(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            await axios.post(
                'http://localhost:8000/api/cart/checkout',
                {
                    direction,
                    facturation: sameAddress ? direction : facturation,
                },
                { headers: { Authorization: `Bearer ${localStorage.getItem('api_token')}` } }
            );
            await fetchCart();
            navigate('/');
        } catch (err) {
            setError('Ha ocurrido un error. Revisa los datos e inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>✕</button>
                <h2>Finalizar pedido</h2>

                <div className={styles.scrollArea}>
                    <AddressForm
                        values={direction}
                        onChange={handleChange(setDirection)}
                        title="Dirección de envío"
                    />

                    <label className={styles.sameAddress}>
                        <input
                            type="checkbox"
                            checked={sameAddress}
                            onChange={e => setSameAddress(e.target.checked)}
                        />
                        La dirección de facturación es la misma
                    </label>

                    {!sameAddress && (
                        <AddressForm
                            values={facturation}
                            onChange={handleChange(setFacturation)}
                            title="Dirección de facturación"
                        />
                    )}

                    <div className={styles.totalSummary}>
                        <span>Total a pagar:</span>
                        <strong>
                            {installConsultar
                                ? `${formatPrice(total)} + instalación a consultar`
                                : formatPrice(total)}
                        </strong>
                    </div>

                    {error && <p className={styles.error}>{error}</p>}

                    <button
                        className={styles.confirmBtn}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Procesando...' : 'Confirmar pedido'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModal;