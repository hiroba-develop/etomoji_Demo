import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Map,
  BarChart3,
  MessageCircle,
  Settings,
  Menu,
  X,
  LogOut,
  Trophy,
  Users,
  Briefcase,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import headerIcon from "../../public/header_icon.png";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const location = useLocation();
  const { logout, user, managedUsers, selectedUser, switchUser } = useAuth();

  const getCookie = (name: string): string | null => {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };

  useEffect(() => {
    // cookieからroleを取得してroleを設定
    try {
      const role = getCookie("role");
      setUserRole(role);
    } catch (err) {
      console.error("cookieの解析に失敗:", err);
    }
  }, [user]); // userオブジェクトの変更も検知

  const clientNavigation = [
    {
      name: "ダッシュボード",
      href: "/",
      icon: Home,
      disabled: false,
      roleRequired: ["0", "1", "2"],
    },
    {
      name: "予実管理(月次)",
      href: "/monthlyBudgetActual",
      icon: BarChart3,
      disabled: false,
      roleRequired: ["0", "1", "2"],
    },
    {
      name: "予実管理(年次)",
      href: "/yearlyBudgetActual",
      icon: Map,
      disabled: false,
      roleRequired: ["0", "1", "2"],
    },
    {
      name: "ランキング・表彰",
      href: "/ranking",
      icon: Trophy,
      disabled: true,
      roleRequired: ["0", "1", "2"],
    },
    {
      name: "相談・サポート",
      href: "/support",
      icon: MessageCircle,
      disabled: true,
      roleRequired: ["0", "1", "2"],
    },
  ];

  const adminNavigation = [
    {
      name: "クライアント管理",
      href: "/clientManagement",
      icon: Briefcase,
      disabled: false,
      roleRequired: ["1", "2"], // role="1"の場合のみ表示
    },
    {
      name: "ユーザー管理",
      href: "/userManagement",
      icon: Users,
      disabled: false,
      roleRequired: ["2"], // role="2"の場合のみ表示
    },
  ];

  const roleFilter = (item: { roleRequired?: string | string[] }) => {
    // roleRequiredが指定されていない場合は表示
    if (!item.roleRequired) return true;
    // roleRequiredが配列の場合は、ユーザーのロールが含まれているか確認
    if (Array.isArray(item.roleRequired)) {
      return userRole !== null && item.roleRequired.includes(userRole);
    }
    // roleRequiredが指定されている場合は、ユーザーのロールと一致する場合のみ表示
    return userRole === item.roleRequired;
  };

  // ユーザーのロールに基づいてフィルタリングされたナビゲーション項目
  const filteredClientNavigation = clientNavigation.filter(roleFilter);
  const filteredAdminNavigation = adminNavigation.filter(roleFilter);

  const userSwitcher = (
    <>
      {(userRole === "1" || userRole === "2") && managedUsers.length > 0 && (
        <div className="p-3 xl:p-4">
          <div className="relative">
            <select
              value={selectedUser?.id || ""}
              onChange={(e) => {
                switchUser(e.target.value);
                // モバイルの場合、選択後にサイドバーを閉じる
                if (sidebarOpen) {
                  setSidebarOpen(false);
                }
              }}
              className="w-full text-xs sm:text-sm border border-border rounded px-2 py-1.5 pr-8 appearance-none bg-white focus:outline-none focus:ring-1 focus:ring-primary"
              style={{
                backgroundImage:
                  'url(\'data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\')',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "calc(100% - 4px) center",
                backgroundSize: "16px",
              }}
            >
              {managedUsers.map((managedUser) => (
                <option key={managedUser.id} value={managedUser.id}>
                  表示中: {managedUser.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* ヘッダー */}
      <header className="bg-white border-b border-border px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-1.5 sm:p-2 rounded-md text-text hover:bg-sub2"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <div className="flex items-center ml-2 lg:ml-0">
              <img
                src={headerIcon}
                alt="ミエトル"
                className="h-8 sm:h-10 lg:h-12"
              />
              <span className="ml-2 text-sm text-blue-600 font-medium">
                (デモ版)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4">
            {/* 設定ボタン */}
            <Link
              to="/settings"
              className="p-1.5 sm:p-2 rounded-md text-text hover:bg-sub2 transition-colors"
              title="設定"
            >
              <Settings className="h-5 w-5 sm:h-6 sm:w-6" />
            </Link>

            {/* ログアウトボタン */}
            <button
              onClick={() => {
                if (window.confirm("ログアウトしますか？")) {
                  logout();
                }
              }}
              className="p-1.5 sm:p-2 rounded-md text-text hover:bg-sub2 transition-colors"
              title="ログアウト"
            >
              <LogOut className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* サイドバー（PC） */}
        <aside className="hidden lg:flex lg:flex-shrink-0">
          <div className="w-56 xl:w-64 bg-white border-r border-border flex flex-col">
            {userSwitcher}
            <nav className="p-3 xl:p-4 space-y-2 flex-1">
              {filteredClientNavigation.map((item) => {
                const isActive = location.pathname === item.href;

                if (item.disabled) {
                  return (
                    <div
                      key={item.name}
                      className="flex items-start px-3 xl:px-4 py-2.5 xl:py-3 rounded-lg cursor-not-allowed opacity-50"
                    >
                      <item.icon className="h-4 w-4 xl:h-5 xl:w-5 mr-2 xl:mr-3 text-gray-400 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-sm xl:text-base text-gray-400">
                          {item.name}
                        </span>
                        <span className="text-xs text-red-500 font-small">
                          COMING SOON
                        </span>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 xl:px-4 py-2.5 xl:py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-text hover:bg-sub2"
                    }`}
                  >
                    <item.icon className="h-4 w-4 xl:h-5 xl:w-5 mr-2 xl:mr-3" />
                    <span className="text-sm xl:text-base">{item.name}</span>
                  </Link>
                );
              })}

              {filteredAdminNavigation.length > 0 && (
                <hr className="border-border" />
              )}

              {filteredAdminNavigation.map((item) => {
                const isActive = location.pathname === item.href;

                if (item.disabled) {
                  return (
                    <div
                      key={item.name}
                      className="flex items-start px-3 xl:px-4 py-2.5 xl:py-3 rounded-lg cursor-not-allowed opacity-50"
                    >
                      <item.icon className="h-4 w-4 xl:h-5 xl:w-5 mr-2 xl:mr-3 text-gray-400 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-sm xl:text-base text-gray-400">
                          {item.name}
                        </span>
                        <span className="text-xs text-red-500 font-small">
                          COMING SOON
                        </span>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center px-3 xl:px-4 py-2.5 xl:py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "text-text hover:bg-sub2"
                    }`}
                  >
                    <item.icon className="h-4 w-4 xl:h-5 xl:w-5 mr-2 xl:mr-3" />
                    <span className="text-sm xl:text-base">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* モバイルサイドバー */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-64 sm:w-72 bg-white shadow-xl flex flex-col">
              <div className="flex items-center justify-between p-3 sm:p-4 border-b border-border">
                <div className="flex items-center">
                  <img
                    src="/header_icon.png"
                    alt="ミエトル"
                    className="h-6 sm:h-8"
                  />
                  <span className="ml-2 text-sm text-blue-600 font-medium">
                    (デモ版)
                  </span>
                </div>
                <button
                  type="button"
                  className="p-1.5 sm:p-2 rounded-md text-text hover:bg-sub2"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5 sm:h-6 sm:w-6" />
                </button>
              </div>
              {userSwitcher}
              <nav className="p-3 sm:p-4 space-y-2 flex-1 overflow-y-auto">
                {/* ユーザー情報（モバイル時のみ表示） */}
                {/* <div className="md:hidden flex items-center space-x-2 px-3 py-2 bg-sub2 rounded-lg mb-4">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-6 w-6 rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5 text-text" />
                  )}
                  <span className="text-sm font-medium text-text">
                    {user?.name}
                  </span>
                </div> */}

                {filteredClientNavigation.map((item) => {
                  const isActive = location.pathname === item.href;

                  if (item.disabled) {
                    return (
                      <div
                        key={item.name}
                        className="flex items-start px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg cursor-not-allowed opacity-50"
                      >
                        <item.icon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="text-sm sm:text-base text-gray-400">
                            {item.name}
                          </span>
                          <span className="text-xs text-red-500 font-small">
                            COMING SOON
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-text hover:bg-sub2"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      <span className="text-sm sm:text-base">{item.name}</span>
                    </Link>
                  );
                })}

                {filteredAdminNavigation.length > 0 && (
                  <hr className="border-border" />
                )}

                {filteredAdminNavigation.map((item) => {
                  const isActive = location.pathname === item.href;

                  if (item.disabled) {
                    return (
                      <div
                        key={item.name}
                        className="flex items-start px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg cursor-not-allowed opacity-50"
                      >
                        <item.icon className="h-5 w-5 mr-3 text-gray-400 mt-0.5" />
                        <div className="flex flex-col">
                          <span className="text-sm sm:text-base text-gray-400">
                            {item.name}
                          </span>
                          <span className="text-xs text-red-500 font-small">
                            COMING SOON
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary text-white"
                          : "text-text hover:bg-sub2"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      <span className="text-sm sm:text-base">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* メインコンテンツ */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-x-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
