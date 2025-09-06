import { useState, useEffect } from "react";
import axios from "axios";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const host = "https://provinces.open-api.vn/api/";

export default function SearchForm() {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [form, setForm] = useState({
        searchKey: "",
        optionType: "sell",
        city: "",
        district: "",
        ward: "",
        houseType: "",
        rangePrice: "",
        sqmtRange: "",
    });

    useEffect(() => {
        axios.get(`${host}?depth=1`).then((res) => {
            setCities(res.data);
        });
    }, []);

    useEffect(() => {
        if (form.city) {
            axios.get(`${host}p/${form.city}?depth=2`).then((res) => {
                setDistricts(res.data.districts || []);
                setWards([]);
                setForm((prev) => ({ ...prev, district: "", ward: "" }));
            });
        }
    }, [form.city]);

    useEffect(() => {
        if (form.district) {
            axios.get(`${host}d/${form.district}?depth=2`).then((res) => {
                setWards(res.data.wards || []);
                setForm((prev) => ({ ...prev, ward: "" }));
            });
        }
    }, [form.district]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Dữ liệu form:", form);
        // TODO: call API search 
        navigate("/search-result", { state: { ...form } });
    };

    return (
        <div className="max-w-5xl mx-auto mt-6">
            <div className="bg-gray-300 rounded-lg p-4">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        name="searchKey"
                        value={form.searchKey}
                        onChange={handleChange}
                        placeholder="Tìm kiếm trên toàn quốc"
                        className="flex-1 px-4 py-2 rounded-lg border outline-none"
                    />
                    <Button type="submit" className="px-4 py-2 bg-white hover:bg-gray-200 text-white rounded-lg">
                        🔍
                    </Button>
                </form>

                <Button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg"
                >
                    {isOpen ? "Ẩn tìm kiếm chi tiết" : "Tìm kiếm chi tiết"}
                </Button>

                {isOpen && (
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-lg shadow p-4 mt-4 space-y-4"
                    >
                        <div className="flex gap-4">
                            <label className="px-4 py-2 border rounded-lg cursor-pointer">
                                <input
                                    type="radio"
                                    name="optionType"
                                    value="sell"
                                    checked={form.optionType === "sell"}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Nhà đất bán
                            </label>
                            <label className="px-4 py-2 border rounded-lg cursor-pointer">
                                <input
                                    type="radio"
                                    name="optionType"
                                    value="rent"
                                    checked={form.optionType === "rent"}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Nhà đất cho thuê
                            </label>
                        </div>

                        {/* City/District/Ward */}
                        <div className="flex gap-2">
                            <select
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                className="flex-1 border px-2 py-2 rounded-lg"
                            >
                                <option value="">Tỉnh/Thành phố</option>
                                {cities.map((c) => (
                                    <option key={c.code} value={c.code}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="district"
                                value={form.district}
                                onChange={handleChange}
                                className="flex-1 border px-2 py-2 rounded-lg"
                                disabled={!districts.length}
                            >
                                <option value="">Quận/Huyện</option>
                                {districts.map((d) => (
                                    <option key={d.code} value={d.code}>
                                        {d.name}
                                    </option>
                                ))}
                            </select>

                            <select
                                name="ward"
                                value={form.ward}
                                onChange={handleChange}
                                className="flex-1 border px-2 py-2 rounded-lg"
                                disabled={!wards.length}
                            >
                                <option value="">Phường/Xã</option>
                                {wards.map((w) => (
                                    <option key={w.code} value={w.code}>
                                        {w.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Other selects */}
                        <div className="flex gap-2">
                            <select
                                name="houseType"
                                value={form.houseType}
                                onChange={handleChange}
                                className="flex-1 border px-2 py-2 rounded-lg"
                            >
                                <option value="">Loại nhà đất</option>
                                <option value="1">Tất cả nhà đất</option>
                                <option value="2">Căn hộ chung cư</option>
                                <option value="3">Nhà riêng</option>
                            </select>
                            <select
                                name="rangePrice"
                                value={form.rangePrice}
                                onChange={handleChange}
                                className="flex-1 border px-2 py-2 rounded-lg"
                            >
                                <option value="">Mức giá</option>
                                <option value="2">Dưới 500 triệu</option>
                                <option value="5">1 - 2 tỷ</option>
                            </select>
                            <select
                                name="sqmtRange"
                                value={form.sqmtRange}
                                onChange={handleChange}
                                className="flex-1 border px-2 py-2 rounded-lg"
                            >
                                <option value="">Diện tích</option>
                                <option value="2">Dưới 30m²</option>
                                <option value="5">80 - 100m²</option>
                            </select>
                        </div>

                        <div className="text-right">
                            <Button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg"
                            >
                                Tìm kiếm
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}
