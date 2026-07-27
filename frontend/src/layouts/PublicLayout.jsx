//used by landing page
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";//used to scroll to specific section of the page
import BrandLogo from "../components/BrandLogo.jsx";
import { getUser } from "../utils/authStorage.js"; //example {"username":"Sajadh","role":"CUSTOMER"}

// Navigation menu data
// Instead of writing multiple HashLink manually,
// we store the objects in an array and use map()
const sectionLinks = [
  {
    label: "Home",
    id: "home",
  },
  {
    label: "About Us",
    id: "about",
  },
  {
    label: "Services",
    id: "services",
  },
  {
    label: "Careers",
    id: "careers",
  },
  {
    label: "Contact Us",
    id: "contact",
  },
];

//childeren is a special prop that allows you to pass components or elements as children to the PublicLayout component. It enables you to create reusable layout components that can wrap different content while maintaining a consistent structure and styling.
function PublicLayout({ children }) {
  const user = getUser(); // {"username":"Sajadh","role":"CUSTOMER"} if not logged in then null

  return (
    <div className="min-h-screen bg-[#070B14] text-[#F8FAFC]">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070B14]/95 backdrop-blur-xl">
        <nav className="mx-auto flex min-h-[76px] w-full max-w-7xl items-center justify-between gap-4 px-6 lg:px-8">
          <BrandLogo mark="circle" showSlogan={false} />
          <div className="hidden items-center gap-1 lg:flex">
            {/* use for smooth scrolling */}     
            {sectionLinks.map(({ label, id }) => (
              <HashLink
                key={id}
                smooth
                to={`/#${id}`}
                className="rounded-lg px-3 py-2 text-sm font-semibold text-[#CBD5E1] transition hover:bg-white/5 hover:text-[#22C55E]"
              >
                {label}
              </HashLink>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {/*app means dashboard*/}
            <Link
              to={user ? "/app" : "/login"}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-bold text-white transition hover:border-[#22C55E]/50 hover:bg-[#22C55E]/10"
            >
              {/* SVG icon for user profile or login */}
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-[#86EFAC]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" /> {/* circle is head */}
                <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />{/* path is body */}
              </svg>
              <span>{user ? "Profile" : "Login"}</span>
            </Link>
                          {/* Register button is only shown if the user is not logged in */}
            {!user && (
              <Link
                to="/register"
                className="hidden rounded-xl bg-[#22C55E] px-4 py-2 text-sm font-black text-[#07110B] transition hover:bg-[#2DDB6B] sm:inline-flex"
              >
                Register
              </Link>
            )}
          </div>
        </nav>
        {/* UI note: mobile links  */}
        <nav className="flex gap-1 overflow-x-auto border-t border-white/5 px-4 py-2 lg:hidden">
          {sectionLinks.map(({ label, id }) => (
            <HashLink
              key={id}
              smooth
              to={`/#${id}`}
              className="shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-[#CBD5E1] hover:text-[#22C55E]"
            >
              {label}
            </HashLink>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}

export default PublicLayout;
