import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/app/hooks/useAuth';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');
    const error = searchParams.get('error');

    if (error) {
      console.error('OAuth Error:', error);
      navigate('/auth/sign-in?error=' + error);
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        
        // Save token to localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        // Update auth state
        login({ token, user });
        
        // Redirect based on user needs
        if (user.needsCompanySetup) {
          navigate('/auth/setup-company');
        } else if (user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Failed to parse user:', err);
        navigate('/auth/sign-in?error=parse_error');
      }
    } else {
      navigate('/auth/sign-in?error=missing_data');
    }
  }, [searchParams, navigate, login]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
        <p className="text-gray-400">Sedang memproses login Anda</p>
      </div>
    </div>
  );
}
