import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import CustomTooltip from "./CustomTooltip.jsx";
import CustomLegend from "./CustomLegend.jsx";

const CustomPieChart = ({ data, label, totalAmount, showTextAnchor, colors }) => {

    return (
        <ResponsiveContainer width="100%" height={380}>
            <PieChart>
                <Pie
                    data={data}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={125}
                    innerRadius={95}
                    cornerRadius={6}
                    paddingAngle={4}
                    labelLine={false}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={colors[index % colors.length]}
                            stroke="rgba(255,255,255,0.4)"
                            strokeWidth={2}
                        />
                    ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />

                {showTextAnchor && (
                    <>
                        <text
                            x="50%"
                            y="50%"
                            dy={-14}
                            textAnchor="middle"
                            fill="var(--text-muted)"
                            fontSize="12px"
                            fontWeight="700"
                            style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}
                        >
                            {label}
                        </text>
                        <text
                            x="50%"
                            y="50%"
                            dy={16}
                            textAnchor="middle"
                            fill="var(--text-main)"
                            fontSize="22px"
                            fontWeight="800"
                        >
                            {totalAmount}
                        </text>
                    </>
                )}
            </PieChart>
        </ResponsiveContainer>
    );
};

export default CustomPieChart;
