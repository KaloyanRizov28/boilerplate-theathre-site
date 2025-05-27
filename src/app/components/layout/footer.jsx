// src/components/layout/footer.js
export function Footer() {
  return (
    <footer className="bg-theater-dark py-12">
      <div className="px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Информация</h3>
            <div className="space-y-2 text-gray-400 text-sm">
              <p>Политика за неприкосновеност и</p>
              <p>Ползване на "бисквитки"</p>
              <button className="text-gray-300 hover:text-white transition-colors flex items-center">
                Общи условия →
              </button>
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-400 text-sm mb-4">
              <p>1000 гр. Велико Търново ул. "Васил Априлов" 4</p>
              <p>📞 0882555665</p>
              <p>✉️ info@theater-bg.com</p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
        </div>
        <div className="text-center text-gray-500 text-xs mt-8 pt-8 border-t border-gray-800">
          МДТ "Константин Кисимов" © 2025
        </div>
      </div>
    </footer>
  )
}