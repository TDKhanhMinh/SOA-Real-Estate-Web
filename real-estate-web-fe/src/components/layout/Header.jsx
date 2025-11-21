import Button from "../Button";
import avatar from "../../assets/img/avatar.jpg";
import DropDownMenu from "../DropDownMenu";
import { ACCOUNT_ITEMS } from "../../assets/js/account-items";
import { FaChevronDown } from "react-icons/fa";
import { getToken, getUser } from "../../utils/auth";
import { useEffect, useState } from "react";

const navItems = [
  { href: "https://vnexpress.net/bat-dong-san", title: "Tin tức" },
  { href: "", title: "Dự án" },
  { href: "", title: "Tin tức" },
  { href: "", title: "Phân tích đánh giá" },
  { href: "", title: "Wiki BĐS" },

];

export default function Header() {
  const isLogin = getToken() ? true : false
  const [user, setUser] = useState();


  useEffect(() => {
    if (isLogin) {
      const u = getUser();
      setUser(u);
    }
  }, [isLogin]);

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
                    <div>
                      <img src={user?.avatarUrl || "https://th.bing.com/th/id/R.e764fc1c705687a6f4770ac6ead4a955?rik=Ik0ulhYQHntUPg&pid=ImgRaw&r=0"} alt="avatar" className="w-10 h-10 rounded-full" />
                    </div>
                    {user?.name || "User"}
                    <FaChevronDown className="mx-2" />
                  </div>
                </DropDownMenu>
              )
          }

        </div>
        <Button
          to={"/account/post"}
          className="px-4 border rounded-full hover:bg-gray-200 bg-transparent"
          title="Đăng tin"
        />
      </div>
    </header>
  );
}
