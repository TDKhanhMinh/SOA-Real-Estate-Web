import React, { useEffect, useState, useMemo } from 'react';

const PropertyImageGallery = ({ property }) => {
    const [mainImage, setMainImage] = useState(null);

    const imageUrls = useMemo(() => property?.imageUrls || [], [property?.imageUrls]);

    useEffect(() => {
        if (imageUrls.length > 0 && !mainImage) {
            setMainImage(imageUrls[0]);
        }
    }, [imageUrls, mainImage]);


    const handleThumbnailClick = (newImageUrl) => {
        setMainImage(newImageUrl);
    };

    if (imageUrls.length === 0) {
        return <div className="text-center py-10 text-gray-500">Không có ảnh nào để hiển thị.</div>;
    }

    return (
        <div className="w-full">
            <img
                src={mainImage}
                alt="Main Property Image"
                className="w-full h-[350px] object-cover rounded-xl shadow-lg border-4 border-white transition-opacity duration-300"
            />
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {imageUrls.map((img, i) => (
                    <button
                        key={i}
                        onClick={() => handleThumbnailClick(img)}
                        className={`p-0.5 rounded-xl transition ${img === mainImage ? 'border-2 border-blue-500 shadow-md' : 'border-2 border-transparent'
                            }`}
                    >
                        <img
                            src={img}
                            alt={`Thumbnail ${i}`}
                            className="w-32 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition duration-150"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PropertyImageGallery;
