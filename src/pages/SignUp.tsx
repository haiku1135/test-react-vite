import "../styles/global.css";
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { url } from "../const";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Compressor from 'compressorjs';

const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB

// zodでバリデーションを行う
const schema = z.object({
  name: z.string().min(1, '名前を入力してください').max(50, '50文字以内で入力してください'),
  email: z.string().email('正しいメールアドレスを入力してください'),
  password: z
    .string()
    .min(8, '8文字以上で入力してください')
    .regex(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]{8,}$/,
      '半角英数記号で入力し、少なくとも１文字以上の大文字、小文字、数字を含む必要があります',
    ),
  icon: z
    .custom<File>()
    .refine((file) => file instanceof File, {
      message: "画像ファイルの添付は必須です",
    })
    .refine((file) => file.size < MAX_FILE_SIZE, {
      message: "添付できる画像ファイルは1MBまでです",
    }),
  iconUrl: z.string().optional(),
});

// バリデーションを行う
type SignUpFormData = z.infer<typeof schema>;


// 初期値を設定
const DEFAULT_VALUES: SignUpFormData = {
  name: "",
  email: "",
  password: "",
  icon: new File([], ""),
  iconUrl: ""
}


export const SignUp = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies();
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  // react-hook-formのuseFormを使用
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });

  
  const onSubmit = async(data: SignUpFormData) => {
    try{
      const userResponse = await axios
      .post(`${url}/users`, {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      const token = userResponse.data.token;
      setCookie("token", token);

      if (data.icon) {
        const formData = new FormData();
        formData.append('icon', data.icon);
        await axios.post(`${url}/uploads`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
        });
      }
      navigate('/');
      reset();
    } catch(err){
      if (axios.isAxiosError(err) && err.response) {
        console.log(err.response.data);
      }
    }

  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      new Compressor(file, {
        quality: 0.6,
        maxWidth: 1000,
        maxHeight: 1000,
        success(result) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64String = reader.result;
            if (typeof base64String === 'string') {
              // Base64文字列のサイズをチェック
              const base64Size = Math.ceil((base64String.length * 3) / 4);
              if (base64Size > MAX_FILE_SIZE) {
                console.error('圧縮後のファイルサイズが1MBを超えています');
                return;
              }
              // Base64文字列をFileオブジェクトに変換
              const blob = base64ToBlob(base64String.split(',')[1], 'image/jpeg');
              const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
              setValue('icon', compressedFile);
              setIconPreview(base64String);
            }
          };
          reader.readAsDataURL(result);
        },
        error(err) {
          console.error('圧縮エラー:', err.message);
        },
      });
    }
  };
   // Base64文字列をBlobに変換する関数
   const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  };


  return (
    <main className="max-w-screen-md mx-auto mt-16">
      <h2 className="text-2xl font-bold mb-8">ログイン</h2>
      <div className="mt-8">
        <label htmlFor="name">名前</label>
        <input
          type="text"
          id="name"
          placeholder="名前"
          className={`w-full rounded border px-4 py-2 text-input outline-none placeholder:text-theme-light focus:border-primary ${errors['name'] ? 'border-error' : 'border-theme-medium'}`}
          {...register('name')}
        />
        {errors['name'] && (
          <div className="text-error mt-1 text-body3">
            <span>{errors['name'].message}</span>
          </div>
        )}
      </div>
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
      <div className="mt-8">
          <label htmlFor="icon">アイコン（1MB以下）</label>
          <input
            type="file"
            id="icon"
            accept="image/*"
            onChange={handleIconChange}
            className="w-full"
          />
          {errors.icon && <p className="text-red-500">{errors.icon.message}</p>}
          {iconPreview && (
            <img src={iconPreview} alt="アイコンプレビュー" className="mt-2 w-24 h-24 object-cover" />
          )}
        </div>
      <button className="bg-primary text-white px-4 py-2 rounded-md mt-8" onClick={handleSubmit(onSubmit)}>新規登録</button>
    </main>
  );
}