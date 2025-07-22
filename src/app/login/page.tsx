import React from 'react';

export default function LoginInfo() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="text-4xl mb-4">🚧✨</div>
        <h1 className="text-2xl font-bold mb-2 text-blue-700">Giriş Sayfası - Geliştirme Aşamasında!</h1>
        <p className="text-gray-700 mb-4">
          Uygulamamız şu anda <span className="font-semibold text-indigo-600">geliştirme aşamasında</span>!<br/>
          Eğer bu platform beğenilir ve kullanılırsa, <span className="font-semibold">AI ile üniversitelere soru sorma</span>, <span className="font-semibold">chatbot</span> ve daha birçok yenilikçi özellik eklenecek! 🤖🎓<br/>
          <span className="text-blue-500">Geri bildirimlerinizi ve desteğinizi bekliyoruz!</span>
        </p>
        <div className="text-3xl">💡🛠️</div>
        <p className="mt-4 text-gray-500 text-sm">Şimdilik bu sayfa sadece bilgilendirme amaçlıdır. Yakında çok daha fazlası burada olacak!</p>
      </div>
    </div>
  );
} 