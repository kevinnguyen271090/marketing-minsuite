export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">MinSuite</div>
          <div className="space-x-4">
            <a href="/login" className="text-gray-600 hover:text-gray-900">
              Đăng nhập
            </a>
            <a
              href="/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Dùng thử miễn phí
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="mb-6 text-5xl font-bold text-gray-900">
          Hệ điều hành Marketing
          <br />
          <span className="text-blue-600">All-in-One</span> cho doanh nghiệp Việt
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
          Đo lường ROI chính xác từng đồng. Tích hợp online + offline.
          <br />
          Tối ưu chiến dịch với data thực tế.
        </p>
        <div className="flex justify-center gap-4">
          <a
            href="/signup"
            className="rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-700"
          >
            Bắt đầu miễn phí
          </a>
          <a
            href="/demo"
            className="rounded-lg border-2 border-blue-600 px-8 py-3 text-lg font-semibold text-blue-600 hover:bg-blue-50"
          >
            Xem Demo
          </a>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-red-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Vấn đề của CMO Việt Nam
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 text-4xl font-bold text-red-600">90%</div>
              <p className="text-gray-700">
                Doanh nghiệp Việt không đo lường được ROI marketing chính xác
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 text-4xl font-bold text-red-600">12h</div>
              <p className="text-gray-700">
                CMO dành mỗi tuần để tổng hợp dữ liệu từ 5-7 nguồn khác nhau
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow-md">
              <div className="mb-4 text-4xl font-bold text-red-600">0</div>
              <p className="text-gray-700">
                Công cụ đo lường ROI offline (QR codes, Wi-Fi, cửa hàng)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Giải pháp của MinSuite
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-6">
              <div className="mb-4 text-3xl">🔗</div>
              <h3 className="mb-2 text-xl font-semibold">Universal Tracking Links</h3>
              <p className="text-gray-600">
                Tạo link UTM tracking tự động. Theo dõi clicks, conversions, revenue
                real-time. Hash session data để bảo vệ privacy.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <div className="mb-4 text-3xl">📱</div>
              <h3 className="mb-2 text-xl font-semibold">
                Offline Revenue Attribution
              </h3>
              <p className="text-gray-600">
                QR code với mã giảm giá riêng. Wi-Fi tracking. Probabilistic matching
                kết nối online + offline.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <div className="mb-4 text-3xl">📊</div>
              <h3 className="mb-2 text-xl font-semibold">Unified ROI Dashboard</h3>
              <p className="text-gray-600">
                ROI, CAC, LTV, conversion rate theo từng campaign. Charts và
                visualizations. Export PDF 1-click.
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6">
              <div className="mb-4 text-3xl">🔔</div>
              <h3 className="mb-2 text-xl font-semibold">
                Automated Alerts (Zalo OA)
              </h3>
              <p className="text-gray-600">
                Cảnh báo khi ROI âm, vượt ngân sách, doanh thu giảm. Gửi qua Zalo OA
                API ngay lập tức.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
            Tích hợp với hệ thống hiện có
          </h2>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-gray-700">Haravan</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-gray-700">Sapo</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-gray-700">KiotViet</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-gray-700">Zalo OA</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-gray-700">Facebook Ads</div>
            </div>
            <div className="text-center">
              <div className="mb-2 text-2xl font-bold text-gray-700">Google Ads</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold text-gray-900">
            Sẵn sàng đo lường ROI marketing chính xác?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600">
            Dùng thử miễn phí 14 ngày. Không cần thẻ tín dụng.
          </p>
          <a
            href="/signup"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-lg font-semibold text-white hover:bg-blue-700"
          >
            Bắt đầu ngay
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-8 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4 text-2xl font-bold">MinSuite</div>
          <p className="mb-4 text-gray-400">
            Marketing Operations Platform for Vietnamese Businesses
          </p>
          <div className="space-x-4">
            <a href="/about" className="text-gray-400 hover:text-white">
              Về chúng tôi
            </a>
            <a href="/pricing" className="text-gray-400 hover:text-white">
              Bảng giá
            </a>
            <a href="/docs" className="text-gray-400 hover:text-white">
              Tài liệu
            </a>
            <a href="/contact" className="text-gray-400 hover:text-white">
              Liên hệ
            </a>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            © 2025 MinSuite. Made with ❤️ for Vietnamese businesses.
          </div>
        </div>
      </footer>
    </div>
  )
}
