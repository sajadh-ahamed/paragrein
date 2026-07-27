//this is the file for Login page 


import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { login } from '../api/authApi.js'; // exporting function login(credentials) export function thats why used {}
import FormInput from '../components/FormInput.jsx';
import PrimaryButton from '../components/PrimaryButton.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import { getRouteForRole, saveAuthData } from '../utils/authStorage.js';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // useState() always returns 2 things:
  //1. The current value.
  //2. A function to update that value.

  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });

  const [error, setError] = useState(''); //to store the error message (initially no error (''))
  const [loading, setLoading] = useState(false); //to store the loading state (initially not loading (false))

  //this function is used to update the form data (user enters username/email and password)
  function updateField(event) {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  //When the user submits the login form, validate the inputs,
  //send them to the backend, receive the response, and then decide what to do next.
  async function handleSubmit(event) {
    event.preventDefault(); //stop page refresh
    setError(''); //already error is empty so it will not do anything

    //if datas are empty then show error message
    if (!formData.usernameOrEmail.trim() || !formData.password) {
      setError('Username/email and password are required.');
      return;
    }

    // The reason we use try...catch...finally is because the API call can fail.
    try {
      setLoading(true); // already loading is false we mentioned in above so in here after we click login
      const response = await login(formData); // Auth api.jsx
      saveAuthData(response.token, {
        userId: response.userId,
        fullName: response.fullName,
        username: response.username,
        email: response.email,
        role: response.role,
      });
      navigate(getRouteForRole(response.role), { replace: true });
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Login to Paragrein" subtitle="Use your staff or customer account to continue.">
      {location.state?.message && (
        <div className="mb-4 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">
          {location.state.message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4">
        <FormInput
          label="Username or Email"
          id="usernameOrEmail"
          name="usernameOrEmail"
          type="text"
          placeholder="Type username or gmail"
          value={formData.usernameOrEmail}
          onChange={updateField}
        />

        <FormInput
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="Enter password"
          value={formData.password}
          onChange={updateField}
        />

        <div className="flex items-center justify-end text-sm">
          <Link to="/forgot-password" className="font-semibold text-[#22C55E] hover:underline">
            Forgot Password?
          </Link>
        </div>

        <PrimaryButton type="submit" disabled={loading} className="w-full">
          {loading ? 'Logging in...' : 'Login'}
        </PrimaryButton>
      </form>

      <p className="mt-5 text-center text-sm text-[#94A3B8]">
        New customer?{' '}
        <Link to="/register" className="font-semibold text-[#22C55E] hover:underline">
          Register here
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
