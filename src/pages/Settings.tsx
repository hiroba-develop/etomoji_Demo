import React, { useState, useEffect } from "react";
import { Save, Plus, Trash2, Bell, User, Building } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import type {
  InitialSetup,
  CompanySize,
  Industry,
  FinancialKnowledge,
  TaskType,
} from "../types";

interface Task {
  id: number;
  taskId?: string;
  name: string;
  day: number;
  enabled: boolean;
  type: TaskType;
}

// デモ用の設定データ
const DEMO_SETTING_DATA = {
  name: "デモユーザー",
  company: "デモ株式会社",
  telNo: "03-1234-5678",
  companySize: 2, // 法人（従業員1-5名）
  industry: 1, // IT・ソフトウェア
  fiscalYearStartYear: 2023,
  fiscalYearStartMonth: 4,
  totalAssets: 5000000, // 500万円
  businessExperience: 2, // 1-3年
  financialKnowledge: 2, // 基本レベル
  capital: 1000000, // 資本金100万円
};

// デモ用のタスクデータ
const DEMO_TASKS: Task[] = [
  {
    id: 1,
    taskId: "task-demo-1",
    name: "売上・経費の記録",
    day: 5,
    enabled: true,
    type: "custom",
  },
  {
    id: 2,
    taskId: "task-demo-2",
    name: "銀行口座の残高確認",
    day: 15,
    enabled: true,
    type: "custom",
  },
  {
    id: 3,
    taskId: "task-demo-3",
    name: "取引先への支払い",
    day: 20,
    enabled: false,
    type: "custom",
  },
];

