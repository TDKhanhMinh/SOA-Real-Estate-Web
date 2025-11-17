import React, { useState } from 'react';
import { PromotionModal } from '../../components/payment/PromotionModal';
import { PaymentContent } from '../../components/payment/PaymentContent';

const mockUser = {
    fullName: 'Nguyễn Trường Nam',
    imageUrl: 'https://png.pngtree.com/png-vector/20190710/ourlarge/pngtree-user-vector-avatar-png-image_1541962.jpg',
    accountBalance: 1250000,
    paymentCode: 'NAP123456',
    phone: '090xxxxxxx',
};


export default function Payment() {
    const [user] = useState(mockUser);
    const [paymentOption, setPaymentOption] = useState('vnpay');
    const [showModal, setShowModal] = useState(false);
    return (
        <div className="bg-gray-100 min-h-screen w-full">
            <div className="flex w-full">
                <PaymentContent
                    user={user}
                    paymentOption={paymentOption}
                    setPaymentOption={setPaymentOption}
                    showModal={showModal}
                    setShowModal={setShowModal}
                />
            </div>
            <PromotionModal show={showModal} onClose={() => setShowModal(false)} />
        </div>
    );
}