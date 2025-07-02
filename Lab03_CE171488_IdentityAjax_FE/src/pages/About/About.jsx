import React from "react";
import "./About.css";

function About({ onNavigateToProducts, onNavigateToContact }) {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-container">
          <h1 className="about-hero-title">Về chúng tôi</h1>
          <p className="about-hero-subtitle">
            Hành trình 15 năm đam mê với thế giới hoa lan
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="about-story">
        <div className="about-container">
          <div className="story-grid">
            <div className="story-content">
              <h2 className="section-title">Câu chuyện của chúng tôi</h2>
              <p className="story-text">
                Orchid Shop được thành lập vào năm 2009 bởi những người yêu hoa
                lan đích thực. Chúng tôi bắt đầu từ một vườn ươm nhỏ với niềm
                đam mê cháy bỏng về vẻ đẹp tinh tế và sự đa dạng của các loài
                hoa lan.
              </p>
              <p className="story-text">
                Qua 15 năm phát triển, chúng tôi đã trở thành một trong những
                nhà cung cấp hoa lan uy tín nhất tại Việt Nam, với hơn 500 giống
                hoa lan quý hiếm từ khắp nơi trên thế giới.
              </p>
              <div className="story-stats">
                <div className="stat-item">
                  <span className="stat-number">15+</span>
                  <span className="stat-label">Năm kinh nghiệm</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Giống hoa lan</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">10,000+</span>
                  <span className="stat-label">Khách hàng hài lòng</span>
                </div>
              </div>
            </div>
            <div className="story-image">
              <img
                src="https://img.freepik.com/premium-photo/beautiful-orchid-garden-with-many-colorful-orchids_488220-69852.jpg"
                alt="Vườn hoa lan của chúng tôi"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="about-mission">
        <div className="about-container">
          <h2 className="section-title text-center">Sứ mệnh & Tầm nhìn</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <div className="mission-icon">🎯</div>
              <h3 className="mission-title">Sứ mệnh</h3>
              <p className="mission-text">
                Mang vẻ đẹp và niềm vui của hoa lan đến mọi gia đình Việt Nam,
                đồng thời bảo tồn và phát triển các giống hoa lan quý hiếm.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">🌟</div>
              <h3 className="mission-title">Tầm nhìn</h3>
              <p className="mission-text">
                Trở thành thương hiệu hoa lan số 1 Việt Nam, được khách hàng tin
                yêu vì chất lượng, dịch vụ và sự tận tâm.
              </p>
            </div>
            <div className="mission-card">
              <div className="mission-icon">💎</div>
              <h3 className="mission-title">Giá trị cốt lõi</h3>
              <p className="mission-text">
                Chất lượng, tận tâm, chuyên nghiệp và đam mê là những giá trị mà
                chúng tôi luôn hướng tới trong mọi hoạt động.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="about-container">
          <h2 className="section-title text-center">Đội ngũ chuyên gia</h2>
          <p className="section-subtitle text-center">
            Những người am hiểu sâu sắc về hoa lan
          </p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">
                <img
                  src="https://img.freepik.com/free-photo/portrait-happy-successful-man_14117-11089.jpg?w=740"
                  alt="Nguyễn Văn An"
                />
              </div>
              <h3 className="member-name">Nguyễn Văn An</h3>
              <p className="member-role">Founder & CEO</p>
              <p className="member-desc">
                15 năm kinh nghiệm trong lĩnh vực hoa lan, chuyên gia về các
                giống hoa lan châu Á.
              </p>
            </div>
            <div className="team-member">
              <div className="member-avatar">
                <img
                  src="https://img.freepik.com/free-photo/portrait-beautiful-young-businesswoman_158538-5845.jpg?w=740"
                  alt="Trần Thị Bình"
                />
              </div>
              <h3 className="member-name">Trần Thị Bình</h3>
              <p className="member-role">Trưởng phòng Kỹ thuật</p>
              <p className="member-desc">
                Chuyên gia về chăm sóc và nhân giống hoa lan, có kinh nghiệm 12
                năm trong ngành.
              </p>
            </div>
            <div className="team-member">
              <div className="member-avatar">
                <img
                  src="https://img.freepik.com/free-photo/confident-handsome-guy-posing-against-white-wall_176420-32936.jpg?w=740"
                  alt="Lê Minh Cường"
                />
              </div>
              <h3 className="member-name">Lê Minh Cường</h3>
              <p className="member-role">Chuyên viên Tư vấn</p>
              <p className="member-desc">
                Chuyên tư vấn và hướng dẫn khách hàng chăm sóc hoa lan tại nhà
                một cách hiệu quả.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <div className="about-container">
          <h2 className="section-title text-center">Cam kết chất lượng</h2>
          <div className="values-grid">
            <div className="value-item">
              <div className="value-icon">🌱</div>
              <h3 className="value-title">Nguồn gốc rõ ràng</h3>
              <p className="value-desc">
                Tất cả hoa lan đều có nguồn gốc xuất xứ rõ ràng từ các vườn ươm
                uy tín.
              </p>
            </div>
            <div className="value-item">
              <div className="value-icon">🔬</div>
              <h3 className="value-title">Kiểm tra chất lượng</h3>
              <p className="value-desc">
                Quy trình kiểm tra nghiêm ngặt đảm bảo mỗi cây hoa lan đều khỏe
                mạnh.
              </p>
            </div>
            <div className="value-item">
              <div className="value-icon">📦</div>
              <h3 className="value-title">Đóng gói cẩn thận</h3>
              <p className="value-desc">
                Đóng gói chuyên nghiệp để bảo vệ hoa lan trong quá trình vận
                chuyển.
              </p>
            </div>
            <div className="value-item">
              <div className="value-icon">🎓</div>
              <h3 className="value-title">Hướng dẫn chi tiết</h3>
              <p className="value-desc">
                Kèm theo tài liệu hướng dẫn chăm sóc chi tiết cho từng loại hoa
                lan.
              </p>
            </div>
            <div className="value-item">
              <div className="value-icon">🏆</div>
              <h3 className="value-title">Bảo hành chất lượng</h3>
              <p className="value-desc">
                Cam kết đổi trả trong 30 ngày nếu hoa lan không phát triển tốt.
              </p>
            </div>
            <div className="value-item">
              <div className="value-icon">💝</div>
              <h3 className="value-title">Dịch vụ tận tâm</h3>
              <p className="value-desc">
                Hỗ trợ khách hàng 24/7 với đội ngũ chuyên viên giàu kinh nghiệm.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="about-container">
          <div className="cta-content">
            <h2 className="cta-title">Sẵn sàng khám phá thế giới hoa lan?</h2>
            <p className="cta-subtitle">
              Hãy để chúng tôi đồng hành cùng bạn trong hành trình yêu hoa lan
            </p>
            <div className="cta-actions">
              <button className="cta-primary" onClick={onNavigateToProducts}>
                Khám phá sản phẩm
              </button>
              <button className="cta-secondary" onClick={onNavigateToContact}>
                Liên hệ tư vấn
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
