import React from "react";
import "./Footer.css";
import facebookIcon from "../images/facebook.png";
import instagramIcon from "../images/instagram.png";
import youtubeIcon from "../images/youtube.png";
import zaloIcon from "../images/icons8-zalo-512.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Company Info */}
        <div className="footer-section">
          <h3>🌺 Orchid Shop</h3>
          <p>
            Chuyên cung cấp các loài hoa lan đẹp và chất lượng cao. Mang vẻ đẹp
            thiên nhiên đến ngôi nhà của bạn.
          </p>
          <div className="social-links">
            <a
              href="https://facebook.com/orchidshop"
              className="social-link facebook"
            >
              <div className="icon-wrapper">
                <img
                  src={facebookIcon}
                  alt="Facebook"
                  className="social-icon"
                />
              </div>
            </a>
            <a
              href="https://instagram.com/orchidshop"
              className="social-link instagram"
            >
              <div className="icon-wrapper">
                <img
                  src={instagramIcon}
                  alt="Instagram"
                  className="social-icon"
                />
              </div>
            </a>
            <a
              href="https://youtube.com/@orchidshop"
              className="social-link youtube"
            >
              <div className="icon-wrapper">
                <img src={youtubeIcon} alt="YouTube" className="social-icon" />
              </div>
            </a>
            <a href="https://zalo.me/orchidshop" className="social-link zalo">
              <div className="icon-wrapper">
                <img src={zaloIcon} alt="Zalo" className="social-icon" />
              </div>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h4>Liên kết nhanh</h4>
          <ul className="footer-links">
            <li>
              <a href="#home">Trang chủ</a>
            </li>
            <li>
              <a href="#products">Sản phẩm</a>
            </li>
            <li>
              <a href="#about">Giới thiệu</a>
            </li>
            <li>
              <a href="#contact">Liên hệ</a>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div className="footer-section">
          <h4>Danh mục sản phẩm</h4>
          <ul className="footer-links">
            <li>
              <a href="#dendrobium">Lan Dendrobium</a>
            </li>
            <li>
              <a href="#phalaenopsis">Lan Hồ Điệp</a>
            </li>
            <li>
              <a href="#cattleya">Lan Cattleya</a>
            </li>
            <li>
              <a href="#oncidium">Lan Oncidium</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h4>Thông tin liên hệ</h4>
          <div className="contact-info">
            <p>📍 123 Đường Hoa Lan, Quận 1, TP.HCM</p>
            <p>📞 (028) 3123 4567</p>
            <p>✉️ info@orchidshop.com</p>
            <p>🕒 8:00 - 18:00 (Thứ 2 - Chủ nhật)</p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <div className="footer-container">
          <p>&copy; 2024 Orchid Shop. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
