'use client';
import { FormEvent, useState } from 'react';
import { Send } from 'lucide-react';

export function ContactForm() {
  const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [subject, setSubject] = useState(''); const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setFeedback(null);
    try {
      const response = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, subject, message }) });
      const data = await response.json() as { error?: string; message?: string };
      if (!response.ok) throw new Error(data.error || 'Unable to submit this message right now.');
      setFeedback({ type: 'success', text: data.message || 'Your message has been saved.' }); setName(''); setEmail(''); setSubject(''); setMessage('');
    } catch (error) { setFeedback({ type: 'error', text: error instanceof Error ? error.message : 'Unable to submit this message right now.' }); }
    finally { setLoading(false); }
  }
  return <form onSubmit={submit} className="plain-card" style={{ maxWidth: 680 }}>
    {feedback ? <div className={feedback.type === 'error' ? 'form-error' : 'notice'} role="status">{feedback.text}</div> : null}
    <div className="field"><label htmlFor="contact-name">Name</label><input id="contact-name" required value={name} onChange={(e) => setName(e.target.value)} maxLength={120}/></div>
    <div className="field"><label htmlFor="contact-email">Email</label><input id="contact-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} maxLength={254}/></div>
    <div className="field"><label htmlFor="contact-subject">Subject</label><input id="contact-subject" required value={subject} onChange={(e) => setSubject(e.target.value)} maxLength={180}/></div>
    <div className="field"><label htmlFor="contact-message">Message</label><textarea id="contact-message" required value={message} onChange={(e) => setMessage(e.target.value)} maxLength={6000} rows={6}/></div>
    <button className="btn" type="submit" disabled={loading}>{loading ? 'Submitting…' : 'Send message'} <Send size={15}/></button>
    <p className="form-note">Messages are saved for review. Email delivery is not configured yet, so this form will not claim an email was sent.</p>
  </form>;
}
