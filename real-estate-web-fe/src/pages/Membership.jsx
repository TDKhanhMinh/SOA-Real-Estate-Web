export default function Membership() {
    const plans = [
        {
            name: "Hội viên Cơ bản",
            desc: "Phù hợp với môi giới mới hoặc giỏ hàng nhỏ",
            price: "517.000 đ/tháng",
            discount: "-32%",
            save: "243.000 đ mỗi tháng",
            highlight: false,
            features: [
                { text: "Tin VIP Vàng (hiển thị 7 ngày)", available: false },
                { text: "Tin VIP Bạc (hiển thị 7 ngày)", available: false },
                { text: "15 Tin Thường (hiển thị 10 ngày)", available: true },
                { text: "15 lượt đẩy cho Tin Thường", available: true },
            ],
            extras: [
                { text: "Bản quyền ảnh", available: false },
                { text: "Hẹn giờ đăng tin", available: false },
                { text: "Báo cáo hiệu suất", available: false },
            ],
        },
        {
            name: "Hội viên Tiêu chuẩn",
            desc: "Phù hợp với môi giới chuyên nghiệp có giỏ hàng từ 10 BDS",
            price: "1.383.000 đ/tháng",
            discount: "-34%",
            save: "729.000 đ mỗi tháng",
            highlight: true,
            features: [
                { text: "Tin VIP Vàng (hiển thị 7 ngày)", available: false },
                { text: "1 Tin VIP Bạc (hiển thị 7 ngày)", available: true },
                { text: "30 Tin Thường (hiển thị 10 ngày)", available: true },
                { text: "30 lượt đẩy cho Tin Thường", available: true },
            ],
            extras: [
                { text: "Bản quyền ảnh", available: true },
                { text: "Hẹn giờ đăng tin", available: true },
                { text: "Báo cáo hiệu suất", available: true },
            ],
        },
        {
            name: "Hội viên Cao cấp",
            desc: "Phù hợp với môi giới có giỏ hàng và ngân sách quảng cáo lớn",
            price: "2.833.000 đ/tháng",
            discount: "-39%",
            save: "1.812.000 đ mỗi tháng",
            highlight: false,
            features: [
                { text: "1 Tin VIP Vàng (hiển thị 7 ngày)", available: true },
                { text: "2 Tin VIP Bạc (hiển thị 7 ngày)", available: true },
                { text: "50 Tin Thường (hiển thị 10 ngày)", available: true },
                { text: "50 lượt đẩy cho Tin Thường", available: true },
            ],
            extras: [
                { text: "Bản quyền ảnh", available: true },
                { text: "Hẹn giờ đăng tin", available: true },
                { text: "Báo cáo hiệu suất", available: true },
            ],
        },
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header với background */}
            <div
                className="relative bg-cover bg-center text-white rounded-b-2xl"
                style={{
                    backgroundImage:
                        "url('https://batdongsan.com.vn/sellernet/static/media/bg_register.add1ccce.png')",
                }}
            >
                <div className=" bg-opacity-80 p-10 rounded-b-2xl">
                    <h1 className="text-3xl font-bold mb-4">Gói Hội viên</h1>
                    <p className="text-xl font-semibold text-red-200 mb-6">
                        Tiết kiệm đến <span className="text-white">39%</span> chi phí so với
                        đăng tin/đẩy tin lẻ
                    </p>

                    <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                            📦 Thành thơi đăng tin/đẩy tin không lo biến động giá
                        </li>
                        <li className="flex items-center gap-2">
                            👍 Quản lý ngân sách dễ dàng và hiệu quả
                        </li>
                        <li className="flex items-center gap-2">
                            ⚙️ Sử dụng các tính năng tiện ích nâng cao dành cho Hội viên
                        </li>
                    </ul>

                    <p className="mt-4 text-xs text-red-200">
                        Giá của các gói bên dưới chưa bao gồm 8% VAT.
                    </p>
                </div>
            </div>


            <div className="max-w-7xl mx-auto px-6 mt-4">
                <div className="bg-gray-50 min-h-screen py-10 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-6 ">
                            {plans.map((plan, idx) => (
                                <div
                                    key={idx}
                                    className={`transform transition-transform duration-300 hover:scale-105 bg-white border rounded-xl shadow p-6 relative ${plan.highlight ? "ring-2 ring-yellow-400" : ""
                                        }`}
                                >
                                    {plan.highlight && (
                                        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            Bán chạy nhất
                                        </span>
                                    )}

                                    <h3 className="text-lg font-bold text-red-600 mb-1">
                                        {plan.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">{plan.desc}</p>

                                    <p className="text-xl font-bold">
                                        {plan.price}{" "}
                                        <span className="text-red-500 text-sm font-semibold">
                                            ({plan.discount})
                                        </span>
                                    </p>
                                    <p className="text-green-600 text-sm mb-4">
                                        Tiết kiệm đến {plan.save}
                                    </p>

                                    <button className="w-full bg-white border border-red-500 text-red-500 font-semibold py-2 rounded hover:bg-red-50 transition mb-4">
                                        Mua ngay
                                    </button>

                                    <h4 className="font-semibold mb-2">Gói tin hằng tháng</h4>
                                    <ul className="space-y-1 mb-4">
                                        {plan.features.map((f, i) => (
                                            <li
                                                key={i}
                                                className={`flex items-center gap-2 text-sm ${f.available ? "text-green-600" : "text-gray-400"
                                                    }`}
                                            >
                                                {f.available ? "✔" : "✘"} {f.text}
                                            </li>
                                        ))}
                                    </ul>

                                    <h4 className="font-semibold mb-2">Tiện ích</h4>
                                    <ul className="space-y-1">
                                        {plan.extras.map((f, i) => (
                                            <li
                                                key={i}
                                                className={`flex items-center gap-2 text-sm ${f.available ? "text-green-600" : "text-gray-400"
                                                    }`}
                                            >
                                                {f.available ? "✔" : "✘"} {f.text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );






}
