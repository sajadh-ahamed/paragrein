import { useState } from 'react';
import { Link } from 'react-router-dom'; // Used to navigate between pages
import { forgotPassword } from '../api/authApi.js'; // API call for forgot password
import FormInput from '../components/FormInput.jsx'; // Reusable input box
import PrimaryButton from '../components/PrimaryButton.jsx'; // Reusable button
import AuthLayout from '../layouts/AuthLayout.jsx'; // Reusable layout

const SUCCESS_MESSAGE = 'If an account exists for this email, a reset link has been sent.';

//setting initial values for the state variables
function ForgotPasswordPage() {
  const [email, setEmail] = useState(''); //when user types sajadh@gamil.com it will stre this until thats its empty
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setSuccess(''); //Clear previous messages.
    setError(''); //Clear previous messages.
    const normalizedEmail = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) { //gmail regex
      setError('Please enter a valid email address.');
      return;
    }


    //send the email to backend acnd check in db and send reset link to user email
    try {
      setLoading(true); //before connect false now true
      const response = await forgotPassword(normalizedEmail);
      setSuccess(response?.message || SUCCESS_MESSAGE);
    } catch (apiError) {
      setError(apiError.message || 'Unable to send reset email. Please check local email server.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your account email to receive a local password-reset link through Papercut SMTP.">
      {success && <div className="mb-4 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">{success}</div>}
      {error && <div className="mb-4 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}

      <form onSubmit={submit} className="grid gap-4 ">
        <FormInput label="Email" id="email" name="email" type="email" 
        value={email} onChange={(event) => setEmail(event.target.value)} placeholder="user@paragrein.local " />
        <PrimaryButton type="submit" disabled={loading} className="w-full">
          {loading ? 'Sending reset link...' : 'Send Reset Link'}
        </PrimaryButton>
      </form>

      <p className="mt-5 text-center text-sm text-[#94A3B8]">
        Remembered your password? <Link to="/login" className="font-semibold text-[#22C55E] hover:underline">Back to login</Link>
      </p>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;

//    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
//This regular expression validates the email format before sending it to the backend.
//  It checks that the email contains characters before the @, has a valid domain after the @, includes a dot (.), 
// and has a domain extension like .com or .org. The .test() method returns true if the email matches the pattern, and false otherwise. 
// The ! operator means we show an error when the email does not match the required format