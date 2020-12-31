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
import Repos from "./repos";
import styles from "../../styles/utils.module.scss";
import fetcher from "../../lib/fetcher";

const selectColor = (number) => {
  const hue = number * 137.508; // use golden angle approximation
  return `hsl(${hue},50%,65%)`;
};

export default function Chart() {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeLanguage, setActiveLanguage] = useState(null);

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
  const clickSector = (data, index) => {
    const language = data.payload.name;
    setActiveLanguage(language);
  };

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chart}>
        <ResponsiveContainer width="94%">
          <PieChart>
            <Pie
              dataKey="value"
              isAnimationActive={true}
              data={chartData}
              fill="#79769c"
              minAngle={1}
              paddingAngle={1}
              innerRadius="55%"
              activeIndex={activeIndex}
              onMouseEnter={hoverSector}
              onClick={clickSector}
              activeShape={<ActiveSector />}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={selectColor(index)} />
              ))}
            </Pie>
            <Legend
              onMouseOver={hoverSector}
              onClick={clickSector}
              iconSize={20}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.repoInfo}>
        <Repos language={activeLanguage} />
      </div>
    </div>
  );
}
