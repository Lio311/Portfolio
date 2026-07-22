interface SectionHeaderProps {
  badge?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export function SectionHeader({
  badge,
  title,
  subtitle,
  centered = true,
}: SectionHeaderProps) {
  return (
    <div
      className={`mb-16 flex flex-col ${
        centered ? "items-center text-center" : "items-start text-left"
      }`}
    >
      {badge && (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          {badge}
        </div>
      )}

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-poppins mb-4">
        {title}
      </h2>

      {subtitle && (
        <p className="max-w-2xl text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
          {subtitle}
        </p>
      )}

      <div
        className={`mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 ${
          centered ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
