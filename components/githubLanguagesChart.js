import { language } from "gray-matter";
import React from "react";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import useSWR from "swr";
import styles from "../styles/utils.module.scss";

const RADIAN = Math.PI / 180;

const fetcher = (url) => fetch(url).then((r) => r.json());

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  name,
}) => {
  const radius = outerRadius + 25;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${name} ${(percent * 100).toFixed(1)}%`}
    </text>
  );
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
      <div className={styles.pieChart}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              dataKey="value"
              isAnimationActive={true}
              data={chartData}
              label={renderCustomizedLabel}
              fill="#79769c"
              minAngle={1}
            />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div>
        <ResponsiveContainer>
          <BarChart data={chartData} layout="vertical">
            <Bar dataKey="value" fill="#79769c" minPointSize={1} label />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
