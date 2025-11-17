export const PaymentOptionButton = ({ icon, label, isActive, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`bg-white shadow rounded-lg p-4 h-20 flex flex-col items-center justify-center text-center transition-all ${isActive
            ? 'ring-2 ring-black'
            : 'border border-gray-200 hover:shadow-md'
            }`}
    >
        {icon}
        <h6 className="text-sm font-semibold mt-1">{label}</h6>
    </button>
);