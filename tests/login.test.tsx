import { screen, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';

describe('LoginForm', () => {
  test('フォームが正しくレンダリングされていること', () => {
    render(<App />);

    // メールアドレス入力フィールドの存在確認
    const emailInput = screen.getByLabelText('メールアドレス') as HTMLInputElement;
    expect(emailInput).toBeInTheDocument();
    expect(emailInput.type).toBe('text');

    // パスワード入力フィールドの存在確認
    const passwordInput = screen.getByLabelText('パスワード') as HTMLInputElement;
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput.type).toBe('password');

    // ログインボタンの存在確認
    const loginButton = screen.getByRole('button', { name: 'ログイン' });
    expect(loginButton).toBeInTheDocument();
  });

  test('ログインボタンが正しくレンダリングされていること', () => {
    render(<App />);

    const loginButton = screen.getByRole('button', { name: 'ログイン' });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toBeEnabled();
    expect(loginButton).toHaveTextContent('ログイン');
  });
});