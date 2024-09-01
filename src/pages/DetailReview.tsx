import { useState, useEffect } from 'react';
import axios from 'axios';
import { url } from '../const';
import { useCookies } from 'react-cookie';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

type Review = {
  id: string;
  title: string;
  url: string;
  detail: string;
  review: string;
  reviewer: string;
};

export const DetailReview = () => {
  const [cookies] = useCookies(['token']);
  const token = cookies.token;
  const [name, setName] = useState<string>('');
  const [review, setReview] = useState<Review>({
    id: '',
    title: '',
    url: '',
    detail: '',
    review: '',
    reviewer: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // レビューのIDを取得
  const { id } = useParams();
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await axios.get(`${url}/books/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setReview(res.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchReview();
  }, [id, token]);

  const getUserName = async () => {
    try {
      const token = cookies.token;
      const res = await axios.get(`${url}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setName(res.data.name);
    } catch (error) {
      console.error('ユーザー情報の取得に失敗しました：', error);
    }
  }
  useEffect(() => {
    getUserName();
  }, [cookies.token]);
  // 読み込み中の場合は読み込み中を表示
  if (loading) return <div className='max-w-2xl mx-auto mt-16'>読み込み中...</div>;
  // エラーがある場合はエラーを表示
  if (error) return <div className='max-w-2xl mx-auto mt-16'>{error}</div>;


  return (
    <div className='max-w-2xl mx-auto mt-16'>
      <h2 className='text-2xl font-bold mb-8'>レビュー</h2>
      <p className='text-lg'>ID: {review.id}</p>
      <p className='text-lg'>タイトル: {review.title}</p>
      <p className='text-lg'>URL: <a href={review.url} target='_blank' rel='noopener noreferrer'>リンク</a></p>
      <p className='text-lg'>詳細: {review.detail}</p>
      <p className='text-lg'>レビュー: {review.review}</p>
      <p className='text-lg'>レビュアー: {review.reviewer}</p>
      {review.reviewer === name && (
        <Link to={`/edit/${review.id}`} className=' block bg-primary text-white rounded-md mt-8 mb-8 w-fit px-4 py-2 hover:text-white hover:bg-secondary-dark'>編集</Link>
      )}
    </div>
  )
};