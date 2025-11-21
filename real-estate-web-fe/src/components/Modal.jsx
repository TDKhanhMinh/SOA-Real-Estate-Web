import React from 'react';
import { BsX } from 'react-icons/bs';


export const Modal = ({ isOpen, onClose, title, children, className }) => {
    if (!isOpen) {
        return null;
    }

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (

        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300"
            onClick={handleOverlayClick}
        >

            <div className={`relative w-full  transform rounded-lg bg-white shadow-xl transition-all duration-300 ${className ? className : "max-w-lg"}`}>
                <div className="flex items-center justify-between border-b border-gray-200 p-5">
                    <h3 className="text-2xl font-bold text-gray-800">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-2xl text-gray-400 transition-colors hover:text-gray-700 focus:outline-none"
                        aria-label="Đóng modal"
                    >
                        <BsX />
                    </button>
                </div>


                <div className="p-6">
                    {children}
                </div>


                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 text-right">
                    <button
                        onClick={onClose}
                        className="rounded-lg bg-gray-600 px-4 py-2 font-semibold text-white shadow-md transition-all hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
};

