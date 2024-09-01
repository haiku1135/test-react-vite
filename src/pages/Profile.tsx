import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../const";
import { useCookies } from 'react-cookie';

export const Profile = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const getUser = async () => {
    try{
      const res = await axios.get(`${url}/users`, {
        headers: {
          'Authorization': `Bearer ${cookies.token}`
        }
      })
      setName(res.data.name)
    } catch (error) {
      console.error('ユーザー情報の取得に失敗しました：', error);
    }
  }
  useEffect(() => {
    getUser();
  }, []);

  const updateUser = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await axios.put(`${url}/users`, {
      name: name
    }, {
      headers: {
        'Authorization': `Bearer ${cookies.token}`
      }
    })
    if (res.status === 200) {
      navigate('/');
    }
  };

  return (
    <div>
      <h2>ユーザー情報編集</h2>
      <form>
        <div>
          <label htmlFor="name">名前</label>
          <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button type="submit" className="bg-theme-light text-theme-dark" onClick={updateUser}>更新</button>
      </form>
    </div>
  );
};