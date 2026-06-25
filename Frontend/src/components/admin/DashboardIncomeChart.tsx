import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  data: {
    mes: string;
    total: number;
  }[];
};

export default function DashboardIncomeChart({
  data,
}: Props) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-[#2d463b]
        bg-[#1a211d]
        p-7
        h-full
      "
    >
      <div className="flex justify-between items-center mb-8">

        <div>
          <h2 className="text-2xl font-bold">
            Ingresos últimos 6 meses
          </h2>

          <p className="text-gray-400 mt-1">
            Evolución mensual
          </p>
        </div>

        <div
          className="
            px-4
            py-2
            rounded-xl
            bg-[#12201b]
            border
            border-[#2d463b]
            text-gray-300
          "
        >
          Últimos 6 meses
        </div>

      </div>

      <ResponsiveContainer
        width="100%"
        height={340}
      >
        <AreaChart data={data}>

          <defs>

            <linearGradient
              id="income"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="5%"
                stopColor="#4adea8"
                stopOpacity={0.4}
              />

              <stop
                offset="95%"
                stopColor="#4adea8"
                stopOpacity={0}
              />

            </linearGradient>

          </defs>

          <CartesianGrid
            stroke="#2d463b"
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="mes"
            stroke="#8e9b94"
          />

          <YAxis
            stroke="#8e9b94"
          />

          <Tooltip
            contentStyle={{
              background: "#12201b",
              border: "1px solid #2d463b",
              borderRadius: 12,
            }}
            formatter={(value) => [`$ ${Number(value).toLocaleString("es-UY")}`, "Ingresos"]}
          />

          <Area
            type="monotone"
            dataKey="total"
            stroke="#4adea8"
            strokeWidth={4}
            fill="url(#income)"
          />

        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}