import "../styles/global.css";
import { useCookies } from 'react-cookie';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEffect } from 'react';
import { url } from "../const";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useForm } from "react-hook-form";

// zodでバリデーションを行う
const schema = z.object({
  email: z.string().email('正しいメールアドレスを入力してください'),
  password: z
    .string()
    .min(8, '8文字以上で入力してください')
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{8,}$/,
      '半角英数記号で入力し、少なくとも１文字以上の大文字、小文字、数字を含む必要があります',
    ),
});

// バリデーションを行う
type LoginFormData = z.infer<typeof schema>;


// 初期値を設定
const DEFAULT_VALUES: LoginFormData = {
  email: "",
  password: "",
}



export const LogIn = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const [cookies, setCookie, removeCookie] = useCookies();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });
  // トークンがある場合はホーム画面にリダイレクト
  const checkToken = () => {
    const token = cookies.token;
    if(token){
      navigate('/');
    }
  }
  useEffect(() => {
    checkToken();
  }, []);
  // ログインボタンを押した時の処理
  const onSubmit = async(data: LoginFormData) => {
    const { email, password } = data;
    // ログイン処理を行う
    await axios
    .post(`${url}/signin`, {
      email,
      password,
    })
    .then((res) => {
      setCookie('token', res.data.token);
      setIsAuthenticated(true);
      navigate('/');
    })
    .catch((err) => {
      console.log(err);
    });
    reset();
  }

  return (
    <main className="max-w-screen-md mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-8">ログイン</h2>
      <div className="mt-8">
        <label htmlFor="email">メールアドレス</label>
        <input
          type="text"
          id="email"
          placeholder="メールアドレス"
          className={`w-full rounded border px-4 py-2 text-input outline-none placeholder:text-theme-light focus:border-primary ${errors['email'] ? 'border-error' : 'border-theme-medium'}`}
          {...register('email')}
        />
        {errors['email'] && (
          <div className="text-error mt-1 text-body3">
            <span>{errors['email'].message}</span>
          </div>
        )}
      </div>
      <div className="mb-4 mt-8">
        <label htmlFor="password">パスワード</label>
        <input
          type="password"
          id="password"
          placeholder="パスワード"
          className={`w-full rounded border px-4 py-2 text-input outline-none placeholder:text-theme-light focus:border-primary ${errors['password'] ? 'border-error' : 'border-theme-medium'}`}
          {...register('password')}
        />
        {errors['password'] && (
          <div className="text-error mt-1 text-body3">
            <span>{errors['password'].message}</span>
          </div>
        )}
      </div>
      <button className="bg-primary text-white px-4 py-2 rounded-md mt-8" onClick={handleSubmit(onSubmit)}>ログイン</button>
    </main>
  );
}