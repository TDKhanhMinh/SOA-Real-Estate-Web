import React from "react";

export default function NewsSection() {

    const news = [
        {
            title: "Giá Nhà Liền Thổ Giảm Mạnh, Chung Cư Liên Tục Tăng",
            description:
                "Tiếp nối thành công của Saigon Centre và Estella Place, Keppel đã gia nhập cuộc đua bất động sản thương mại tại Hà Nội...",
            image:
                "https://img.iproperty.com.my/angel/610x342-crop/wp-content/uploads/sites/7/2023/12/DJI_0050.jpg",
            link: "https://laodong.vn/bat-dong-san/gia-chung-cu-tang-nhanh-khien-nhieu-nguoi-dan-bat-ngo-sung-sot-1324227.ldo",
        },
        {
            title: "Phân Khúc Bất Động Sản Nào Đang Thăng Hoa Nhờ Nguồn Vốn FDI?",
            description:
                "Báo cáo mới nhất của Tổng cục Thống kê đưa ra thông tin về dòng vốn FDI...",
            image:
                "https://img.iproperty.com.my/angel/750x1000-fit/wp-content/uploads/sites/7/2024/11/von-FDI-1.webp",
            link: "https://tienphong.vn/kinh-doanh-bat-dong-san-dung-thu-2-ve-thu-hut-von-fdi-post1674532.tpo",
        },
        {
            title: "Cơ Hội Tham Gia Sự Kiện Lớn Bậc Nhất Ngành Bất Động Sản",
            description:
                "Hội nghị Bất động sản Việt Nam – VRES được tổ chức từ 2014 đến nay...",
            image:
                "https://img.iproperty.com.my/angel/750x1000-fit/wp-content/uploads/sites/7/2024/11/Hoi-nghi-VRES-2023-scaled.jpg",
            link: "https://dantri.com.vn/bat-dong-san/co-hoi-tham-gia-su-kien-hang-dau-nganh-bat-dong-san-20241119231458488.htm",
        },
        {
            title: "Dự Án Bất Động Sản Gặp Khó Vì Cách Tính Tiền Sử Dụng Đất",
            description: "Thị trường bất động sản đang trên đà phục hồi...",
            image:
                "https://img.iproperty.com.my/angel/750x1000-fit/wp-content/uploads/sites/7/2024/11/chung-cu-1.jpg",
            link: "https://baothanhhoa.vn/du-an-bat-dong-san-gap-kho-vi-cach-tinh-tien-su-dung-dat-230761.htm",
        },
        {
            title: "Dự Án Bất Động Sản Gặp Khó Vì Cách Tính Tiền Sử Dụng Đất",
            description: "Thị trường bất động sản đang trên đà phục hồi...",
            image:
                "https://img.iproperty.com.my/angel/750x1000-fit/wp-content/uploads/sites/7/2024/11/chung-cu-1.jpg",
            link: "https://baothanhhoa.vn/du-an-bat-dong-san-gap-kho-vi-cach-tinh-tien-su-dung-dat-230761.htm",
        },
        {
            title: "Dự Án Bất Động Sản Gặp Khó Vì Cách Tính Tiền Sử Dụng Đất",
            description: "Thị trường bất động sản đang trên đà phục hồi...",
            image:
                "https://img.iproperty.com.my/angel/750x1000-fit/wp-content/uploads/sites/7/2024/11/chung-cu-1.jpg",
            link: "https://baothanhhoa.vn/du-an-bat-dong-san-gap-kho-vi-cach-tinh-tien-su-dung-dat-230761.htm",
        },
    ];
    if (!news || news.length === 0) return null;

    const [first, ...others] = news;

    return (
        <div className="container mx-auto max-w-6xl pt-12">
            <h4 className="uppercase text-center my-4 font-bold text-lg">
                Tin Tức Nổi Bật
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                    href={first.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-lg overflow-hidden shadow bg-gray-100 hover:shadow-lg transition"
                >
                    <img
                        src={first.image}
                        alt={first.title}
                        className="w-full max-h-[340px] object-cover"
                    />
                    <div className="p-4">
                        <h5 className="text-lg font-semibold">{first.title}</h5>
                        <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                            {first.description}
                        </p>
                    </div>
                </a>

                {/* Các bài nhỏ bên phải */}
                <div className="flex flex-col gap-3">
                    {others.map((item, idx) => (
                        <a
                            key={idx}
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex bg-gray-100 rounded-lg overflow-hidden hover:shadow transition"
                            style={{ maxHeight: "120px" }}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-40 h-auto object-cover rounded-l-md"
                            />
                            <div className="p-2 flex flex-col">
                                <h6 className="font-semibold text-sm">{item.title}</h6>
                                <p className="text-gray-600 text-xs line-clamp-2">
                                    {item.description}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}
