// =====================================================
// PASSWORD POLICY (COMMON FOR WHOLE SYSTEM)
// =====================================================
// This file contains the application's password rules.
// Register Page and Reset Password Page both use this file.
// Changing the validation here automatically affects all pages.
// =====================================================


// Message displayed to the user if the password is invalid.
// Modify this text whenever the password policy changes.
export const PASSWORD_REQUIREMENTS =
  'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.';


// =====================================================
// PASSWORD VALIDATION FUNCTION
// Returns:
// true  -> Password is valid
// false -> Password is invalid
// =====================================================
export function isStrongPassword(password) {

  return (

    // -------------------------------------------------
    // 1. MINIMUM PASSWORD LENGTH
    // -------------------------------------------------
    // Current:
    // Minimum 8 characters
    //
    // Viva modifications:
    // >=10  -> Minimum 10 characters
    // >=12  -> Minimum 12 characters
    // ===8  -> Exactly 8 characters
    // <=20  -> Maximum 20 characters
    // -------------------------------------------------
    password.length >= 8


    // -------------------------------------------------
    // 2. UPPERCASE LETTER
    // -------------------------------------------------
    // Requires at least one capital letter.
    //
    // Examples:
    // Password123@
    // HELLOabc1@
    //
    // Remove this line if uppercase is NOT required.
    // -------------------------------------------------
    && /[A-Z]/.test(password)


    // -------------------------------------------------
    // 3. LOWERCASE LETTER
    // -------------------------------------------------
    // Requires at least one lowercase letter.
    //
    // Remove this line if lowercase is NOT required.
    // -------------------------------------------------
    && /[a-z]/.test(password)


    // -------------------------------------------------
    // 4. NUMBER
    // -------------------------------------------------
    // Requires at least one digit (0-9).
    //
    // Examples:
    // abc123
    //
    // Remove this line if numbers are optional.
    //
    // To require TWO numbers:
    // /\d.*\d/.test(password)
    // -------------------------------------------------
    && /\d/.test(password)


    // -------------------------------------------------
    // 5. SPECIAL CHARACTER
    // -------------------------------------------------
    // Requires at least one special character.
    //
    // Examples:
    // @ # $ % ! & *
    //
    // Remove this line if special characters are optional.
    //
    // Only @ allowed:
    // /@/.test(password)
    //
    // Only @ or # allowed:
    // /[@#]/.test(password)
    // -------------------------------------------------
    && /[^A-Za-z0-9]/.test(password)



    // =====================================================
    // EXTRA VALIDATIONS (Enable only if required)
    // =====================================================

    // No spaces allowed
    // && !/\s/.test(password)

    // Must start with uppercase
    // && /^[A-Z]/.test(password)

    // Must end with number
    // && /\d$/.test(password)

    // Maximum 20 characters
    // && password.length <= 20

    // Only letters
    // && /^[A-Za-z]+$/.test(password)

    // Only letters and numbers
    // && /^[A-Za-z0-9]+$/.test(password)

    // Must contain underscore
    // && /_/.test(password)

    // Must contain two numbers
    // && /\d.*\d/.test(password)

    // Must contain a space
    // && /\s/.test(password)

  );
}