import { Link } from 'react-router-dom';
import '../styles/global.css';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { url } from '../const';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { useCookies } from 'react-cookie';

export const Header = () => {
  const { isAuthenticated, deleteToken } = useAuth();
  const [name, setName] = useState<string>('');
  const [cookies] = useCookies(['token']);

  const query = useQuery({
    queryKey: queryKeys.user,
    queryFn: () => axios.get(`${url}/users`, {
      headers: {
        'Authorization': `Bearer ${cookies.token}`
      }
    })
  });

  useEffect(() => {
    if(query.data){
      setName(query.data.data.name);
    }
  }, [query.data]);

  return (
    <header className='flex justify-between flex-row items-center bg-theme-light p-4'>
      <h1 className='text-2xl font-bold '><Link to="/" className='text-theme-dark'>書籍レビューアプリ</Link></h1>
      <nav>
        <ul className='flex flex-row gap-4'>
          {isAuthenticated ? (
            <>
              <li><Link to="/user" className='text-theme-dark'>ユーザー</Link></li>
              <li><Link to="/profile" className='text-theme-dark'>ユーザー情報編集</Link></li>
              <li><Link to="/public/books" className='text-theme-dark'>レビュー一覧</Link></li>
              <li><Link to="/new" className='text-theme-dark'>レビュー投稿</Link></li>
              <li onClick={deleteToken} className='text-theme-dark'>ログアウト</li>
              <li>ユーザー名: {name}</li>
            </>
          ) : (
            <>
              <li><Link to="/login" className='text-theme-dark'>ログイン</Link></li>
              <li><Link to="/signup" className='text-theme-dark'>新規登録</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  )
}