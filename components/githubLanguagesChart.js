import { language } from "gray-matter";
import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import useSWR from "swr";
import styles from "../styles/utils.module.scss";
import fetcher from "../lib/fetcher";

const RADIAN = Math.PI / 180;
const COLORS = ["#ee7c79", "#16857e", "#ffe4c1", "#3d5d5d"];

const PieLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  name,
}) => {
  const radius = outerRadius + 15;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className={styles.label}
    >
      {`${name} ${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload, ...rest }) => {
  if (active) {
    const label = payload[0]?.name;
    const value = payload[0]?.value;
    return (
      <div className={styles.tooltip}>{`Repos with ${label}: (soon...)`}</div>
    );
  }

  return null;
};
export default function Chart() {
  const { data, error } = useSWR(
    "https://github-api-altany.herokuapp.com/languages",
    fetcher
  );
  if (error) return <div>failed to load chart</div>;
  if (!data) return <div>loading chart data...</div>;
  const chartData = data.map(({ language, value }) => ({
    name: language,
    value,
  }));
  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="94%">
        <PieChart>
          <Pie
            dataKey="value"
            isAnimationActive={true}
            data={chartData}
            label={<PieLabel />}
            fill="#79769c"
            minAngle={1}
            paddingAngle={1}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
