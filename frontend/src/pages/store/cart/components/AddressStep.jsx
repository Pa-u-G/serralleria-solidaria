import React, { useState } from 'react';
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

const AddressStep = ({ onConfirm, loading, total, installConsultar, formatPrice }) => {
    const [direction,   setDirection]   = useState({ ...emptyAddress });
    const [facturation, setFacturation] = useState({ ...emptyAddress });
    const [sameAddress, setSameAddress] = useState(true);

    const handleChange = (setter) => (e) =>
        setter(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = () => {
        onConfirm(direction, sameAddress ? direction : facturation);
    };

    return (
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

            <button
                className={styles.confirmBtn}
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? 'Preparando pago...' : 'Continuar al pago →'}
            </button>
        </div>
    );
};

export default AddressStep;