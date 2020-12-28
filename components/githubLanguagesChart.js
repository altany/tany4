import { language } from "gray-matter";
import React from "react";
import { PieChart, Pie, Legend, Tooltip } from "recharts";
import useSWR from "swr";

export default function Chart() {
  const fetcher = (url) => fetch(url).then((r) => r.json());
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
  const RADIAN = Math.PI / 180;

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

  return (
    <PieChart width={500} height={400}>
      <Pie
        dataKey="value"
        isAnimationActive={true}
        data={chartData}
        cx={200}
        cy={200}
        outerRadius={150}
        label={renderCustomizedLabel}
        fill="#79769c"
      />
      <Tooltip />
    </PieChart>
  );
}
