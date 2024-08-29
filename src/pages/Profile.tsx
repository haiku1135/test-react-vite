import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { url } from "../const";



export const Profile = () => {
  const [name, setName] = useState("");
  const getUser = async () => {
    const res = await axios.get(`${url}/users`)
    setName(res.data.name)
  }
  useEffect(() => {
    getUser();
  }, []);
  const updateUser = async () => {
    const res = await axios.put(`${url}/users`, {
      name: name
    })
    if (res.status === 200) {
      alert("更新しました")
    }
  }
  return (
    <div>
      <h2>ユーザー情報編集</h2>
      <form onSubmit={updateUser}>
        <div>
          <label htmlFor="name">名前</label>
          <input type="text" id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <button type="submit">更新</button>
      </form>
    </div>
  );
};