import { useState } from 'react';

function FormInput({ label, error, className = '', type = 'text', ...props }) { //this is actually 1 object why props to add balance properties   
  const [showPassword, setShowPassword] = useState(false); //useState() returns 2 values.

  ///Because only password fields should have show/hide functionality.
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  //full form template
  return (
    <label className={`block ${className}`}>
      <span className="pg-label">{label}</span>
      <div className="relative mt-2">
        <input
          type={inputType}
          className={`pg-field w-full ${isPassword ? 'pr-10' : ''}`/*in case if input box is password add extra padding right side*/}
          {...props}

        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#F8FAFC] transition focus:outline-none"
          >
            {showPassword ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        )}
      </div>
      {error && <span className="mt-1 block text-xs font-medium text-[#EF4444]">{error}</span>}
    </label>
  );
}

export default FormInput;


//main idea

/* IMPORTANT 
...props

means:

we “take everything and pass it inside input”

So:

<FormInput type="text" name="senderName" />

becomes:

<input type="text" name="senderName" /> */

/*
=====================================================
=====================================================

1. INPUT FIELD DESIGN (GLOBAL CHANGE)
-----------------------------------------------------
Change here if you want to modify ALL input fields:

<input className="pg-field mt-2" {...props} />

 Examples:
- Change border color → update pg-field in CSS
- Change background → update pg-field
- Change font size → update pg-field
- Change padding/height → update pg-field
- Make rounded input → update pg-field

=====================================================

2. LABEL STYLE CHANGE (GLOBAL)
-----------------------------------------------------
<span className="pg-label">{label}</span>

 Examples:
- Font size of labels
- Label color
- Bold / spacing

 Modify CSS class: pg-label

=====================================================

3. ERROR MESSAGE STYLE
-----------------------------------------------------
{error && (
  <span className="mt-1 block text-xs font-medium text-[#EF4444]">
    {error}
  </span>
)}

 Change when:
- Error color change
- Font size change
- Add icon to error
- Improve validation UI

=====================================================

4. ADD NEW FEATURES TO INPUT
-----------------------------------------------------
Modify this file when adding:

✔ Icon inside input
✔ Password show/hide toggle
✔ Disabled state styling
✔ Loading state inside input
✔ Character counter

=====================================================

5. DISABLED INPUT STYLE (OPTIONAL ADD)
-----------------------------------------------------
You can extend like:

<input
  disabled={props.disabled}
  className="pg-field mt-2 disabled:opacity-50"
/>

 Modify when:
- Need greyed-out input
- Prevent editing

=====================================================

6. VALIDATION ENHANCEMENT
-----------------------------------------------------
Modify here if:

- Show error animation
- Change error position
- Add red border on error

Example:
<input className={`pg-field mt-2 ${error ? 'border-red-500' : ''}`} />

=====================================================

7. WHEN YOU SHOULD NOT MODIFY THIS FILE
-----------------------------------------------------
❌ Page layout changes → CreateOrderPage.jsx
❌ API changes → api files
❌ Backend logic → Spring Boot
❌ Button styles → PrimaryButton.jsx
❌ Only one screen change → that page only

=====================================================

VIVA ONE-LINE ANSWER:
-----------------------------------------------------
"This file is modified when we need to change common input design,
validation UI, or reusable input behavior across the whole system."

=====================================================
*/


/*
=====================================================
FORMINPUT.JSX - TAILWIND MODIFICATION NOTES
=====================================================

1. BORDER COLOR CHANGE (ALL INPUTS)
-----------------------------------------------------
Change in className:

<input className="pg-field mt-2 border border-gray-300" />

 Examples:
- Green border:
  border-green-500

- Red border:
  border-red-500

- Blue border:
  border-blue-500

=====================================================

2. BACKGROUND COLOR CHANGE
-----------------------------------------------------
<input className="pg-field mt-2 bg-white" />

 Examples:
- Light gray:
  bg-gray-100

- Dark input:
  bg-gray-900

- Green tint:
  bg-green-50

=====================================================

3. FONT SIZE CHANGE
-----------------------------------------------------
<input className="pg-field mt-2 text-sm" />

 Examples:
- Small text:
  text-sm

- Medium:
  text-base

- Large:
  text-lg

=====================================================

4. PADDING / HEIGHT CHANGE
-----------------------------------------------------
<input className="pg-field mt-2 px-4 py-2" />

 Examples:
- Small input:
  px-2 py-1

- Normal:
  px-4 py-2

- Large input:
  px-6 py-3

=====================================================

5. ROUNDED CORNERS (IMPORTANT ⭐)
-----------------------------------------------------
<input className="pg-field mt-2 rounded-md" />

 Examples:
- Slight round:
  rounded-md

- More round:
  rounded-lg

- Full circle style:
  rounded-full

=====================================================

6. FOCUS BORDER EFFECT (PROFESSIONAL UI)
-----------------------------------------------------
<input className="pg-field mt-2 focus:border-green-500 focus:ring-2 focus:ring-green-200" />

 Examples:
- Green glow when typing
- Modern UI feel

=====================================================

7. ERROR STATE STYLE
-----------------------------------------------------
<input className="pg-field mt-2 border-red-500 focus:border-red-500" />

 Examples:
- Red border when validation fails
- Visual feedback for errors

=====================================================

VIVA ONE-LINE ANSWER:
-----------------------------------------------------
"We use Tailwind classes like border-green-500, bg-gray-100,
rounded-md to control input appearance in a reusable way."

=====================================================
*/