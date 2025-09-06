import Button from "../Button";
import avatar from "../../assets/img/avatar.jpg";
import DropDownMenu from "../DropDownMenu";
import { ACCOUNT_ITEMS } from "../../assets/js/account-items";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaChevronDown } from "react-icons/fa";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";

const navItems = [
  { to: "/sale/all-sale", title: "Nhà đất bán" },
  { to: "/rental/all-rental", title: "Nhà đất cho thuê" },
  { href: "https://vnexpress.net/bat-dong-san", title: "Tin tức" },
  { href: "", title: "Dự án" },
  { href: "", title: "Tin tức" },
  { href: "", title: "Phân tích đánh giá" },
  { href: "", title: "Wiki BĐS" },

];

export default function Header() {
  const isLogin = true
  return (



    <header className="h-20 w-full fixed z-50 bg-white flex items-center justify-between shadow-lg">     
      <div className="flex items-center ml-4">
        <Button to="/" className="p-0">
          <img src={avatar} alt="logo" className="w-12 h-12 rounded-full" />
        </Button>
        <nav className="flex items-center space-x-1 text-sm font-bold ml-6">
          {navItems.map((item, idx) => (
            <Button
              key={idx}
              to={item.to}
              href={item.href}
              title={item.title}
              className="text-gray-800 px-1 py-1 hover:text-green-600 bg-transparent"
            />
          ))}
        </nav>
      </div>

      <div className="flex items-center space-x-4 mr-4">
        <div className="space-x-2">

          {
            !isLogin ?
              (
                <div className="">
                  <Button
                    to="/login"
                    className=" rounded-full hover:bg-gray-200 bg-transparent"
                    title="Đăng nhập"
                  />
                  <Button
                    to="/register"
                    className="rounded-full hover:bg-gray-200 bg-transparent"
                    title="Đăng ký"
                  />
                </div>
              ) :
              (
                <DropDownMenu items={ACCOUNT_ITEMS} className={"flex flex-col"} classNameBtn={"text-sm text-gray-950  lowercase font-normal capitalize hover:text-green-700"}>
                  <div className="flex items-center">
                    <FontAwesomeIcon icon={faCircleUser} className="h-6 w-6 mx-2 " />
                    Minh
                    <FaChevronDown className="mx-2" />
                  </div>
                </DropDownMenu>
              )
          }

        </div>
        <Button
          to="/post"
          className="px-4 border rounded-full hover:bg-gray-200 bg-transparent"
          title="Đăng tin"
        />
      </div>
    </header>
  );
}
