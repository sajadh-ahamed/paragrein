import { Link } from 'react-router-dom'; // because we want to navigate to different pages without full page reload usually here for home page
import { brandImages } from '../assets/imageAssets.js';


//access images easily example for logo <brandLogo mark="full" /> or <brandLogo mark="circle" /> or <brandLogo mark="full" showSlogan={false} /> 
function BrandLogo({ compact = false, to = '/', mark = 'circle', showSlogan = true, className = '' }) {
  const logoSrc = mark === 'full' ? brandImages.logo : brandImages.logoCircle;
  const logoAlt = mark === 'full' ? 'Paragrein logo' : 'Paragrein circular logo';

//link means -  <a href="/">
 return (
  // React Router link (works like <a href=""> without reloading the page)
  <Link
    to={to} // Go to the page stored in "to" (default "/")
    className={`flex items-center gap-3 ${className}`} // Display logo and text side by side
  >
    {/* Box that contains the logo image */}
    <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-lg border border-[#22C55E]/30 bg-[#07110B] shadow-lg shadow-[#22C55E]/20">
      {/* Display the selected logo image */}
      <img
        src={logoSrc} // Image path (logo or circle logo)
        alt={logoAlt} // Alternative text if image doesn't load
        className="h-full w-full object-contain p-1" // Make image fit inside the box
      />
    </span>
    {/* Show the text only if compact is FALSE */}
    {!compact && (
      <span>
        {/* Company name */}
        <span className="block text-lg font-black tracking-tight text-[#F8FAFC]">
          Paragrein
        </span>
        {/* Show slogan only if showSlogan is TRUE */}
        {showSlogan && (
          <span className="block text-xs font-medium text-[#94A3B8]">
            Move Smart. Move Paragrein.
          </span>
        )}
      </span>
    )}
  </Link>
);
}

export default BrandLogo;
