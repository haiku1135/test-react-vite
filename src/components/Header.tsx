import { Link } from 'react-router-dom';
import '../styles/global.css';

export const Header = () => {
  return (
    <header className='flex justify-between flex-row items-center bg-theme-light p-4'>
      <h1>書籍レビューアプリ</h1>
      <nav>
        <ul className='flex flex-row gap-4'>
          <li><Link to="/" className='text-theme-dark'>ホーム</Link></li>
          <li><Link to="/login" className='text-theme-dark'>ログイン</Link></li>
          <li><Link to="/signup" className='text-theme-dark'>新規登録</Link></li>
          <li><Link to="/user" className='text-theme-dark'>ユーザー</Link></li>
          <li><Link to="/public/books" className='text-theme-dark'>レビュー一覧</Link></li>
          <li><Link to="/profile" className='text-theme-dark'>ユーザー情報編集</Link></li>
        </ul>
      </nav>
    </header>
  )
}