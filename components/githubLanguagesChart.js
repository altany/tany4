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
  return (
    <PieChart width={500} height={400}>
      <Pie
        dataKey="value"
        isAnimationActive={true}
        data={chartData}
        cx={200}
        cy={200}
        outerRadius={150}
        fill="#8884d8"
        label
      />
      <Tooltip />
    </PieChart>
  );
}
