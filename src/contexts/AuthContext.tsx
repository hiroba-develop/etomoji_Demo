import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthUser, InitialSetup } from "../types";

// 管理者・プラットフォームオーナーが担当するユーザーのデモデータ
const DEMO_MANAGED_USERS: AuthUser[] = [
  {
    id: "user-A",
    email: "user-a@example.com",
    name: "クライアントA",
    isSetupComplete: true,
    createdAt: new Date(),
    lastLogin: new Date(),
    role: "0",
  },
  {
    id: "user-B",
    email: "user-b@example.com",
    name: "クライアントB",
    isSetupComplete: true,
    createdAt: new Date(),
    lastLogin: new Date(),
    role: "0",
  },
  {
    id: "user-C",
    email: "user-c@example.com",
    name: "クライアントC (未設定)",
    isSetupComplete: false,
    createdAt: new Date(),
    lastLogin: new Date(),
    role: "0",
  },
];

interface AuthContextType {
  user: AuthUser | null;
  userSetup: InitialSetup | null;
  isLoading: boolean;
  shouldRedirectToLogin: boolean;
  shouldRedirectToSetup: boolean;
  login: (
    email: string,
    password: string,
    userId?: string,
    settingFlg?: string,
    role?: string
  ) => Promise<void>;
  completeSetup: (setupData: InitialSetup) => void;
  updateUserSetup: (setupData: Partial<InitialSetup>) => void;
  loadUserSetup: () => Promise<void>;
  logout: () => void;
  // ユーザー切り替え機能
  managedUsers: AuthUser[];
  selectedUser: AuthUser | null;
  switchUser: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// cookieを操作するためのユーティリティ関数
const setCookie = (name: string, value: string, hours: number = 3) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
};

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

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Strict`;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userSetup, setUserSetup] = useState<InitialSetup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRedirectToLogin, setShouldRedirectToLogin] = useState(false);
  const [shouldRedirectToSetup, setShouldRedirectToSetup] = useState(false);
  const [managedUsers, setManagedUsers] = useState<AuthUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // 保存された認証状態を復元
    const userId = getCookie("userId");
    const settingFlg = getCookie("settingFlg");
    const role = getCookie("role");
    const selectedUserId = getCookie("selectedUserId");

    // cookieに必要な情報がない場合は、必ずlogin画面に遷移
    if (!userId || !settingFlg) {
      setShouldRedirectToLogin(true);
      setIsLoading(false);
      return;
    }

    try {
      // ユーザー情報を設定
      const isSetupComplete = settingFlg === "1";
      const userToSet: AuthUser = {
        id: userId,
        email: "demo@example.com", // デフォルト値
        name: "デモ管理者", // デフォルト値
        isSetupComplete: isSetupComplete,
        createdAt: new Date(),
        lastLogin: new Date(),
        role: role || undefined,
      };

      setUser(userToSet);

      // 管理者/プラットフォームオーナーの場合、管理対象ユーザーを設定
      if (role === "1" || role === "2") {
        setManagedUsers(DEMO_MANAGED_USERS);

        // 以前選択したユーザーがいれば復元、いなければリストの先頭
        const initialUser =
          DEMO_MANAGED_USERS.find((u) => u.id === selectedUserId) ||
          DEMO_MANAGED_USERS[0];
        setSelectedUser(initialUser);
        if (!selectedUserId) {
          setCookie("selectedUserId", initialUser.id);
        }
      } else {
        // 通常ユーザーは自分自身を選択中にする
        setSelectedUser(userToSet);
      }

      // cookieの「settingFlg」が"0"の場合は必ずセットアップ画面に遷移
      if (settingFlg === "0") {
        setShouldRedirectToSetup(true);
      }
    } catch (err) {
      console.error("保存された認証情報の復元に失敗:", err);
      // エラー時はcookieをクリア
      deleteCookie("userId");
      deleteCookie("settingFlg");
      deleteCookie("role");
      setShouldRedirectToLogin(true);
    }

    setIsLoading(false);
  }, []);

  const login = async (
    email: string,
    _password: string,
    userId?: string,
    settingFlg?: string,
    role?: string
  ): Promise<void> => {
    setIsLoading(true);
    try {
      // userIdが必須パラメータとして提供されている必要がある
      if (!userId) {
        throw new Error("ユーザーIDが提供されていません");
      }

      // settingFlgに基づいてisSetupCompleteを決定
      const isSetupComplete = settingFlg === "1";

      const demoUser: AuthUser = {
        id: userId,
        email: email,
        name: role === "1" || role === "2" ? "デモ管理者" : "デモユーザー",
        isSetupComplete: isSetupComplete,
        createdAt: new Date(),
        lastLogin: new Date(),
        role: role || undefined,
      };

      setUser(demoUser);
      setShouldRedirectToLogin(false);
      setShouldRedirectToSetup(false);

      // 必要な情報をcookieに保存
      if (userId) {
        setCookie("userId", userId);
        setCookie("settingFlg", settingFlg || "0");
        if (role) {
          setCookie("role", role);
        }

        // 管理者の場合は管理ユーザー情報をセットアップ
        if (role === "1" || role === "2") {
          setManagedUsers(DEMO_MANAGED_USERS);
          const initialUser = DEMO_MANAGED_USERS[0];
          setSelectedUser(initialUser);
          setCookie("selectedUserId", initialUser.id);
        } else {
          // 通常ユーザーは自分自身を選択中に
          setSelectedUser(demoUser);
        }
      }
    } catch (error) {
      throw new Error("ログインに失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const completeSetup = (setupData: InitialSetup) => {
    // ログイン中のユーザー(user)と表示対象のユーザー(selectedUser)の両方を更新
    if (user && selectedUser) {
      const updatedUser = { ...user, isSetupComplete: true };
      const updatedSelectedUser = { ...selectedUser, isSetupComplete: true };

      setUser(updatedUser);
      setSelectedUser(updatedSelectedUser);
      setUserSetup(setupData);
      setShouldRedirectToSetup(false);

      // cookieのsettingFlgも更新
      setCookie("settingFlg", "1");
    }
  };

  const updateUserSetup = (setupData: Partial<InitialSetup>) => {
    if (userSetup) {
      const updatedSetup = { ...userSetup, ...setupData };
      setUserSetup(updatedSetup);
    }
  };

  const loadUserSetup = async () => {
    if (!user) return;

    try {
      // デモ用の遅延
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 本来は selectedUser.id に基づいて設定をロードしますが、
      // デモのため、固定のデータを返します。
      const DEMO_USER_SETTINGS = {
        name: selectedUser?.name || "デモユーザー",
        company: "デモ株式会社",
        telNo: "03-1234-5678",
        companySize: 2, // 法人（従業員1-5名）
        industry: 1, // IT・ソフトウェア
        fiscalYearStartYear: 2023,
        fiscalYearStartMonth: 4,
        totalAssets: 5000000, // 500万円
        businessExperience: 2, // 1-3年
        financialKnowledge: 2, // 基本レベル
      };

      // デモ設定データをInitialSetup形式に変換
      const setupData: InitialSetup = {
        userName: DEMO_USER_SETTINGS.name,
        companyName: DEMO_USER_SETTINGS.company,
        phoneNumber: DEMO_USER_SETTINGS.telNo,
        currentAssets: DEMO_USER_SETTINGS.totalAssets,
        companySize: getCompanySizeString(DEMO_USER_SETTINGS.companySize),
        fiscalYearStartMonth: DEMO_USER_SETTINGS.fiscalYearStartMonth,
        fiscalYearStartYear: DEMO_USER_SETTINGS.fiscalYearStartYear,
        industry: getIndustryString(DEMO_USER_SETTINGS.industry),
        financialKnowledge: getFinancialKnowledgeString(
          DEMO_USER_SETTINGS.financialKnowledge
        ),
      };
      setUserSetup(setupData);
    } catch (error) {
      console.error("デモユーザー設定の読み込みに失敗:", error);
    }
  };

  // APIの数値を文字列に変換するヘルパー関数
  const getCompanySizeString = (
    size?: number
  ):
    | "個人事業主"
    | "法人（従業員1-5名）"
    | "法人（従業員6-20名）"
    | "法人（従業員21名以上）" => {
    switch (size) {
      case 1:
        return "個人事業主";
      case 2:
        return "法人（従業員1-5名）";
      case 3:
        return "法人（従業員6-20名）";
      case 4:
        return "法人（従業員21名以上）";
      default:
        return "個人事業主";
    }
  };

  const getIndustryString = (
    industry?: number
  ):
    | "IT・ソフトウェア"
    | "製造業"
    | "小売業"
    | "飲食業"
    | "サービス業"
    | "建設業"
    | "医療・福祉"
    | "教育"
    | "金融・保険"
    | "不動産"
    | "その他" => {
    switch (industry) {
      case 1:
        return "IT・ソフトウェア";
      case 2:
        return "製造業";
      case 3:
        return "小売業";
      case 4:
        return "飲食業";
      case 5:
        return "サービス業";
      case 6:
        return "建設業";
      case 7:
        return "医療・福祉";
      case 8:
        return "教育";
      case 9:
        return "金融・保険";
      case 10:
        return "不動産";
      case 11:
        return "その他";
      default:
        return "IT・ソフトウェア";
    }
  };

  const getFinancialKnowledgeString = (
    knowledge?: number
  ): "初心者" | "基本レベル" | "中級レベル" | "上級レベル" => {
    switch (knowledge) {
      case 1:
        return "初心者";
      case 2:
        return "基本レベル";
      case 3:
        return "中級レベル";
      case 4:
        return "上級レベル";
      default:
        return "初心者";
    }
  };

  const logout = () => {
    setUser(null);
    setUserSetup(null);
    setManagedUsers([]);
    setSelectedUser(null);
    setShouldRedirectToLogin(false);
    setShouldRedirectToSetup(false);
    // 認証関連データを削除
    deleteCookie("userId");
    deleteCookie("settingFlg");
    deleteCookie("role");
    deleteCookie("selectedUserId");
  };

  const switchUser = (userId: string) => {
    const userToSwitch = managedUsers.find((u) => u.id === userId);
    if (userToSwitch) {
      setSelectedUser(userToSwitch);
      setCookie("selectedUserId", userId);

      // ユーザーを切り替えたので、セットアップ状態を再評価
      if (userToSwitch.isSetupComplete) {
        setShouldRedirectToSetup(false);
      } else {
        // 管理者としてログインしている場合、クライアントのセットアップ画面には遷移しない
        if (user?.role === "1" || user?.role === "2") {
          // ここでは何もしないか、あるいは管理者用の通知を出すなど
          console.log(
            `管理ユーザー: ${userToSwitch.name} はセットアップが未完了です。`
          );
          setShouldRedirectToSetup(false); // 管理者はセットアップにリダイレクトされない
        } else {
          setShouldRedirectToSetup(true);
        }
      }
    }
  };

  const value: AuthContextType = {
    user,
    userSetup,
    isLoading,
    shouldRedirectToLogin,
    shouldRedirectToSetup,
    login,
    completeSetup,
    updateUserSetup,
    loadUserSetup,
    logout,
    managedUsers,
    selectedUser,
    switchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
