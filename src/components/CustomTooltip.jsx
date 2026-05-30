import {addThousandsSeparator} from "../util/util.js";

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/90 backdrop-blur-md shadow-md rounded-xl p-3 border border-white/60 animate-slide-up">
                <p className="text-xs font-bold text-indigo-600 mb-1">{payload[0].name}</p>
                <p className="text-xs text-gray-500 font-semibold">
                    Amount: <span className="text-sm font-bold text-gray-950 ml-0.5">&#8377;{addThousandsSeparator(payload[0].value)}</span>
                </p>
            </div>
        );
    }
    return null;
};

export default CustomTooltip;
