import React, { useState } from 'react';
import styles from './CheckoutModal.module.scss';

const emptyAddress = {
    name: '', surnames: '', nif: '',
    address: '', postal_code: '', city: '', phone_number: ''
};

const fields = [
    {
        name:        'name',
        label:       'Nom',
        type:        'text',
        placeholder: 'Joan',
        required:    true,
        validate:    v => v.trim().length >= 2 ? null : 'El nom ha de tenir almenys 2 caràcters',
    },
    {
        name:        'surnames',
        label:       'Cognoms',
        type:        'text',
        placeholder: 'García López',
        required:    false,
        validate:    v => (!v || v.trim().length >= 2) ? null : 'Els cognoms han de tenir almenys 2 caràcters',
    },
    {
        name:        'nif',
        label:       'NIF / CIF',
        type:        'text',
        placeholder: '12345678A',
        required:    true,
        validate:    v => /^[A-Za-z0-9]{8,9}$/.test(v.trim()) ? null : 'NIF/CIF no vàlid',
    },
    {
        name:        'phone_number',
        label:       'Telèfon',
        type:        'tel',
        placeholder: '612 345 678',
        required:    true,
        validate:    v => /^[0-9\s\+\-]{9,15}$/.test(v.trim()) ? null : 'Telèfon no vàlid',
    },
    {
        name:        'address',
        label:       'Adreça',
        type:        'text',
        placeholder: 'Carrer d\'Exemple, 42, 3r 2a',
        required:    true,
        validate:    v => v.trim().length >= 5 ? null : 'Introdueix una adreça vàlida',
    },
    {
        name:        'postal_code',
        label:       'Codi postal',
        type:        'text',
        placeholder: '08001',
        required:    true,
        validate:    v => /^[0-9]{5}$/.test(v.trim()) ? null : 'El codi postal ha de tenir 5 dígits',
    },
    {
        name:        'city',
        label:       'Ciutat',
        type:        'text',
        placeholder: 'Barcelona',
        required:    true,
        validate:    v => v.trim().length >= 2 ? null : 'Introdueix una ciutat vàlida',
    },
];

const validateAddress = (values) => {
    const errors = {};
    fields.forEach(f => {
        const err = f.validate(values[f.name] ?? '');
        if (err) errors[f.name] = err;
    });
    return errors;
};

const AddressForm = ({ values, onChange, onBlur, errors, title }) => (
    <div className={styles.addressBlock}>
        <h3>{title}</h3>
        <div className={styles.formGrid}>
            {fields.map(f => (
                <label key={f.name} className={`${styles.field} ${errors[f.name] ? styles.fieldError : ''}`}>
                    <span>{f.label}{f.required && <span className={styles.required}> *</span>}</span>
                    <input
                        type={f.type}
                        name={f.name}
                        value={values[f.name]}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder={f.placeholder}
                    />
                    {errors[f.name] && (
                        <span className={styles.errorMsg}>{errors[f.name]}</span>
                    )}
                </label>
            ))}
        </div>
    </div>
);

const AddressStep = ({ onConfirm, loading, total, installConsultar, formatPrice }) => {
    const [direction,    setDirection]    = useState({ ...emptyAddress });
    const [facturation,  setFacturation]  = useState({ ...emptyAddress });
    const [sameAddress,  setSameAddress]  = useState(true);
    const [dirErrors,    setDirErrors]    = useState({});
    const [factErrors,   setFactErrors]   = useState({});
    const [submitted,    setSubmitted]    = useState(false);

    const handleChange = (setter, setErrors) => (e) => {
        const { name, value } = e.target;
        setter(prev => {
            const updated = { ...prev, [name]: value };
            if (submitted) {
                const field = fields.find(f => f.name === name);
                const err   = field?.validate(value) ?? null;
                setErrors(prev => ({ ...prev, [name]: err }));
            }
            return updated;
        });
    };

    const handleBlur = (values, setErrors) => (e) => {
        const { name, value } = e.target;
        const field = fields.find(f => f.name === name);
        const err   = field?.validate(value) ?? null;
        setErrors(prev => ({ ...prev, [name]: err }));
    };

    const handleSubmit = () => {
        setSubmitted(true);

        const dErrors = validateAddress(direction);
        setDirErrors(dErrors);

        const fErrors = sameAddress ? {} : validateAddress(facturation);
        if (!sameAddress) setFactErrors(fErrors);

        const hasErrors = Object.values(dErrors).some(Boolean)
            || Object.values(fErrors).some(Boolean);

        if (hasErrors) return;

        onConfirm(direction, sameAddress ? direction : facturation);
    };

    return (
        <div className={styles.scrollArea}>
            <AddressForm
                values={direction}
                onChange={handleChange(setDirection, setDirErrors)}
                onBlur={handleBlur(direction, setDirErrors)}
                errors={dirErrors}
                title="Adreça d'enviament"
            />

            <label className={styles.sameAddress}>
                <input
                    type="checkbox"
                    checked={sameAddress}
                    onChange={e => setSameAddress(e.target.checked)}
                />
                L'adreça de facturació és la mateixa
            </label>

            {!sameAddress && (
                <AddressForm
                    values={facturation}
                    onChange={handleChange(setFacturation, setFactErrors)}
                    onBlur={handleBlur(facturation, setFactErrors)}
                    errors={factErrors}
                    title="Adreça de facturació"
                />
            )}

            <div className={styles.totalSummary}>
                <span>Total a pagar:</span>
                <strong>
                    {installConsultar
                        ? `${formatPrice(total)} + instal·lació a consultar`
                        : formatPrice(total)}
                </strong>
            </div>

            <button
                className={styles.confirmBtn}
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? 'Preparant el pagament...' : 'Continuar al pagament →'}
            </button>
        </div>
    );
};

export default AddressStep;