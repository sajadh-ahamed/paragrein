function ImageOverlayCard({
  image,
  alt,
  eyebrow,
  title,
  description,
  children,
  className = '',
  imageClassName = '',
}) {
  return (
    <article className={`group relative overflow-hidden rounded-lg border border-[#263247] bg-[#151B2B] shadow-xl shadow-black/20 ${className}`}>
      <img src={image} alt={alt} className={`absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105 ${imageClassName}`} />
      <div className="absolute inset-0 bg-gradient-to-br from-[#070B14]/95 via-[#070B14]/76 to-[#070B14]/50" />
      <div className="absolute inset-0 bg-[#22C55E]/5" />
      <div className="relative z-10 flex h-full flex-col justify-end p-5">
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#86EFAC]">{eyebrow}</p>}
        {title && <h3 className="mt-2 text-lg font-black text-[#F8FAFC]">{title}</h3>}
        {description && <p className="mt-2 text-sm leading-6 text-[#CBD5E1]">{description}</p>}
        {children}
      </div>
    </article>
  );
}

export default ImageOverlayCard;
