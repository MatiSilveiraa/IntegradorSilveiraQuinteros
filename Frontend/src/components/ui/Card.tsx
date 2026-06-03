type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={`
        bg-[#1a211d]
        rounded-3xl
        p-6
        border
        border-[#2d463b]
        ${className}
      `}
    >
      {children}
    </div>
  );
}