function PrimaryButton({ children, className = '', type = 'button', ...props }) {
  return (
    <button
      type={type}
      className={`rounded-md bg-[#22C55E] px-4 py-2.5 text-sm font-semibold text-[#07110B] transition hover:bg-[#16A34A] disabled:cursor-not-allowed disabled:bg-[#166534] disabled:text-[#94A3B8] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default PrimaryButton;


/*function PrimaryButton({ children, className = '', type = 'button', ...props })
Props meaning:
children	button text (or icon)
className	extra styles from page
type	button / submit / reset
...props	extra HTML props (onClick, disabled, etc.)*/

/*
=====================================================
PRIMARYBUTTON.JSX - EXPECTED MODIFICATIONS (VIVA)
=====================================================

1.  CHANGE BUTTON COLOR (GLOBAL)
-----------------------------------------------------
className="bg-[#22C55E]"

 Modify when:
- Theme change (green → blue/red)
- Branding update

Example:
bg-blue-500
bg-red-500

=====================================================

2.  CHANGE SIZE (PADDING / HEIGHT)
-----------------------------------------------------
px-4 py-2.5

 Modify when:
- Small button needed
- Large CTA button needed

Examples:
px-2 py-1   (small)
px-6 py-3   (large)

=====================================================

3.  FONT STYLE CHANGE
-----------------------------------------------------
text-sm font-semibold

  Modify when:
- UI redesign
- Accessibility improvement

Examples:
text-base
font-bold

=====================================================

4. ⚡ ADD LOADING STATE (VERY COMMON VIVA QUESTION)
-----------------------------------------------------
👉 Modify PrimaryButton to:

{loading ? "Loading..." : children}

OR

show spinner

👉 Used when API request is running

=====================================================

5. 🚫 DISABLED STATE IMPROVEMENT
-----------------------------------------------------
disabled:bg-[#166534]

👉 Modify when:
- Better UX feedback needed
- Prevent multiple clicks

Example:
disabled:opacity-50
disabled:cursor-not-allowed

=====================================================

6. ➕ ADD ICON SUPPORT (IMPORTANT)
-----------------------------------------------------
👉 Modify props:

function PrimaryButton({ children, icon })

Then:

{icon && <span>{icon}</span>}

👉 Used for:
- Save icon
- Add icon
- Delete icon

=====================================================

7. 📦 MAKE BUTTON FULL WIDTH OPTION
-----------------------------------------------------
👉 Add:

className="w-full"

OR prop:

fullWidth={true}

=====================================================

8. 🔄 ADD CLICK LOADING PREVENTION
-----------------------------------------------------
👉 Modify:

disabled={loading || disabled}

=====================================================

9. ♿ ACCESSIBILITY IMPROVEMENTS
-----------------------------------------------------
👉 Add:
- aria-label
- role="button"

Used for screen readers

=====================================================

🚫 WHEN NOT TO MODIFY THIS FILE
-----------------------------------------------------
❌ Only one page button change
❌ Layout changes
❌ Backend logic changes

=====================================================

🎯 VIVA ONE-LINE ANSWER
-----------------------------------------------------
"We modify PrimaryButton when we need global changes like color, size, loading state, or new reusable features like icons or disabled behavior across all buttons in the system."

=====================================================
 */