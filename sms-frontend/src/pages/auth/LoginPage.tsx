import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useLoginMutation } from '../../api/endpoints/authApi';
import { setCredentials } from '../../features/auth/AuthSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/FormFields';
import { useAppDispatch } from '../../store';
import type { AxiosBaseQueryError } from '../../api/axiosBaseQuery';

const schema = z.object({
  memberEmail: z.string().email('Email noto‘g‘ri'),
  memberPassword: z.string().min(1, 'Parolni kiriting'),
});
type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials(res));
      navigate('/', { replace: true });
    } catch (err) {
      const msg = (err as AxiosBaseQueryError)?.data?.message ?? 'Kirishda xatolik';
      setError('root', { message: msg });
    }
  };

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <div className="auth-card__brand">
          <div className="sidebar__logo">S</div>
          <div className="sidebar__brand-name">NovaSMS</div>
        </div>
        <h1 className="auth-card__title">Tizimga kirish</h1>
        <p className="auth-card__sub">Hisobingizga kiring va boshqaruvni davom eting.</p>

        {errors.root && <div className="form-banner form-banner--error">{errors.root.message}</div>}

        <Input
          label="Email"
          type="email"
          placeholder="siz@kompaniya.uz"
          error={errors.memberEmail?.message}
          {...register('memberEmail')}
        />
        <Input
          label="Parol"
          type="password"
          placeholder="••••••••"
          error={errors.memberPassword?.message}
          {...register('memberPassword')}
        />

        <Button type="submit" variant="primary" block loading={isLoading}>
          Kirish
        </Button>

        <div className="auth-card__foot">
          Hisobingiz yo‘qmi? <Link to="/register">Ro‘yxatdan o‘tish</Link>
        </div>
      </form>
    </div>
  );
}
