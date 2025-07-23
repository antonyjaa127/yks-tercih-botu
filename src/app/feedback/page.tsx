"use client"
import React, { useState } from 'react';
import { Mail, Linkedin } from 'lucide-react';

const linkedins = [
  {
    name: 'Yusuf Asım Arslan',
    url: 'https://www.linkedin.com/in/yusufasimarslan/'
  },
  {
    name: 'Buğra Yılmaz',
    url: 'https://www.linkedin.com/in/bu%C4%9Fra-y%C4%B1lmaz-a0614326b/'
  },
  {
    name: 'Mert Efe Ünver',
    url: 'https://www.linkedin.com/in/mert-efe-%C3%BCnver-b85b73272/'
  }
];

export default function FeedbackPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSent(false);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, feedback: form.message })
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
        setForm({ name: '', email: '', message: '' });
      } else {
        setError(data.error || 'Bir hata oluştu.');
      }
    } catch (err) {
      setError('Sunucu hatası.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full border border-gray-100">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-2">Geri Bildirim</h1>
        <p className="text-center text-gray-600 mb-6">Görüş, öneri veya hata bildirimi için bize ulaşabilirsin. Tüm geri bildirimler bizim için çok değerli!</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            required
            placeholder="Adınız"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
          <input
            type="email"
            name="email"
            placeholder="E-posta (isteğe bağlı)"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
          <textarea
            name="message"
            required
            placeholder="Mesajınız"
            value={form.message}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
          />
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
            disabled={loading}
          >
            <Mail className="w-5 h-5" /> {loading ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </form>
        {sent && (
          <div className="mt-4 text-green-700 text-center font-medium">Teşekkürler! Geri bildiriminiz kaydedildi.</div>
        )}
        {error && (
          <div className="mt-4 text-red-700 text-center font-medium">{error}</div>
        )}
        <div className="mt-8 border-t pt-4">
          <h2 className="text-center text-gray-700 font-semibold mb-3">Ekibimizle LinkedIn üzerinden de iletişime geçebilirsiniz:</h2>
          <div className="flex flex-col gap-3">
            {linkedins.map((l) => (
              <a
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 font-medium transition-colors justify-center"
              >
                <Linkedin className="w-5 h-5" /> {l.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 