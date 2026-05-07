type TemplateRow = {
  id: string;
  name: string;
  locale: string;
  body: string;
};

const demo: TemplateRow[] = [
  { id: 't1', name: 'OTP tasdiqlash', locale: 'uz', body: 'Kod: {{code}}. Hech kimga bermang.' },
  { id: 't2', name: 'To‘lov eslatmasi', locale: 'uz', body: 'Hurmatli mijoz, to‘lov qabul qilindi.' },
  { id: 't3', name: 'Marketing (OPT-IN)', locale: 'uz', body: 'Chegirma haqida batafsil: {{link}}' },
];

export default function Templates() {
  return (
    <div className="page">
      <p className="page__lede">
        Shablonlar — kod va link o‘zgaruvchilari backend bilan sinxronlanadi.
      </p>
      <div className="card-grid">
        {demo.map((t) => (
          <article key={t.id} className="info-card">
            <div className="info-card__head">
              <h3 className="info-card__title">{t.name}</h3>
              <span className="pill pill--neutral">{t.locale}</span>
            </div>
            <p className="info-card__body">{t.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
