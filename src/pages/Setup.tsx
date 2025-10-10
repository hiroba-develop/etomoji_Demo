import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

import type {
  InitialSetup,
  CompanySize,
  Industry,
  FinancialKnowledge,
  SetupStep,
} from "../types";

const Setup: React.FC = () => {
  const {
    user,
    completeSetup,
    isLoading: authLoading,
    shouldRedirectToSetup,
  } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [setupData, setSetupData] = useState<InitialSetup>({
    userName: "",
    companyName: "",
    phoneNumber: "",
    currentAssets: 0,
    companySize: "個人事業主",
    fiscalYearStartMonth: 4,
    fiscalYearStartYear: new Date().getFullYear(),
    industry: "IT・ソフトウェア",
    financialKnowledge: "初心者",
  });

  // ログインしていない場合はリダイレクト（ただし、shouldRedirectToSetupがtrueの場合は除く）
  if (!user && !authLoading && !shouldRedirectToSetup) {
    return <Navigate to="/login" replace />;
  }

  // 既に設定完了済みの場合はダッシュボードへ（ただし、shouldRedirectToSetupがtrueの場合は除く）
  if (user?.isSetupComplete && !shouldRedirectToSetup) {
    return <Navigate to="/" replace />;
  }

  const steps: SetupStep[] = [
    {
      id: 0,
      title: "ユーザー情報",
      description: "あなたの基本情報を教えてください",
      completed: false,
    },
    {
      id: 1,
      title: "基本情報",
      description: "事業の基本情報を教えてください",
      completed: false,
    },
    {
      id: 2,
      title: "経験・知識",
      description: "あなたの事業経験を教えてください",
      completed: false,
    },
    {
      id: 3,
      title: "設定完了",
      description: "設定内容を確認して完了します",
      completed: false,
    },
  ];

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

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = async () => {
    try {
      setIsLoading(true);

      // デモ用の遅延
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // 設定完了
      completeSetup(setupData);
    } catch (error) {
      console.error("デモセットアップエラー:", error);
      alert("設定の保存中にエラーが発生しました。");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // ユーザー情報
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ユーザー名
              </label>
              <input
                type="text"
                value={setupData.userName}
                onChange={(e) =>
                  setSetupData({ ...setupData, userName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="お名前を入力してください"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                会社名
              </label>
              <input
                type="text"
                value={setupData.companyName}
                onChange={(e) =>
                  setSetupData({ ...setupData, companyName: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="会社名を入力してください"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                電話番号
              </label>
              <input
                type="tel"
                value={setupData.phoneNumber}
                onChange={(e) =>
                  setSetupData({ ...setupData, phoneNumber: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="電話番号を入力してください"
                required
              />
            </div>
          </div>
        );

      case 1: // 基本情報
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                会社規模
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {companyTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setSetupData({ ...setupData, companySize: type })
                    }
                    className={`p-3 sm:p-4 border rounded-lg text-left transition-colors ${
                      setupData.companySize === type
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="text-sm sm:text-base font-medium">
                      {type}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                業界
              </label>
              <select
                value={setupData.industry}
                onChange={(e) =>
                  setSetupData({
                    ...setupData,
                    industry: e.target.value as Industry,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              >
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                事業年度開始年月
              </label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={setupData.fiscalYearStartYear}
                  onChange={(e) =>
                    setSetupData({
                      ...setupData,
                      fiscalYearStartYear: parseInt(e.target.value),
                      // 年が変更された時、月の制限を考慮
                      fiscalYearStartMonth:
                        parseInt(e.target.value) === new Date().getFullYear() &&
                        setupData.fiscalYearStartMonth >
                          new Date().getMonth() + 1
                          ? new Date().getMonth() + 1
                          : setupData.fiscalYearStartMonth,
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  {Array.from(
                    { length: 11 },
                    (_, i) => new Date().getFullYear() - 10 + i
                  ).map((year) => (
                    <option key={year} value={year}>
                      {year}年
                    </option>
                  ))}
                </select>
                <select
                  value={setupData.fiscalYearStartMonth}
                  onChange={(e) =>
                    setSetupData({
                      ...setupData,
                      fiscalYearStartMonth: parseInt(e.target.value),
                    })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                >
                  {Array.from(
                    {
                      length:
                        setupData.fiscalYearStartYear ===
                        new Date().getFullYear()
                          ? new Date().getMonth() + 1
                          : 12,
                    },
                    (_, i) => i + 1
                  ).map((month) => (
                    <option key={month} value={month}>
                      {month}月
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2: // 経験・知識
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                財務・会計の知識レベル
              </label>
              <div className="space-y-2">
                {knowledgeOptions.map((knowledge) => (
                  <label key={knowledge} className="flex items-center">
                    <input
                      type="radio"
                      name="knowledge"
                      value={knowledge}
                      checked={setupData.financialKnowledge === knowledge}
                      onChange={(e) =>
                        setSetupData({
                          ...setupData,
                          financialKnowledge: e.target
                            .value as FinancialKnowledge,
                        })
                      }
                      className="mr-3 text-primary focus:ring-primary"
                    />
                    <span>{knowledge}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // 設定完了
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                設定完了！
              </h3>
              <p className="text-gray-600">
                ミエトルの準備が整いました。あなたの事業成長をサポートします。
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
              <h4 className="font-medium text-gray-900">設定内容の確認</h4>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600">ユーザー名:</span>{" "}
                  {setupData.userName}
                </p>
                <p>
                  <span className="text-gray-600">会社名:</span>{" "}
                  {setupData.companyName}
                </p>
                <p>
                  <span className="text-gray-600">電話番号:</span>{" "}
                  {setupData.phoneNumber}
                </p>
                <p>
                  <span className="text-gray-600">会社規模:</span>{" "}
                  {setupData.companySize}
                </p>
                <p>
                  <span className="text-gray-600">業界:</span>{" "}
                  {setupData.industry}
                </p>
                <p>
                  <span className="text-gray-600">現在の資産:</span>{" "}
                  {formatCurrency(setupData.currentAssets)}
                </p>
                <p>
                  <span className="text-gray-600">財務知識:</span>{" "}
                  {setupData.financialKnowledge}
                </p>
                <p>
                  <span className="text-gray-600">事業年度開始:</span>{" "}
                  {setupData.fiscalYearStartYear}年
                  {setupData.fiscalYearStartMonth}月
                </p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">
            {isLoading ? "設定を保存中..." : "読み込み中..."}
          </p>
          <p className="text-sm text-blue-600 mt-2">(デモモード)</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/5 py-4 sm:py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="mx-auto h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center mb-4">
            <div
              className="w-full h-full bg-contain bg-no-repeat bg-center"
              style={{
                backgroundImage: "url(/mietoru_favicon.svg)",
              }}
              role="img"
              aria-label="ミエトル"
            />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            初期設定 (デモモード)
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            あなたに最適化された経営サポートのための設定を行います
          </p>
        </div>

        {/* プログレスバー */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium ${
                  index <= currentStep
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 text-center">
            ステップ {currentStep + 1} / {steps.length}:{" "}
            {steps[currentStep].title}
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            {steps[currentStep].title}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            {steps[currentStep].description}
          </p>

          {renderStepContent()}
        </div>

        {/* ナビゲーションボタン */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="px-4 sm:px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            戻る
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-4 sm:px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 text-sm sm:text-base"
            >
              次へ
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={isLoading}
              className="px-4 sm:px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {isLoading ? "設定中..." : "設定完了"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Setup;
