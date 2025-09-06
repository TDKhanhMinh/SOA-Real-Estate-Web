import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faWallet,
  faHeadset,
  faKey,
  faBars,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";
import { faCrown } from "@fortawesome/free-solid-svg-icons/faCrown";

export const ACCOUNT_ITEMS = [
  {
    title: "Tổng quan",
    icon: <FontAwesomeIcon icon={faBars} style={{ color: "#2563eb" }} />,
    to: "/user/account",
  },
  {
    title: "Gói hội viên",
    icon: <FontAwesomeIcon icon={faCrown} style={{ color: "#facc15" }} />,
    to: "/account/membership",
  },
  {
    title: "Quản lí tin đăng",
    icon: (
      <FontAwesomeIcon icon={faChartPie} style={{ color: "#ea580c" }} />
    ),
    to: "/account/listing",
  },
  {
    title: "Thay đổi mật khẩu",
    icon: <FontAwesomeIcon icon={faKey} style={{ color: "#9333ea" }} />,
    to: "/change-password",
  },
  {
    title: "Nạp tiền",
    icon: <FontAwesomeIcon icon={faWallet} style={{ color: "#3b82f6" }} />,
    to: "/user/deposit",
  },
  {
    title: "Trung tâm trợ giúp",
    icon: <FontAwesomeIcon icon={faHeadset} style={{ color: "#0ea5e9" }} />,
    to: "/account/support",
  },
  {
    title: "Đăng xuất",
    icon: (
      <FontAwesomeIcon icon={faArrowRightFromBracket} style={{ color: "#64748b" }} />
    ),
    to: "/",
  },
];
