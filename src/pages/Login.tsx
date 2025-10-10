import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

// デモユーザーデータ
const DEMO_USERS = [
  {
    email: "normalUser1@example.com",
    password: "normalUser1Pass",
    userId: "normal-user-001",
    settingFlg: "1", // 設定完了済み
    role: "0", // 一般ユーザー
  },
  {
    email: "normalUser2@example.com",
    password: "normalUser2Pass",
    userId: "normal-user-002",
    settingFlg: "0", // 未設定
    role: "0", // 一般ユーザー
  },
  {
    email: "taxUser@example.com",
    password: "taxUserPass",
    userId: "tax-user-001",
    settingFlg: "1", // 設定完了済み
    role: "1", // 管理者ユーザー
  },
  {
    email: "adminUser@example.com",
    password: "adminUserPass",
    userId: "admin-user-001",
    settingFlg: "1", // 設定完了済み
    role: "2", // プラットフォームオーナー
  },
];

const Login: React.FC = () => {
  const { user, isLoading, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // すでにログイン済みの場合はリダイレクト
  if (user && !isLoading) {
    return <Navigate to={user.isSetupComplete ? "/" : "/setup"} replace />;
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // デモ用の遅延
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // デモユーザーをチェック
      const demoUser = DEMO_USERS.find(
        (user) => user.email === email && user.password === password
      );

      if (demoUser) {
        await login(
          email,
          password,
          demoUser.userId,
          demoUser.settingFlg,
          demoUser.role
        );
      } else {
        // 指定されたデモユーザー以外はログイン不可
        throw new Error("メールアドレスまたはパスワードが正しくありません");
      }
    } catch (err) {
      console.error("デモ認証エラー:", err);
      setError(err instanceof Error ? err.message : "ログインに失敗しました");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/5 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* ロゴとタイトル */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center mb-6">
            <div
              className="w-full h-full bg-contain bg-no-repeat bg-center"
              style={{
                backgroundImage: "url(/mietoru_favicon.svg)",
              }}
              role="img"
              aria-label="ミエトル"
            />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">ミエトル</h2>
          <p className="mt-2 text-sm text-gray-600">
            経営が見える、成長が実感できる (デモモード)
          </p>
        </div>

        {/* デモログイン情報 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            デモログイン情報
          </h3>
          <div className="text-xs text-blue-700 space-y-1">
            <div>
              <strong>一般ユーザー（設定済み）:</strong> normalUser1@example.com
              / normalUser1Pass
            </div>
            <div>
              <strong>一般ユーザー（未設定）:</strong> normalUser2@example.com /
              normalUser2Pass
            </div>
            <div>
              <strong>管理者ユーザー:</strong> taxUser@example.com / taxUserPass
            </div>
            <div>
              <strong>プラットフォームオーナー:</strong> adminUser@example.com /
              adminUserPass
            </div>
          </div>
        </div>

        {/* ログインフォーム */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="space-y-6">
            {/* エラーメッセージ */}
            {error && (
              <div className="text-center text-sm text-red-500">{error}</div>
            )}

            {/* メールログインフォーム */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  メールアドレス
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="example@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  パスワード
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                  placeholder="パスワードを入力"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  {isLoading ? "ログイン中..." : "ログイン"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
