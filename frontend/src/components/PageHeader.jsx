//this is the header at the top of every page

function PageHeader({ eyebrow, title, description, actions }){  {/*it is the contents controlling the header*/}
  return (
    <div className="flex flex-col gap-4 border-b border-[#263247] pb-6 lg:flex-row lg:items-end lg:justify-between"> 
    {/*this is the main container of the header it handles mobile screen and large screen*/}
      <div>
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#22C55E]">{eyebrow}</p>} {/*Conditional rendering: shows eyebrow text only if value exists to avoid empty ui*/}
        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#F8FAFC]">{title}</h1>
        {description && <p className="mt-2 max-w-3xl text-sm leading-6 text-[#94A3B8]">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

export default PageHeader;


/*Layout rules:

Screen	Behavior
mobile	column (top to bottom)
large screen	row (side by side)
*/