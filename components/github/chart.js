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
import PieLabel from "./pieLabel";
import ReposTooltip from "./tooltip";
import styles from "../../styles/utils.module.scss";
import fetcher from "../../lib/fetcher";

const COLORS = ["#ee7c79", "#16857e", "#ffe4c1", "#3d5d5d"];

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
            innerRadius="50%"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip content={<ReposTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
