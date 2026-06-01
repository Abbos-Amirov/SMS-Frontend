import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useRegisterMutation } from '../../api/endpoints/authApi';
import type { AxiosBaseQueryError } from '../../api/axiosBaseQuery';
import { setCredentials } from '../../features/auth/AuthSlice';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/FormFields';
import { useAppDispatch } from '../../store';

const schema = z.object({
  memberFirstName: z.string().min(1, 'Ismni kiriting'),
  memberLastName: z.string().optional(),
  memberEmail: z.string().email('Email noto‘g‘ri'),
  memberPassword: z.string().min(8, 'Parol kamida 8 ta belgi'),
  memberCompanyName: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [registerMember, { isLoading }] = useRegisterMutation();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await registerMember(data).unwrap();
      dispatch(setCredentials(res));
      navigate('/', { replace: true });
    } catch (err) {
      const msg = (err as AxiosBaseQueryError)?.data?.message ?? 'Ro‘yxatdan o‘tishda xatolik';
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
        <h1 className="auth-card__title">Ro‘yxatdan o‘tish</h1>
        <p className="auth-card__sub">Yangi hisob yarating.</p>

        {errors.root && <div className="form-banner form-banner--error">{errors.root.message}</div>}

        <div className="form-row">
          <Input label="Ism" error={errors.memberFirstName?.message} {...register('memberFirstName')} />
          <Input label="Familiya" error={errors.memberLastName?.message} {...register('memberLastName')} />
        </div>
        <Input label="Email" type="email" error={errors.memberEmail?.message} {...register('memberEmail')} />
        <Input
          label="Parol"
          type="password"
          placeholder="kamida 8 ta belgi"
          error={errors.memberPassword?.message}
          {...register('memberPassword')}
        />
        <Input label="Kompaniya (ixtiyoriy)" error={errors.memberCompanyName?.message} {...register('memberCompanyName')} />

        <Button type="submit" variant="primary" block loading={isLoading}>
          Ro‘yxatdan o‘tish
        </Button>

        <div className="auth-card__foot">
          Hisobingiz bormi? <Link to="/login">Kirish</Link>
        </div>
      </form>
    </div>
  );
}
