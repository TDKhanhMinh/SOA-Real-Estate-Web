import { FaPhoneAlt, FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaGooglePlay, FaApple } from "react-icons/fa";
import { HiOutlineMail, HiLocationMarker } from "react-icons/hi";
import { MdSupportAgent } from "react-icons/md";
import avatar from "../../assets/img/avatar.jpg";


export default function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-800 mt-6">
      <hr />
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex justify-center items-start lg:justify-center items-start mt-2">
          <img src={avatar} alt="logo" className="w-20 h-20 rounded-full" />
        </div>

        <div className="flex items-center space-x-3">
          <FaPhoneAlt className="w-8 h-8 text-blue-600" />
          <div>
            <h6 className="font-light">Hotline</h6>
            <p className="font-bold">1900 1080</p>
          </div>
        </div>

        <div className="flex items-center items-start space-x-3">
          <HiOutlineMail className="w-8 h-8 text-green-600" />
          <div>
            <h6 className="font-light">Hỗ trợ khách hàng</h6>
            <p className="font-bold">trandokhanhminh@gmail.com</p>
          </div>
        </div>

        <div className="flex items-center items-start space-x-3">
          <MdSupportAgent className="w-8 h-8 text-indigo-600" />
          <div>
            <h6 className="font-light">Chăm sóc khách hàng</h6>
            <p className="font-bold">trandokhanhminh@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-sm">
        <div>
          <h6 className="uppercase font-bold mb-3">
            Tập đoàn Bất động sản Thỏ bảy màu VIỆT NAM
          </h6>
          <p className="flex items-center items-start space-x-2 mt-2">
            <HiLocationMarker className="w-5 h-5 text-gray-600 mt-1" />
            <span>
              Tầng 45, LandMark 81, 720A Điện Biên Phủ, Bình Thạnh, HCM
            </span>
          </p>
          <p className="flex items-center space-x-2 mt-2">
            <FaPhoneAlt className="w-5 h-5 text-gray-600" />
            <span>(024) 3562 5939 - (024) 3562 5940</span>
          </p>
        </div>

        <div>
          <h6 className="uppercase font-bold mb-3">Về chúng tôi</h6>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <FaFacebook className="text-blue-600" /> <span>Facebook</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaTwitter className="text-sky-400" /> <span>Twitter</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaInstagram className="text-pink-500" /> <span>Instagram</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaYoutube className="text-red-600" /> <span>Youtube</span>
            </li>
          </ul>
        </div>

        <div>
          <h6 className="uppercase font-bold mb-3">Hỗ trợ khách hàng</h6>
          <ul className="space-y-2">
            <li>Hướng dẫn mua hàng</li>
            <li>Phương thức thanh toán</li>
            <li>Chính sách trả góp</li>
            <li>Chính sách bảo hành</li>
            <li>Phương thức vận chuyển</li>
            <li>Chính sách bảo mật thông tin</li>
          </ul>
        </div>

        <div>
          <h6 className="uppercase font-bold mb-3">Tải ứng dụng</h6>
          <ul className="space-y-2">
            <li className="flex items-center space-x-2">
              <FaGooglePlay className="text-green-600" /> <span>Google Play</span>
            </li>
            <li className="flex items-center space-x-2">
              <FaApple className="text-gray-800" /> <span>App Store</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-blue-700 text-center py-4">
        <span className="text-white text-sm">
          Copyright &copy; <strong>Thỏ Bảy màu Corporation Website</strong> 2025
        </span>
      </div>
    </footer>
  );
}
