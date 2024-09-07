import '../styles/global.css';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../const";
import { useCookies } from 'react-cookie';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';


export const Profile = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const [cookies] = useCookies(['token']);
  const queryClient = useQueryClient();

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
      return null;
    }
  };

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <div>
      <h2>ユーザー情報編集</h2>
      <form>
        <div>
          <label htmlFor="name">名前</label>
          <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button type="submit" className="bg-theme-light text-theme-dark px-4 py-2 rounded-md" onClick={mutation.mutate}>更新</button>
      </form>
    </div>
  );
};