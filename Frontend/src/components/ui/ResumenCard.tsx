type Props = {
  titulo: string;
  valor: number;
};

export default function ResumenCard({ titulo, valor }: Props) {
  return (
    <div className="bg-[#1a2b24] border border-[#2d463b] rounded-3xl p-6">
      <p className="text-sm text-gray-400">{titulo}</p>

      <h2 className="text-4xl font-bold mt-3">{valor}</h2>
    </div>
  );
}