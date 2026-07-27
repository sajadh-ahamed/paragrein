import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/authApi.js';
import FormInput from '../components/FormInput.jsx';
import PrimaryButton from '../components/PrimaryButton.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import { isStrongPassword, PASSWORD_REQUIREMENTS } from '../utils/passwordPolicy.js';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  //address: '', add new field 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (!formData.fullName.trim() || !formData.username.trim() || !formData.email.trim() || !formData.password) {
      setError('Full name, username, email, and password are required.');
      return;
    }

//add new field validation
// if (!formData.address.trim()) {
//   setError('Address is required.');
//   return;
    // }


    if (!/^0\d{9}$/.test(formData.phoneNumber.trim())) {
      setError('Phone number must be 10 digits long and start with 0.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }

    if (!isStrongPassword(formData.password)) {
      setError(PASSWORD_REQUIREMENTS);
      return;
    }

    try {
      setLoading(true);
      await register(formData);
      navigate('/login', {
        replace: true,
        state: { message: 'Customer account created. Please login.' },
      });
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create Customer Account" subtitle="Public registration always creates a CUSTOMER account. Employee accounts are managed by admins.">
      {error && (
        <div className="mb-4 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
        <FormInput className="sm:col-span-2" label="Full Name" id="fullName" name="fullName" type="text" value={formData.fullName} onChange={updateField} />
        <FormInput label="Username" id="username" name="username" type="text" value={formData.username} onChange={updateField} />
        <FormInput label="Email" id="email" name="email" type="email" value={formData.email} onChange={updateField} placeholder="example@gmail.com" />
        <FormInput className="sm:col-span-2" label="Phone Number" id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={updateField} />
       {/*<FormInput className="sm:col-span-2" label="Address" id="address" name="address" type="text" value={formData.address} onChange={updateField} />*/}
        <FormInput label="Password" id="password" name="password" type="password" value={formData.password} onChange={updateField} />
        <FormInput label="Confirm Password" id="confirmPassword" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={updateField} />
        <p className="text-xs leading-5 text-[#64748B] sm:col-span-2">{PASSWORD_REQUIREMENTS}</p>

        <PrimaryButton type="submit" disabled={loading} className="sm:col-span-2">
          {loading ? 'Creating account...' : 'Register'}
        </PrimaryButton>
      </form>

      <p className="mt-5 text-center text-sm text-[#94A3B8]">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-[#22C55E] hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default RegisterPage;
