import React, { useEffect, useState } from "react";
import "../Home/HomePage.css";
import { orchidService, categoryService } from "../../services/index.js";

function HomePage({
  onNavigateToProducts,
  onNavigateToAbout,
  onNavigateToContact,
}) {
  const [stats, setStats] = useState({
    totalOrchids: 0,
    totalCategories: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [orchidsData, categoriesData] = await Promise.all([
          orchidService.getAllOrchids(),
          categoryService.getAllCategories(),
        ]);

        setStats({
          totalOrchids: orchidsData.length,
          totalCategories: categoriesData.length - 1, // Exclude "Tất cả"
          loading: false,
        });
      } catch {
        setStats((prev) => ({ ...prev, loading: false }));
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="home-page-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <span>🌺 Welcome to Orchid Paradise</span>
          </div>
          <h1 className="hero-title">
            Khám phá vẻ đẹp <span className="highlight">Hoa Lan</span> quý hiếm
          </h1>
          <p className="hero-subtitle">
            Bộ sưu tập hoa lan đẳng cấp thế giới với hơn {stats.totalOrchids}{" "}
            loài quý hiếm. Mỗi bông hoa là một tác phẩm nghệ thuật của thiên
            nhiên.
          </p>

          <div className="hero-actions">
            <button className="cta-primary" onClick={onNavigateToProducts}>
              Khám phá ngay 🌸
            </button>
            <button className="cta-secondary" onClick={onNavigateToAbout}>
              Tìm hiểu thêm
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">
                {stats.loading ? "..." : stats.totalOrchids}
              </span>
              <span className="stat-label">Loài hoa lan</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">
                {stats.loading ? "..." : stats.totalCategories}
              </span>
              <span className="stat-label">Danh mục</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Chất lượng</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Hỗ trợ</span>
            </div>
          </div>
        </div>

        <div className="hero-image">
          <div className="floating-elements">
            <div className="floating-orchid floating-1">🌺</div>
            <div className="floating-orchid floating-2">🌸</div>
            <div className="floating-orchid floating-3">🌼</div>
            <div className="floating-orchid floating-4">🌻</div>
            <div className="floating-orchid floating-5">🌷</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="section-title">Tại sao chọn chúng tôi?</h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3 className="feature-title">Chất lượng đỉnh cao</h3>
              <p className="feature-description">
                Tất cả hoa lan được tuyển chọn kỹ lưỡng từ những vườn ươm uy tín
                nhất
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3 className="feature-title">Giao hàng tận nơi</h3>
              <p className="feature-description">
                Đóng gói cẩn thận và giao hàng nhanh chóng đến tận cửa nhà bạn
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3 className="feature-title">Hướng dẫn chăm sóc</h3>
              <p className="feature-description">
                Kèm theo hướng dẫn chi tiết để hoa lan phát triển tốt nhất
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3 className="feature-title">Giống quý hiếm</h3>
              <p className="feature-description">
                Bộ sưu tập những giống hoa lan hiếm có khó tìm trên thị trường
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Tư vấn chuyên nghiệp</h3>
              <p className="feature-description">
                Đội ngũ chuyên gia hoa lan sẵn sàng tư vấn 24/7 cho bạn
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3 className="feature-title">Bảo hành chất lượng</h3>
              <p className="feature-description">
                Cam kết đổi trả trong 30 ngày nếu không hài lòng về chất lượng
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Preview Section */}
      <section className="categories-preview-section">
        <div className="categories-container">
          <h2 className="section-title">Danh mục phổ biến</h2>
          <p className="section-subtitle">
            Khám phá các loại hoa lan được yêu thích nhất
          </p>

          <div className="categories-grid">
            <div
              className="category-preview-card"
              onClick={onNavigateToProducts}
            >
              <div className="category-image">
                <img
                  src="https://img.freepik.com/free-photo/phalaenopsis-orchid-flower_1373-563.jpg?t=st=1751184482~exp=1751188082~hmac=e201963fd50b98e679f6b74b2319d37e6aa36311c5c55a59b84228458fad17a5&w=1380"
                  alt="Phalaenopsis"
                />
              </div>
              <div className="category-overlay">
                <h3 className="category-name">Phalaenopsis</h3>
                <p className="category-desc">Hoa lan bướm thanh lịch</p>
                <span className="category-arrow">→</span>
              </div>
            </div>

            <div
              className="category-preview-card"
              onClick={onNavigateToProducts}
            >
              <div className="category-image">
                <img
                  src="https://img.freepik.com/premium-photo/beautiful-white-purple-orchid_42129-466.jpg?w=740"
                  alt="Dendrobium"
                />
              </div>
              <div className="category-overlay">
                <h3 className="category-name">Dendrobium</h3>
                <p className="category-desc">Hoa lan thân gỗ đặc biệt</p>
                <span className="category-arrow">→</span>
              </div>
            </div>

            <div
              className="category-preview-card"
              onClick={onNavigateToProducts}
            >
              <div className="category-image">
                <img
                  src="https://img.freepik.com/premium-photo/orchid-cattleya-trianae-flower-painting_198067-658963.jpg"
                  alt="Cattleya"
                />
              </div>
              <div className="category-overlay">
                <h3 className="category-name">Cattleya</h3>
                <p className="category-desc">Hoa lan hoàng gia quyến rũ</p>
                <span className="category-arrow">→</span>
              </div>
            </div>

            <div
              className="category-preview-card"
              onClick={onNavigateToProducts}
            >
              <div className="category-image">
                <img
                  src="https://img.freepik.com/free-photo/blue-vanda-orchid-flower_1373-28.jpg"
                  alt="Vanda"
                />
              </div>
              <div className="category-overlay">
                <h3 className="category-name">Vanda</h3>
                <p className="category-desc">Hoa lan màu sắc rực rỡ</p>
                <span className="category-arrow">→</span>
              </div>
            </div>
          </div>

          <div className="categories-cta">
            <button className="view-all-btn" onClick={onNavigateToProducts}>
              Xem tất cả danh mục
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta-section">
        <div className="final-cta-container">
          <h2 className="final-cta-title">
            Sẵn sàng bắt đầu hành trình hoa lan?
          </h2>
          <p className="final-cta-subtitle">
            Hãy để chúng tôi giúp bạn tìm được những bông hoa lan hoàn hảo cho
            không gian của bạn
          </p>
          <div className="final-cta-buttons">
            <button
              className="final-cta-btn primary"
              onClick={onNavigateToProducts}
            >
              Khám phá bộ sưu tập 🌺
            </button>
            <button
              className="final-cta-btn secondary"
              onClick={onNavigateToContact}
            >
              Liên hệ tư vấn 📞
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
