import React, { useState } from "react";
import "./Contact.css";
import facebookIcon from "../../images/facebook.png";
import instagramIcon from "../../images/instagram.png";
import youtubeIcon from "../../images/youtube.png";
import zaloIcon from "../../images/icons8-zalo-512.png";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 3000);
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-container">
          <h1 className="contact-hero-title">Liên hệ với chúng tôi</h1>
          <p className="contact-hero-subtitle">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi
          </p>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="contact-info-section">
        <div className="contact-container">
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="contact-icon">📍</div>
              <h3 className="contact-info-title">Địa chỉ cửa hàng</h3>
              <p className="contact-info-text">
                123 Đường Hoa Lan, Phường 12
                <br />
                Quận Tân Bình, TP. Hồ Chí Minh
                <br />
                Việt Nam
              </p>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">📞</div>
              <h3 className="contact-info-title">Số điện thoại</h3>
              <p className="contact-info-text">
                Hotline: (028) 3123 4567
                <br />
                Di động: 0901 234 567
                <br />
                Zalo: 0901 234 567
              </p>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">✉️</div>
              <h3 className="contact-info-title">Email</h3>
              <p className="contact-info-text">
                info@orchidshop.vn
                <br />
                support@orchidshop.vn
                <br />
                sales@orchidshop.vn
              </p>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon">🕒</div>
              <h3 className="contact-info-title">Giờ hoạt động</h3>
              <p className="contact-info-text">
                Thứ 2 - Thứ 6: 8:00 - 18:00
                <br />
                Thứ 7 - Chủ nhật: 8:00 - 20:00
                <br />
                Lễ, Tết: 9:00 - 17:00
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="contact-form-section">
        <div className="contact-container">
          <div className="contact-main-grid">
            {/* Contact Form */}
            <div className="contact-form-container">
              <h2 className="section-title">Gửi tin nhắn cho chúng tôi</h2>
              <p className="form-subtitle">
                Điền thông tin vào form bên dưới, chúng tôi sẽ phản hồi trong
                vòng 24h
              </p>

              {showSuccess && (
                <div className="success-message">
                  <div className="success-icon">✅</div>
                  <p>
                    Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có
                    thể.
                  </p>
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Họ và tên *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="Nhập địa chỉ email"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Số điện thoại</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">Chủ đề</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                    >
                      <option value="">Chọn chủ đề</option>
                      <option value="general">Thông tin chung</option>
                      <option value="product">Sản phẩm</option>
                      <option value="order">Đặt hàng</option>
                      <option value="care">Hướng dẫn chăm sóc</option>
                      <option value="complaint">Khiếu nại</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Tin nhắn *</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    placeholder="Nhập nội dung tin nhắn của bạn..."
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  Gửi tin nhắn 📩
                </button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className="contact-map-container">
              <h3 className="map-title">Vị trí cửa hàng</h3>
              <div className="map-placeholder">
                <div className="map-content">
                  <div className="map-icon">🗺️</div>
                  <h4>Orchid Shop</h4>
                  <p>
                    123 Đường Hoa Lan, Phường 12
                    <br />
                    Quận Tân Bình, TP.HCM
                  </p>
                  <button className="map-btn">Xem trên Google Maps</button>
                </div>
              </div>

              <div className="social-contact">
                <h4>Kết nối với chúng tôi</h4>
                <div className="social-links">
                  <a
                    href="https://facebook.com/orchidshop"
                    className="social-link facebook"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="icon-wrapper">
                      <img
                        src={facebookIcon}
                        alt="Facebook"
                        className="social-icon"
                      />
                    </div>
                    <span>Facebook</span>
                  </a>
                  <a
                    href="https://instagram.com/orchidshop"
                    className="social-link instagram"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="icon-wrapper">
                      <img
                        src={instagramIcon}
                        alt="Instagram"
                        className="social-icon"
                      />
                    </div>
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://youtube.com/@orchidshop"
                    className="social-link youtube"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="icon-wrapper">
                      <img
                        src={youtubeIcon}
                        alt="YouTube"
                        className="social-icon"
                      />
                    </div>
                    <span>YouTube</span>
                  </a>
                  <a
                    href="https://zalo.me/orchidshop"
                    className="social-link zalo"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div className="icon-wrapper">
                      <img src={zaloIcon} alt="Zalo" className="social-icon" />
                    </div>
                    <span>Zalo</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="contact-faq">
        <div className="contact-container">
          <h2 className="section-title text-center">Câu hỏi thường gặp</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4 className="faq-question">
                🌺 Làm thế nào để chăm sóc hoa lan?
              </h4>
              <p className="faq-answer">
                Hoa lan cần ánh sáng gián tiếp, tưới nước 2-3 lần/tuần, và môi
                trường ẩm độ 60-80%. Chúng tôi sẽ cung cấp hướng dẫn chi tiết
                khi bạn mua hàng.
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">
                📦 Thời gian giao hàng là bao lâu?
              </h4>
              <p className="faq-answer">
                Nội thành TP.HCM: 1-2 ngày. Tỉnh thành khác: 3-5 ngày. Chúng tôi
                đảm bảo đóng gói cẩn thận để hoa lan không bị hư hại.
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">💰 Có chính sách đổi trả không?</h4>
              <p className="faq-answer">
                Có, chúng tôi hỗ trợ đổi trả trong 30 ngày nếu hoa lan không
                phát triển tốt do lỗi từ phía cửa hàng.
              </p>
            </div>
            <div className="faq-item">
              <h4 className="faq-question">🎓 Có dịch vụ tư vấn không?</h4>
              <p className="faq-answer">
                Có, đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn 24/7 qua
                hotline, email hoặc trực tiếp tại cửa hàng.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;
