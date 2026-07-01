type Props = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
};

export default function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: Props) {
  return (
    <div>
      {label && (
        <label className="block text-sm text-gray-400 mb-2">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-3 rounded-xl bg-[#12201b] border border-[#2d463b] focus:outline-none focus:border-[#4adea8]"
      />
    </div>
  );
}