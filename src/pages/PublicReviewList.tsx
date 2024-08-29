import { usePublicReview } from '../context/PublicReviewsContext';
import { Pagination } from '../components/Pagination';

export const PublicReviewList = () => {
  const { reviews, offset, setOffset, loading, error } = usePublicReview();

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-16">
      <h2 className='text-2xl font-bold mb-8 text-center'>レビュー一覧</h2>
      <ul className='flex flex-col gap-4 max-w-2xl mx-auto'>
        {reviews.map((review: { id: string; title: string; url: string; detail: string; review: string; reviewer:string}) => (
          <li key={review.id} className='flex flex-col border-2 border-gray-300 p-4 rounded-sm'>
            <h3 className='text-lg font-bold'>タイトル: {review.title}</h3>
            <p className='w-full break-words whitespace-pre-wrap'>URL: <a href={review.url} target='_blank' rel='noopener noreferrer'>リンク</a></p>
            <p className='w-full'>詳細: {review.detail}</p>
            <p className='w-full'>レビュー: {review.review}</p>
            <p className='w-full'>レビュアー: {review.reviewer}</p>
          </li>
        ))}
      </ul>
      <Pagination offset={offset} setOffset={setOffset} />
    </div>
  );
};