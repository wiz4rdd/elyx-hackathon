"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts"
import type { JourneyData, HealthPillar } from "@/lib/types";

interface DashboardChartProps {
  data: JourneyData[];
  pillars: HealthPillar[];
}

export function DashboardChart({ data, pillars }: DashboardChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 0,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[40, 100]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--background))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
            color: "hsl(var(--foreground))"
          }}
        />
        <Legend />
        {pillars.map((pillar) => (
          <Line
            key={pillar.key}
            type="monotone"
            dataKey={pillar.key}
            name={pillar.name}
            stroke={pillar.color}
            strokeWidth={2}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
