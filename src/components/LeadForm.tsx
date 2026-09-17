import { useState, type FormEvent } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import './LeadForm.css';

type LeadFormProps = {
  source?: string;
  compact?: boolean;
};

export function LeadForm({ source = 'сайт', compact = false }: LeadFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (!name.trim() || !phone.trim()) {
      setError('Укажите имя и телефон');
      return;
    }

    if (!consent) {
      setError('Нужно согласие на обработку персональных данных');
      return;
    }

    // Заявка готова к подключению CRM / Telegram / email backend
    console.info('Lead form submit', { name, phone, comment, source });
    setSent(true);
    setName('');
    setPhone('');
    setComment('');
    setConsent(false);
  }

  if (sent) {
    return (
      <div className="lead-form lead-form--success" role="status">
        <CheckCircle2 size={28} aria-hidden />
        <p className="lead-form__success-title">Заявка принята</p>
        <p className="lead-form__success-text">
          Мы свяжемся с вами для уточнения деталей. Пока можно позвонить по номеру на сайте.
        </p>
        <button type="button" className="btn btn--ghost" onClick={() => setSent(false)}>
          Отправить ещё одну
        </button>
      </div>
    );
  }

  return (
    <form className={`lead-form ${compact ? 'lead-form--compact' : ''}`} onSubmit={handleSubmit} noValidate>
      <div className="lead-form__fields">
        <label className="lead-form__field">
          <span>Имя</span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            placeholder="Как к вам обращаться"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label className="lead-form__field">
          <span>Телефон</span>
          <input
            type="tel"
            name="phone"
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </label>
        {!compact && (
          <label className="lead-form__field lead-form__field--full">
            <span>Комментарий</span>
            <textarea
              name="comment"
              rows={3}
              placeholder="Марка авто, симптомы, удобное время"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </label>
        )}
      </div>

      <label className="lead-form__consent">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
        />
        <span>
          Согласен с{' '}
          <Link to="/politika-konfidencialnosti/">политикой обработки персональных данных</Link>
        </span>
      </label>

      {error && <p className="lead-form__error">{error}</p>}

      <button type="submit" className="btn btn--primary btn--block">
        Записаться
      </button>
    </form>
  );
}
