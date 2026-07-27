import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../api/authApi.js';
import FormInput from '../components/FormInput.jsx';
import PrimaryButton from '../components/PrimaryButton.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import { isStrongPassword, PASSWORD_REQUIREMENTS } from '../utils/passwordPolicy.js';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() || '';
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState(token ? '' : 'Reset link is invalid or expired.');

  async function submit(event) {
    event.preventDefault();
    setSuccess('');
    setError('');
    if (!token) {
      setError('Reset link is invalid or expired.');
      return;
    }
    if (!isStrongPassword(newPassword)) {
      setError(PASSWORD_REQUIREMENTS);
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Password and confirm password do not match.');
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword(token, newPassword, confirmPassword);
      setSuccess(response?.message || 'Password reset successfully. Please login with your new password.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (apiError) {
      setError(apiError.message || 'Reset link is invalid or expired.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Reset Password" subtitle="Choose a strong new password for your Paragrein account.">
      {success && <div className="mb-4 rounded-md border border-[#22C55E]/30 bg-[#22C55E]/10 px-4 py-3 text-sm text-[#86EFAC]">{success}</div>}
      {error && <div className="mb-4 rounded-md border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3 text-sm text-[#FCA5A5]">{error}</div>}

      {!success && (
        <form onSubmit={submit} className="grid gap-4">
          <FormInput label="New Password" id="newPassword" name="newPassword" type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
          <FormInput label="Confirm Password" id="confirmPassword" name="confirmPassword" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
          <p className="text-xs leading-5 text-[#64748B]">{PASSWORD_REQUIREMENTS}</p>
          <PrimaryButton type="submit" disabled={loading || !token} className="w-full">
            {loading ? 'Resetting password...' : 'Reset Password'}
          </PrimaryButton>
        </form>
      )}

      <p className="mt-5 text-center text-sm text-[#94A3B8]">
        <Link to="/login" className="font-semibold text-[#22C55E] hover:underline">Back to login</Link>
      </p>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
