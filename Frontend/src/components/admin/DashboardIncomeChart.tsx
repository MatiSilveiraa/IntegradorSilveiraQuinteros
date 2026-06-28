import { useMemo, useState } from "react";

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

type Periodo = 1 | 3 | 6;

export default function DashboardIncomeChart({ data }: Props) {
  const [periodo, setPeriodo] = useState<Periodo>(6);

  const dataFiltrada = useMemo(() => {
    return data.slice(-periodo);
  }, [data, periodo]);

 const totalPeriodo = useMemo(() => {
  return dataFiltrada.reduce(
    (total, item) => total + Number(item.total),
    0
  );
}, [dataFiltrada]);

const promedioPeriodo = useMemo(() => {
  if (dataFiltrada.length === 0) return 0;

  return totalPeriodo / dataFiltrada.length;
}, [dataFiltrada, totalPeriodo]);

  const tituloPeriodo =
    periodo === 1
      ? "Último mes"
      : periodo === 3
      ? "Últimos 3 meses"
      : "Últimos 6 meses";

  return (
    <div className="rounded-3xl border border-[#2d463b] bg-[#1a211d] p-7">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-5 mb-8">
        <div>
          <h2 className="text-2xl font-bold">Ingresos</h2>

          <p className="text-gray-400 mt-1">
  Visualización de los ingresos registrados durante el período seleccionado.
</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {[1, 3, 6].map((opcion) => (
            <button
              key={opcion}
              type="button"
              onClick={() => setPeriodo(opcion as Periodo)}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                periodo === opcion
                  ? "bg-[#4adea8] text-[#12201b] border-[#4adea8]"
                  : "bg-[#12201b] text-gray-300 border-[#2d463b] hover:border-[#4adea8]"
              }`}
            >
              {opcion === 1
                ? "Último mes"
                : opcion === 3
                ? "3 meses"
                : "6 meses"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
          <p className="text-sm text-gray-400">
  Período analizado
</p>
          <h3
  key={tituloPeriodo}
  className="text-lg font-bold mt-1 text-[#4adea8] transition-all duration-300"
>
  {tituloPeriodo}
</h3>
        </div>

        <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
          <p className="text-sm text-gray-400">
  Ingresos del período
</p>
          <h3
  key={totalPeriodo}
  className="text-lg font-bold mt-1 transition-all duration-300"
>
  $ {totalPeriodo.toLocaleString("es-UY")}
</h3>
        </div>

        <div className="bg-[#12201b] border border-[#2d463b] rounded-2xl p-4">
          <p className="text-sm text-gray-400">Promedio mensual</p>
         <h3
  key={promedioPeriodo}
  className="text-lg font-bold mt-1 transition-all duration-300"
>
  $ {Math.round(promedioPeriodo).toLocaleString("es-UY")}
</h3>
        </div>
      </div>

      {dataFiltrada.length === 0 ? (
        <div className="h-[340px] flex items-center justify-center rounded-2xl border border-[#2d463b] bg-[#12201b] text-gray-400">
          No hay datos de ingresos para mostrar.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={340}>
          <AreaChart data={dataFiltrada}>
            <defs>
              <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4adea8" stopOpacity={0.4} />

                <stop offset="95%" stopColor="#4adea8" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#2d463b" strokeDasharray="3 3" />

            <XAxis dataKey="mes" stroke="#8e9b94" />

            <YAxis stroke="#8e9b94" />

            <Tooltip
              contentStyle={{
                background: "#12201b",
                border: "1px solid #2d463b",
                borderRadius: 12,
                color: "#ffffff",
              }}
              labelStyle={{
                color: "#ffffff",
              }}
              formatter={(value) => [
                `$ ${Number(value).toLocaleString("es-UY")}`,
                "Ingresos",
              ]}
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
      )}
    </div>
  );
}