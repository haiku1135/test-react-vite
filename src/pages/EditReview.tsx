import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { url } from '../const';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
const schema = z.object({
  title: z.string().min(1, 'タイトルを入力してください').max(50, '50文字以内で入力してください'),
  url: z.string().url('正しいURLを入力してください'),
  detail: z.string().min(1, '詳細を入力してください').max(500, '500文字以内で入力してください'),
  review: z.string().min(1, 'レビューを入力してください').max(500, '500文字以内で入力してください'),
})

type EditReviewFormData = z.infer<typeof schema>;

export const EditReview = () => {
  const navigate = useNavigate();
  const [book, setBook] = useState<EditReviewFormData>({
    title: '',
    url: '',
    detail: '',
    review: '',
  });
  const { id } = useParams();
  const [cookies] = useCookies(['token']);
  const token = cookies.token;
  const getBook = async () => {
    try {
      const res = await axios.get(`${url}/books/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setBook(res.data);
    } catch (error) {
      console.error('レビューの取得に失敗しました:', error);
    }
  };
  useEffect(() => {
    getBook();
  }, []);
  const { handleSubmit, register, reset, formState: { errors } } = useForm<EditReviewFormData>({
    resolver: zodResolver(schema),
    values: book, // デフォルト値としてbookオブジェクトを使用
    mode: 'onChange',
  });
  const onSubmit = async (data: EditReviewFormData) => {
    try {
      const res = await axios.put(`${url}/books/${id}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      navigate(`/detail/${id}`);
    } catch (error) {
      console.error('レビューの編集に失敗しました:', error);
    }
  };
  const handleDelete = async () => {
    try {
      const res = await axios.delete(`${url}/books/${id}`, {
        data: {
          id: id
        },
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      navigate('/public/books');
    } catch (error) {
      console.error('レビューの削除に失敗しました:', error);
    }
  }
  return (
    <main className='max-w-screen-md mx-auto mt-16'>
      <h2 className='text-2xl font-bold mb-8'>レビュー編集</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mt-8'>
          <label htmlFor="title">タイトル</label>
          <input
            type="text"
            id="title"
            className={`w-full rounded border px-4 py-2 text-input outline-none focus:border-primary ${errors['title'] ? 'border-error' : 'border-theme-medium'}`}
            {...register('title')}
          />
        </div>
        <div className='mt-8'>
          <label htmlFor="url">URL</label>
          <input
            type="text"
            id="url"
            className={`w-full rounded border px-4 py-2 text-input outline-none focus:border-primary ${errors['url'] ? 'border-error' : 'border-theme-medium'}`}
            {...register('url')}
          />
        </div>
        <div className='mt-8'>
          <label htmlFor="detail">詳細</label>
          <input
            type="text"
            id="detail"
            className={`w-full rounded border px-4 py-2 text-input outline-none focus:border-primary ${errors['detail'] ? 'border-error' : 'border-theme-medium'}`}
            {...register('detail')}
          />
        </div>
        <div className='mt-8'>
          <label htmlFor="review">レビュー</label>
          <input
            type="text"
            id="review"
            className={`w-full rounded border px-4 py-2 text-input outline-none focus:border-primary ${errors['review'] ? 'border-error' : 'border-theme-medium'}`}
            {...register('review')}
          />
        </div>
        <button type="submit" className='bg-primary text-white px-4 py-2 rounded-md mt-8'>更新</button>
      </form>
      <button onClick={handleDelete} className='bg-error text-white px-4 py-2 rounded-md mt-8'>削除</button>
    </main>
  )
};