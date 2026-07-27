import { brandImages } from '../assets/imageAssets.js';
import BrandLogo from '../components/BrandLogo.jsx';

function AuthLayout({ children, title, subtitle }) {
  return (
    <main
      className="flex min-h-screen items-center justify-start bg-[#070B14] bg-cover bg-center px-6 lg:px-24 xl:px-32 text-[#F8FAFC]"
      style={{ backgroundImage: `linear-gradient(rgba(7,11,20,0.30), rgba(7,11,20,0.50)), url(${brandImages.bgLogin})` }}
    >
      <section className="w-full max-w-md">
        <BrandLogo mark="full" />
        <div className="mt-8 rounded-lg border border-[#263247] bg-[#151B2B]/40 p-6 shadow-2xl shadow-black/30 backdrop-blur-md">
          <div className="mb-6">
            <h1 className="text-3xl font-black tracking-tight">{title}</h1>
            {subtitle && <p className="mt-2 text-sm leading-6 text-[#94A3B8]">{subtitle}</p>}
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
