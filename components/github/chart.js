import { language } from "gray-matter";
import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Sector,
  Legend,
} from "recharts";
import useSWR from "swr";
import ActiveSector from "./activeSector";
import styles from "../../styles/utils.module.scss";
import fetcher from "../../lib/fetcher";

const selectColor = (number) => {
  const hue = number * 137.508; // use golden angle approximation
  return `hsl(${hue},50%,65%)`;
};

export default function Chart() {
  const [activeIndex, setActiveIndex] = useState(null);

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

  const hoverSector = (_, index) => setActiveIndex(index);

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="94%">
        <PieChart>
          <Pie
            dataKey="value"
            isAnimationActive={true}
            data={chartData}
            fill="#79769c"
            minAngle={1}
            paddingAngle={1}
            innerRadius="50%"
            activeIndex={activeIndex}
            onMouseEnter={hoverSector}
            activeShape={<ActiveSector />}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={selectColor(index)} />
            ))}
          </Pie>
          <Legend layout="vertical" align="right" onMouseOver={hoverSector} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
