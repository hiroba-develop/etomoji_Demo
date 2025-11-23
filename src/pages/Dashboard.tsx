import React, { useState } from "react";
import { ArrowRight, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// マンダラチャートの9マスデータを取得
const getMandalaGrid = () => {
  const centerGoal = localStorage.getItem("mandala_center_goal_v2") || "";
  const majorCells = JSON.parse(
    localStorage.getItem("mandala_major_cells_v2") || "[]"
  );
  return { centerGoal, majorCells: majorCells.slice(0, 8) };
};

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {} = useAuth();
  const [currentDate] = useState(new Date());

  // マンダラグリッドデータを取得
  const mandalaGrid = getMandalaGrid();

  // 今月の予実データ（ダミー）
  const currentMonthData = {
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    revenueTarget: 10000000,
    revenueActual: 8500000,
    profitTarget: 2000000,
    profitActual: 1800000,
  };

  const revenueRate = Math.round(
    (currentMonthData.revenueActual / currentMonthData.revenueTarget) * 100
  );
  const profitRate = Math.round(
    (currentMonthData.profitActual / currentMonthData.profitTarget) * 100
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* メインコンテンツ：マンダラとPLを並列表示 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* マンダラチャート セクション */}
          <div
            className="card cursor-pointer hover:shadow-card-hover transition-all group"
            onClick={() => navigate("/mandalaChart")}
          >
            <h2 className="text-heading font-bold text-text mb-6">Check it</h2>

            {/* 3x3 マンダラグリッド */}
            <div className="grid grid-cols-3 gap-2 max-w-md mx-auto mb-6">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
                if (index === 4) {
                  // 中央
                  return (
                    <div
                      key="center"
                      className="aspect-square bg-gradient-to-br from-pink-400 to-rose-400 rounded-lg flex items-center justify-center p-2"
                    >
                      <p className="text-white text-center text-xs font-semibold line-clamp-3">
                        {mandalaGrid.centerGoal || "目標"}
                      </p>
                    </div>
                  );
                }

                const cellIndex = index > 4 ? index - 1 : index;
                const cell = mandalaGrid.majorCells[cellIndex];
                const hasContent = cell && cell.title;
                const isCompleted = cell && cell.completed; // 達成状況を確認

                return (
                  <div
                    key={index}
                    className={`aspect-square rounded-lg flex items-center justify-center p-2 ${
                      isCompleted
                        ? "bg-gradient-to-br from-pink-400 to-rose-400" // 達成済みはピンク
                        : hasContent
                        ? "bg-gradient-to-br from-green-400 to-emerald-400" // 未達成だが内容ありは緑
                        : "bg-gradient-to-br from-green-300 to-emerald-300" // 空の項目も緑（薄め）
                    }`}
                  >
                    <p className="text-white text-center text-xs font-medium line-clamp-3">
                      {hasContent ? cell.title : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 予実管理（PL） セクション */}
          <div
            className="card bg-gradient-to-br bg-white to-indigo-50 border-2  cursor-pointer hover:shadow-card-hover transition-all group"
            onClick={() => navigate("/yearlyBudgetActual")}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="bg-primary text-white p-3 rounded-card-lg">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-body-lg font-bold text-text">
                    予実管理（年次PL）
                  </h2>
                  <p className="text-note text-gray-600">業績の見える化</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
            </div>

            {/* 今月の予実 */}
            <div className="bg-white rounded-card-lg p-4 mb-4 border border-blue-200">
              <div className="text-note text-gray-600 mb-3">
                {currentMonthData.year}年{currentMonthData.month}月の実績
              </div>

              {/* 売上 */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body font-semibold text-text">
                    売上
                  </span>
                  <span className="text-body-lg font-bold text-blue-600">
                    {revenueRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-400 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(revenueRate, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-note text-gray-600">
                  <span>
                    実績：¥{(currentMonthData.revenueActual / 10000).toFixed(0)}
                    万
                  </span>
                  <span>
                    目標：¥{(currentMonthData.revenueTarget / 10000).toFixed(0)}
                    万
                  </span>
                </div>
              </div>

              {/* 利益 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-body font-semibold text-text">
                    利益
                  </span>
                  <span className="text-body-lg font-bold text-green-600">
                    {profitRate}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-400 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${Math.min(profitRate, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-note text-gray-600">
                  <span>
                    実績：¥{(currentMonthData.profitActual / 10000).toFixed(0)}
                    万
                  </span>
                  <span>
                    目標：¥{(currentMonthData.profitTarget / 10000).toFixed(0)}
                    万
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* In the works セクション */}
        <div className="card">
          <h2 className="text-heading font-bold text-text mb-4">
            In the works...
          </h2>
          <div className="h-40 flex items-center justify-center bg-gray-50 rounded-card-lg border-2 border-dashed border-gray-300">
            <p className="text-body text-gray-400">Coming Soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
