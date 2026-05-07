import { useState } from 'react';

export default function ApiSettings() {
  const [baseUrl, setBaseUrl] = useState(() => import.meta.env.VITE_API_BASE_URL ?? '');
  const [webhookSecret, setWebhookSecret] = useState('••••••••••••');

  return (
    <div className="page">
      <p className="page__lede">
        API manzili va maxfiy kalitlar — `.env` orqali `VITE_API_BASE_URL` ni moslang.
      </p>
      <div className="form-panel">
        <label className="field">
          <span className="field__label">Asosiy API URL</span>
          <input
            className="field__input"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="https://api.example.com"
          />
        </label>
        <label className="field">
          <span className="field__label">Webhook maxfiy kaliti</span>
          <input
            className="field__input mono"
            value={webhookSecret}
            onChange={(e) => setWebhookSecret(e.target.value)}
            type="password"
            autoComplete="off"
          />
        </label>
        <div className="form-panel__actions">
          <button type="button" className="btn btn--primary">
            Saqlash (demo)
          </button>
          <button type="button" className="btn btn--ghost">
            Kalitni yangilash
          </button>
        </div>
      </div>
    </div>
  );
}