const Settings: React.FC = () => {
  const { user, updateUserSetup } = useAuth();
  const isNotNormalAccount = user?.role === "1" || user?.role === "2";

  const [tasks, setTasks] = useState<Task[]>(DEMO_TASKS);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskDay, setNewTaskDay] = useState(1);

  // タスク編集用の状態管理
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTaskName, setEditingTaskName] = useState("");
  const [editingTaskDay, setEditingTaskDay] = useState(1);

  // 初期設定データの状態管理
  const [setupData, setSetupData] = useState<InitialSetup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  // オプション定義
  const companyTypes: CompanySize[] = [
    "個人事業主",
    "法人（従業員1-5名）",
    "法人（従業員6-20名）",
    "法人（従業員21名以上）",
  ];

  const industries: Industry[] = [
    "IT・ソフトウェア",
    "製造業",
    "小売業",
    "飲食業",
    "サービス業",
    "建設業",
    "医療・福祉",
    "教育",
    "金融・保険",
    "不動産",
    "その他",
  ];

  const knowledgeOptions: FinancialKnowledge[] = [
    "初心者",
    "基本レベル",
    "中級レベル",
    "上級レベル",
  ];

  // 数値から選択肢へのマッピング関数
  const getCompanySizeFromNumber = (size: number): CompanySize => {
    const mapping: { [key: number]: CompanySize } = {
      1: "個人事業主",
      2: "法人（従業員1-5名）",
      3: "法人（従業員6-20名）",
      4: "法人（従業員21名以上）",
    };
    return mapping[size] || "個人事業主";
  };

  const getIndustryFromNumber = (industry: number): Industry => {
    const mapping: { [key: number]: Industry } = {
      1: "IT・ソフトウェア",
      2: "製造業",
      3: "小売業",
      4: "飲食業",
      5: "サービス業",
      6: "建設業",
      7: "医療・福祉",
      8: "教育",
      9: "金融・保険",
      10: "不動産",
      11: "その他",
    };
    return mapping[industry] || "その他";
  };

  const getFinancialKnowledgeFromNumber = (
    knowledge: number
  ): FinancialKnowledge => {
    const mapping: { [key: number]: FinancialKnowledge } = {
      1: "初心者",
      2: "基本レベル",
      3: "中級レベル",
      4: "上級レベル",
    };
    return mapping[knowledge] || "初心者";
  };

  // デモデータを初期化
  useEffect(() => {
    const loadDemoData = async () => {
      try {
        setLoading(true);

        // デモ用の遅延
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // ユーザー情報を設定
        setUserInfo({
          name: DEMO_SETTING_DATA.name,
          email: user?.email || "demo@example.com",
          phone: DEMO_SETTING_DATA.telNo,
        });

        // 設定データを変換して設定
        const convertedSetupData: InitialSetup = {
          userName: DEMO_SETTING_DATA.name,
          companyName: DEMO_SETTING_DATA.company,
          phoneNumber: DEMO_SETTING_DATA.telNo,
          companySize: getCompanySizeFromNumber(DEMO_SETTING_DATA.companySize),
          industry: getIndustryFromNumber(DEMO_SETTING_DATA.industry),
          fiscalYearStartYear: DEMO_SETTING_DATA.fiscalYearStartYear,
          fiscalYearStartMonth: DEMO_SETTING_DATA.fiscalYearStartMonth,
          currentAssets: DEMO_SETTING_DATA.totalAssets,
          financialKnowledge: getFinancialKnowledgeFromNumber(
            DEMO_SETTING_DATA.financialKnowledge
          ),
          capital: DEMO_SETTING_DATA.capital,
        };

        setSetupData(convertedSetupData);
      } catch (err) {
        console.error("デモ設定データの読み込みエラー:", err);
        setError("設定データの読み込み中にエラーが発生しました");
      } finally {
        setLoading(false);
      }
    };

    loadDemoData();
  }, [user]);

  const handleAddTask = async () => {
    if (newTaskName.trim()) {
      const newTask: Task = {
        id: Date.now(),
        taskId: `task-demo-${Date.now()}`,
        name: newTaskName,
        day: newTaskDay,
        enabled: true,
        type: "custom" as TaskType,
      };

      try {
        // デモ用の遅延
        await new Promise((resolve) => setTimeout(resolve, 500));

        setTasks([...tasks, newTask]);
        setNewTaskName("");
        setNewTaskDay(1);
      } catch (err) {
        console.error("デモタスク追加エラー:", err);
        alert("タスクの追加中にエラーが発生しました");
      }
    }
  };

  const handleDeleteTask = async (id: number) => {
    const taskToDelete = tasks.find((task) => task.id === id);
    if (!taskToDelete) {
      alert("削除対象のタスクが見つかりません");
      return;
    }

    try {
      // デモ用の遅延
      await new Promise((resolve) => setTimeout(resolve, 300));

      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      console.error("デモタスク削除エラー:", err);
      alert("タスクの削除中にエラーが発生しました");
    }
  };

  const handleTaskToggle = async (id: number) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    if (!taskToUpdate) {
      alert("更新対象のタスクが見つかりません");
      return;
    }

    try {
      // デモ用の遅延
      await new Promise((resolve) => setTimeout(resolve, 300));

      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, enabled: !task.enabled } : task
        )
      );
    } catch (err) {
      console.error("デモタスク更新エラー:", err);
      alert("タスクの更新中にエラーが発生しました");
    }
  };

  // タスク編集機能
  const startEditingTask = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingTaskName(task.name);
    setEditingTaskDay(task.day);
  };

  const saveEditingTask = async () => {
    if (editingTaskId && editingTaskName.trim()) {
      const taskToEdit = tasks.find((t) => t.id === editingTaskId);
      if (!taskToEdit) {
        alert("編集対象のタスクが見つかりません");
        return;
      }

      try {
        // デモ用の遅延
        await new Promise((resolve) => setTimeout(resolve, 300));

        setTasks(
          tasks.map((task) =>
            task.id === editingTaskId
              ? { ...task, name: editingTaskName, day: editingTaskDay }
              : task
          )
        );
        setEditingTaskId(null);
        setEditingTaskName("");
        setEditingTaskDay(1);
      } catch (err) {
        console.error("デモタスク更新エラー:", err);
        alert("タスクの更新中にエラーが発生しました");
      }
    }
  };

  const cancelEditingTask = () => {
    setEditingTaskId(null);
    setEditingTaskName("");
    setEditingTaskDay(1);
  };

  const handleSaveSettings = async () => {
    if (!setupData) {
      alert("保存に必要な情報が不足しています");
      return;
    }

    try {
      // デモ用の遅延
      await new Promise((resolve) => setTimeout(resolve, 1000));

      updateUserSetup(setupData);
      alert("設定を保存しました。(デモモード)");
    } catch (err) {
      console.error("デモ設定保存エラー:", err);
      alert("設定の保存中にエラーが発生しました。");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">設定データを読み込み中...</p>
          <p className="text-sm text-blue-600 mt-2">(デモモード)</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 btn-primary"
          >
            再読み込み
          </button>
        </div>
      </div>
    );
  }

  if (!setupData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-500">初期設定データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text">
          設定 (デモモード)
        </h1>
        <button
          onClick={handleSaveSettings}
          className="btn-primary flex items-center justify-center space-x-2 text-sm"
        >
          <Save className="h-4 w-4" />
          <span>設定を保存</span>
        </button>
      </div>

      {!isNotNormalAccount && (
        <>
          {/* 基本情報 */}
          <div className="card mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Building className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h3 className="text-base sm:text-lg font-semibold text-text">
                基本情報
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm text-text/70 mb-2">
                  会社規模
                </label>
                <select
                  value={setupData.companySize}
                  onChange={(e) =>
                    setSetupData({
                      ...setupData,
                      companySize: e.target.value as CompanySize,
                    })
                  }
                  className="input-field w-full pr-8 appearance-none bg-white"
                  style={{
                    backgroundImage:
                      'url(\'data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\')',
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "calc(100% - 4px) center",
                    backgroundSize: "16px",
                  }}
                  disabled={isNotNormalAccount}
                >
                  {companyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-text/70 mb-2">業界</label>
                <select
                  value={setupData.industry}
                  onChange={(e) =>
                    setSetupData({
                      ...setupData,
                      industry: e.target.value as Industry,
                    })
                  }
                  className="input-field w-full pr-8 appearance-none bg-white"
                  style={{
                    backgroundImage:
                      'url(\'data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\')',
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "calc(100% - 4px) center",
                    backgroundSize: "16px",
                  }}
                  disabled={isNotNormalAccount}
                >
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-text/70 mb-2">
                  財務知識レベル
                </label>
                <select
                  value={setupData.financialKnowledge}
                  onChange={(e) =>
                    setSetupData({
                      ...setupData,
                      financialKnowledge: e.target.value as FinancialKnowledge,
                    })
                  }
                  className="input-field w-full pr-8 appearance-none bg-white"
                  style={{
                    backgroundImage:
                      'url(\'data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\')',
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "calc(100% - 4px) center",
                    backgroundSize: "16px",
                  }}
                  disabled={isNotNormalAccount}
                >
                  {knowledgeOptions.map((knowledge) => (
                    <option key={knowledge} value={knowledge}>
                      {knowledge}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm text-text/70 mb-2">
                  資本金
                </label>
                <input
                  type="number"
                  value={setupData.capital || 0}
                  onChange={(e) =>
                    setSetupData({
                      ...setupData,
                      capital: Number(e.target.value),
                    })
                  }
                  className="input-field w-full"
                  placeholder="資本金を入力"
                  disabled={isNotNormalAccount}
                />
              </div>
              <div>
                <label className="block text-sm text-text/70 mb-2">
                  事業年度開始年月
                </label>
                <p className="text-text font-medium">
                  {setupData.fiscalYearStartYear || new Date().getFullYear()}年
                  {setupData.fiscalYearStartMonth}月
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <div
        className={`grid grid-cols-1 ${
          isNotNormalAccount ? "" : "xl:grid-cols-2"
        } gap-6`}
      >
        {!isNotNormalAccount && (
          <div className="card">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              <h3 className="text-base sm:text-lg font-semibold text-text">
                月次タスク通知設定
              </h3>
            </div>
            <div className="text-base sm:text-lg mb-4 ml-4">
              <p className="text-sm text-text/70">
                登録メールアドレスに通知を送信
                (デモ版では実際の通知は送信されません)
              </p>
            </div>

            <div className="space-y-4">
              {/* 既存タスク一覧 */}
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 border border-border rounded-lg"
                  >
                    {editingTaskId === task.id ? (
                      // 編集モード
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm text-text/70 mb-1">
                            タスク名
                          </label>
                          <input
                            type="text"
                            value={editingTaskName}
                            onChange={(e) => setEditingTaskName(e.target.value)}
                            className="input-field w-full"
                            placeholder="タスク名を入力"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="text-sm text-text/70">毎月</label>
                          <select
                            value={editingTaskDay}
                            onChange={(e) =>
                              setEditingTaskDay(Number(e.target.value))
                            }
                            className="input-field pr-8 appearance-none bg-white"
                            style={{
                              backgroundImage:
                                'url(\'data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\')',
                              backgroundRepeat: "no-repeat",
                              backgroundPosition: "calc(100% - 4px) center",
                              backgroundSize: "16px",
                            }}
                          >
                            {Array.from({ length: 28 }, (_, i) => (
                              <option key={i + 1} value={i + 1}>
                                {i + 1}日
                              </option>
                            ))}
                          </select>
                          <label className="text-sm text-text/70">に通知</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={saveEditingTask}
                            className="btn-primary text-sm px-3 py-1 flex items-center"
                          >
                            <Save className="h-3 w-3 mr-1" />
                            保存
                          </button>
                          <button
                            onClick={cancelEditingTask}
                            className="btn-secondary text-sm px-3 py-1"
                          >
                            キャンセル
                          </button>
                        </div>
                      </div>
                    ) : (
                      // 通常表示
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <input
                            type="checkbox"
                            checked={task.enabled}
                            onChange={() => handleTaskToggle(task.id)}
                            className="rounded border-border text-primary focus:ring-primary"
                            disabled={isNotNormalAccount}
                          />
                          <div
                            onDoubleClick={
                              isNotNormalAccount
                                ? undefined
                                : () => startEditingTask(task)
                            }
                            className="cursor-pointer hover:bg-gray-50 p-1 rounded"
                            title={
                              isNotNormalAccount ? "" : "ダブルクリックで編集"
                            }
                          >
                            <p className="font-medium text-text">{task.name}</p>
                            <p className="text-sm text-text/70">
                              毎月{task.day}日に通知
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-error hover:bg-error/10 p-1 rounded"
                          disabled={isNotNormalAccount}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 新しいタスクの追加 */}
              <div className="border-t border-border pt-4">
                <h4 className="font-medium text-text mb-3">
                  新しいタスクを追加
                </h4>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    className="input-field w-full"
                    placeholder="タスク名を入力"
                    disabled={isNotNormalAccount}
                  />
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-text/70">毎月</label>
                    <select
                      value={newTaskDay}
                      onChange={(e) => setNewTaskDay(Number(e.target.value))}
                      className="input-field pr-8 appearance-none bg-white"
                      style={{
                        backgroundImage:
                          'url(\'data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>\')',
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "calc(100% - 4px) center",
                        backgroundSize: "16px",
                      }}
                      disabled={isNotNormalAccount}
                    >
                      {Array.from({ length: 28 }, (_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}日
                        </option>
                      ))}
                    </select>
                    <label className="text-sm text-text/70">に通知</label>
                  </div>
                  <button
                    onClick={handleAddTask}
                    className="btn-secondary flex items-center space-x-2"
                    disabled={isNotNormalAccount}
                  >
                    <Plus className="h-4 w-4" />
                    <span>タスクを追加</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* ユーザー情報設定 */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <h3 className="text-base sm:text-lg font-semibold text-text">
              ユーザー情報
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text/70 mb-2">会社名</label>
              <input
                type="text"
                value={setupData.companyName || ""}
                onChange={(e) =>
                  setSetupData({
                    ...setupData,
                    companyName: e.target.value,
                  })
                }
                className="input-field w-full"
                placeholder="会社名を入力してください"
                disabled={isNotNormalAccount}
              />
            </div>

            <div>
              <label className="block text-sm text-text/70 mb-1">お名前</label>
              <input
                type="text"
                value={userInfo.name}
                onChange={(e) => {
                  setUserInfo({ ...userInfo, name: e.target.value });
                  if (setupData) {
                    setSetupData({ ...setupData, userName: e.target.value });
                  }
                }}
                className="input-field w-full"
              />
            </div>
            <div>
              <label className="block text-sm text-text/70 mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                value={userInfo.email}
                onChange={(e) =>
                  setUserInfo({ ...userInfo, email: e.target.value })
                }
                className="input-field w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
