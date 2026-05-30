const InfoCard = ({icon, label, value, color}) => {
    // Map existing color prop classes to modern premium mesh gradients
    let cardStyle = "";
    let iconBg = "";

    if (color?.includes("purple") || color?.includes("indigo")) {
        cardStyle = "mesh-balance shadow-indigo-500/10";
        iconBg = "bg-white/15 text-white border-white/20";
    } else if (color?.includes("green") || color?.includes("emerald")) {
        cardStyle = "mesh-income shadow-emerald-500/10";
        iconBg = "bg-white/15 text-white border-white/20";
    } else if (color?.includes("red") || color?.includes("rose")) {
        cardStyle = "mesh-expense shadow-rose-500/10";
        iconBg = "bg-white/15 text-white border-white/20";
    } else {
        cardStyle = "glass-panel text-gray-800 border-white/50";
        iconBg = "bg-purple-100 text-purple-700 border-purple-200/30";
    }

    return (
        <div className={`flex gap-5 p-6 rounded-2xl border shadow-md transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-lg ${cardStyle}`}>
            <div className={`w-14 h-14 flex items-center justify-center text-[24px] rounded-full border shadow-inner relative overflow-hidden group shrink-0 ${iconBg}`}>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 transition-transform duration-300 group-hover:scale-110">{icon}</span>
            </div>
            <div className="flex flex-col justify-center min-w-0">
                <h6 className="text-[11px] font-bold tracking-wider uppercase opacity-75 mb-0.5 truncate">{label}</h6>
                <span className="text-2xl font-bold tracking-tight truncate">&#8377;{value}</span>
            </div>
        </div>
    );
};

export default InfoCard;