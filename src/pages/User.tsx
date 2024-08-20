import "../styles/global.css";
import { url } from "../const";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';

export const User = () => {
  const [name, setName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  

  const getUser = async () => {
    try {
      const token = cookies.token;
      if (!token) {
        navigate('/login');
        return;
      }

      const res = await axios.get(`${url}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setName(res.data.name);
      setIconUrl(res.data.iconUrl);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.error('認証エラー：', error);
        navigate('/login');
      } else {
        console.error('ユーザー情報の取得に失敗しました：', error);
      }
    }
  }

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div>
      <h2>ユーザー</h2>
      <p>{name}</p>
      <img src={iconUrl} alt="icon" />
    </div>
  );
}