import { useState } from 'react'
import './App.css'

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const onSignIn = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email === "" && password === "") {
      setErrorMessage("メールアドレスとパスワードを入力してください");
    } else if (email === "") {
      setErrorMessage("メールアドレスを入力してください");
    } else if (password === "") {
      setErrorMessage("パスワードを入力してください");
    } else {
      setErrorMessage("");
      setSuccessMessage("ログイン成功");
    }
  };

  return (
    <>
      <header>
        <h1>書籍レビューアプリ</h1>
      </header>
      <main>
        <h2>ログイン</h2>
        {successMessage && <p>{successMessage}</p>}
        {errorMessage && <p>{errorMessage}</p>}
        <form onSubmit={onSignIn}>
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
