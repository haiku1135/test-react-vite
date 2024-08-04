import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <>
      <header>
        <h1>書籍レビューアプリ</h1>
      </header>
      <main>
        <h2>ログイン</h2>
        <form>
          <label htmlFor="email">メールアドレス</label>
          <input type="text" id="email" placeholder="メールアドレス" value={email} onChange={handleEmailChange} />
          <label htmlFor="password">パスワード</label>
          <input type="password" id="password" placeholder="パスワード" value={password} onChange={handlePasswordChange} />
          <button type="submit">ログイン</button>
        </form>
      </main>
    </>
  )
}

export default App
