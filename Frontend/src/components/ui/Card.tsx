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
        relative
        overflow-hidden
        rounded-3xl
        border
        border-[#2d463b]
        bg-gradient-to-br
        from-[#1b2a23]
        to-[#15211c]
        p-6
        shadow-lg
        shadow-black/20
        transition-all
        duration-300
        hover:border-[#4adea8]/40
        hover:shadow-[#4adea8]/10
        hover:-translate-y-1
        ${className}
      `}
    >
      <div
        className="
          absolute
          top-0
          left-0
          right-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#4adea8]/40
          to-transparent
        "
      />

      {children}
    </div>
  );
}