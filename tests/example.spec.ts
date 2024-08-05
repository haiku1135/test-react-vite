import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:5173/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle('書籍レビューアプリ');
});

test.describe('ログイン機能', () => {
  test('正常なログイン', async ({ page }) => {
    // ページに移動
    await page.goto('http://localhost:5173/');

    // フォームに入力
    await page.fill('#email', 'test@example.com');
    await page.fill('#password', 'password123');

    // ログインボタンをクリック
    await page.click('button[type="submit"]');

    // ログイン成功後の状態を確認
    // 注: 実際のアプリケーションに合わせて適切な確認方法を選択してください
    await expect(page.locator('text=ログイン成功')).toBeVisible();
  });

  test('メールアドレス未入力', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.fill('#password', 'password123');
    await page.click('button[type="submit"]');

    // エラーメッセージの確認
    await expect(page.locator('text=メールアドレスを入力してください')).toBeVisible();
  });

  test('パスワード未入力', async ({ page }) => {
    await page.goto('http://localhost:5173/');

    await page.fill('#email', 'test@example.com');
    await page.click('button[type="submit"]');

    // エラーメッセージの確認
    await expect(page.locator('text=パスワードを入力してください')).toBeVisible();
  });
});
