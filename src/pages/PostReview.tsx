import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { url } from '../const';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';


const schema = z.object({
  title: z.string().min(1, 'タイトルを入力してください').max(50, '50文字以内で入力してください'),
  url: z.string().url('正しいURLを入力してください'),
  detail: z.string().min(1, '詳細を入力してください').max(500, '500文字以内で入力してください'),
  review: z.string().min(1, 'レビューを入力してください').max(500, '500文字以内で入力してください'),
})

type PostReviewFormData = z.infer<typeof schema>;

const DEFAULT_VALUES: PostReviewFormData = {
  title: '',
  url: '',
  detail: '',
  review: '',
};

export const PostReview = () => {
  const navigate = useNavigate();
  const { handleSubmit, register, reset, formState: { errors } } = useForm<PostReviewFormData>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
    mode: 'onChange',
  });
  const [cookies] = useCookies(['token']);
  const token = cookies.token;
  const onSubmit = async (data: PostReviewFormData) => {
    try {
      const res = await axios.post(`${url}/books`, data, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(res.data);
      reset();
      navigate('/public/books');
    } catch (error) {
      console.error('レビューの投稿に失敗しました:', error);
    }
  }
  return (
    <main className='max-w-screen-md mx-auto mt-16'>
      <h2 className='text-2xl font-bold mb-8'>レビュー投稿</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='mt-8'>
          <label htmlFor="title">タイトル</label>
          <input
            type="text"
            id="title"
            placeholder="タイトル"
            className={`w-full rounded border px-4 py-2 text-input outline-none placeholder:text-theme-light focus:border-primary ${errors['title'] ? 'border-error' : 'border-theme-medium'}`}
            {...register('title')}
          />
        </div>
        <div className='mt-8'>
          <label htmlFor="url">URL</label>
          <input
            type="text"
            id="url"
            placeholder="URL"
            className={`w-full rounded border px-4 py-2 text-input outline-none placeholder:text-theme-light focus:border-primary ${errors['url'] ? 'border-error' : 'border-theme-medium'}`}
            {...register('url')}
          />
        </div>
        <div className='mt-8'>
          <label htmlFor="detail">詳細</label>
          <input
            type="text"
            id="detail"
            placeholder="詳細"
            className={`w-full rounded border px-4 py-2 text-input outline-none placeholder:text-theme-light focus:border-primary ${errors['detail'] ? 'border-error' : 'border-theme-medium'}`}
            {...register('detail')}
          />
        </div>
        <div className='mt-8'>
          <label htmlFor="review">レビュー</label>
          <input
            type="text"
            id="review"
            placeholder="レビュー"
            className={`w-full rounded border px-4 py-2 text-input outline-none placeholder:text-theme-light focus:border-primary ${errors['review'] ? 'border-error' : 'border-theme-medium'}`}
            {...register('review')}
          />
        </div>
        <button type="submit" className='bg-primary text-white px-4 py-2 rounded-md mt-8'>投稿</button>
      </form>
    </main>
  )
}