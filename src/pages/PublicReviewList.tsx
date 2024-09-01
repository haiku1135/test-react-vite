import { usePublicReview } from '../context/PublicReviewsContext';
import { Pagination } from '../components/Pagination';
import { Link } from 'react-router-dom';
import { url } from '../const';
import axios from 'axios';
import { useCookies } from 'react-cookie';

export const PublicReviewList = () => {
  const { reviews, offset, setOffset, loading, error } = usePublicReview();

  const selectBookIdSubmit = async(e: React.MouseEvent<HTMLAnchorElement>) => {
    const selectBookId = e.currentTarget.getAttribute('data-book-id');
    const [cookies] = useCookies(['token']);
    const token = cookies.token;
    try {
      const res = await axios.post(`${url}/logs`, {
        selectBookId: selectBookId,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      console.log(res.data);
    } catch (err) {
      console.error('ログの投稿に失敗しました:', err);
    }
  }


  if (loading) return <div className='max-w-2xl mx-auto mt-16'>読み込み中...</div>;
  if (error) return <div className='max-w-2xl mx-auto mt-16'>{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-16">
      <h2 className='text-2xl font-bold mb-8 text-center'>レビュー一覧</h2>
      <Link to="/new" className='block bg-primary text-white px-4 py-2 rounded-md mt-8 mb-8 w-fit'>レビュー投稿</Link>
      <ul className='flex flex-col gap-4 max-w-2xl mx-auto'>
        {reviews.map((review: { id: string; title: string; url: string; detail: string; review: string; reviewer:string}) => (
          <li key={review.id} className='flex flex-col border-2 border-gray-300 p-4 rounded-sm'>
            <Link to={`/detail/${review.id}`} className='text-primary' onClick={selectBookIdSubmit}>
              <h3 className='text-lg font-bold text-black'>タイトル: {review.title}</h3>
              <p className='w-full break-words truncate'>URL: {review.url}</p>
              <p className='w-full text-black truncate'>詳細: {review.detail}</p>
              <p className='w-full text-black truncate'>レビュー: {review.review}</p>
              <p className='w-full text-black'>レビュアー: {review.reviewer}</p>
            </Link>
          </li>
        ))}
      </ul>
      <Pagination offset={offset} setOffset={setOffset} />
    </div>
  );
};