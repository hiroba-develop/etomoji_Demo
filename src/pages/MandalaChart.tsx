import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Target,
  CheckCircle,
  Save,
  TrendingUp,
  Star,
  MessageCircle,
  Lightbulb,
  Award,
} from "lucide-react";

interface MandalaCell {
  id: string;
  title: string;
  achievement: number; // 0-100
  comment: string;
  feeling?: string; // なぜこの目標を立てたのか（感情）
}

interface MandalaSubChart {
  centerId: string;
  centerTitle: string;
  cells: MandalaCell[];
}

const MandalaChart: React.FC = () => {
  // メインの9マス（中央 + 周囲8マス）
  const [centerGoal, setCenterGoal] = useState("");
  const [centerFeeling, setCenterFeeling] = useState(""); // 中央の目標に込めた想い
  const [mainCells, setMainCells] = useState<MandalaCell[]>([
    {
      id: "m1",
      title: "",
      achievement: 0,
      comment: "",
      feeling: "",
    },
    {
      id: "m2",
      title: "",
      achievement: 0,
      comment: "",
      feeling: "",
    },
    {
      id: "m3",
      title: "",
      achievement: 0,
      comment: "",
      feeling: "",
    },
    {
      id: "m4",
      title: "",
      achievement: 0,
      comment: "",
      feeling: "",
    },
    {
      id: "m5",
      title: "",
      achievement: 0,
      comment: "",
      feeling: "",
    },
    {
      id: "m6",
      title: "",
      achievement: 0,
      comment: "",
      feeling: "",
    },
    {
      id: "m7",
      title: "",
      achievement: 0,
      comment: "",
      feeling: "",
    },
    {
      id: "m8",
      title: "",
      achievement: 0,
      comment: "",
      feeling: "",
    },
  ]);

  // サブチャート（各マスをクリックした時の詳細9マス）
  const [subCharts, setSubCharts] = useState<{
    [key: string]: MandalaSubChart;
  }>({});

  // 選択中のセル
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  // 初期化：各メインセルのサブチャートを作成
  useEffect(() => {
    const initialSubCharts: { [key: string]: MandalaSubChart } = {};
    mainCells.forEach((cell) => {
      initialSubCharts[cell.id] = {
        centerId: cell.id,
        centerTitle: cell.title,
        cells: Array.from({ length: 8 }, (_, i) => ({
          id: `${cell.id}_sub${i + 1}`,
          title: "",
          achievement: 0,
          comment: "",
        })),
      };
    });
    setSubCharts(initialSubCharts);
  }, []);

  const handleMainCellClick = (cellId: string) => {
    setSelectedCell(cellId);
  };

  const handleBackToMain = () => {
    setSelectedCell(null);
  };

  const updateMainCell = (
    cellId: string,
    field: keyof MandalaCell,
    value: string | number
  ) => {
    setMainCells((prev) =>
      prev.map((cell) =>
        cell.id === cellId ? { ...cell, [field]: value } : cell
      )
    );
  };

  const updateSubCell = (
    mainCellId: string,
    subCellId: string,
    field: keyof MandalaCell,
    value: string | number
  ) => {
    setSubCharts((prev) => ({
      ...prev,
      [mainCellId]: {
        ...prev[mainCellId],
        cells: prev[mainCellId].cells.map((cell) =>
          cell.id === subCellId ? { ...cell, [field]: value } : cell
        ),
      },
    }));
  };

  // 各マスの固定色（落ち着いたトーン）
  const getFixedCellColor = (cellId: string) => {
    const colors: { [key: string]: string } = {
      m1: "from-[#ceebe7] to-[#ceebe7]",
      m2: "from-[#ceebe7] to-[#ceebe7]",
      m3: "from-[#ceebe7] to-[#ceebe7]",
      m4: "from-[#ceebe7] to-[#ceebe7]",
      m5: "from-[#ceebe7] to-[#ceebe7]",
      m6: "from-[#ceebe7] to-[#ceebe7]",
      m7: "from-[#ceebe7] to-[#ceebe7]",
      m8: "from-[#ceebe7] to-[#ceebe7]",
    };
    return colors[cellId] || "from-gray-100 to-gray-200";
  };

  // メーターの色（進捗度によって変化）
  const getMeterColor = (achievement: number) => {
    if (achievement >= 80) return "bg-green-500";
    if (achievement >= 60) return "bg-[#67BACA]";
    if (achievement >= 40) return "bg-yellow-500";
    if (achievement >= 20) return "bg-orange-500";
    return "bg-gray-400";
  };

  const getAchievementColor = (achievement: number) => {
    // サブチャート用（既存の関数を維持）
    if (achievement >= 80) return "from-green-400 to-green-500";
    if (achievement >= 60) return "from-[#67BACA] to-[#5AA8B8]";
    if (achievement >= 40) return "from-yellow-400 to-yellow-500";
    if (achievement >= 20) return "from-orange-400 to-orange-500";
    return "from-gray-300 to-gray-400";
  };

  const getAchievementIcon = (achievement: number) => {
    if (achievement >= 80)
      return <Star className="h-5 w-5 text-yellow-300 fill-yellow-300" />;
    if (achievement >= 60)
      return <CheckCircle className="h-5 w-5 text-blue-300" />;
    if (achievement >= 40)
      return <TrendingUp className="h-5 w-5 text-orange-300" />;
    return <Target className="h-5 w-5 text-gray-400" />;
  };

  const calculateOverallProgress = () => {
    const total = mainCells.reduce((sum, cell) => sum + cell.achievement, 0);
    return Math.round(total / mainCells.length);
  };

  const calculateSubProgress = (mainCellId: string) => {
    if (!subCharts[mainCellId]) return 0;
    const cells = subCharts[mainCellId].cells;
    const total = cells.reduce((sum, cell) => sum + cell.achievement, 0);
    return Math.round(total / cells.length);
  };

  // サブチャートの達成度をメインセルに反映
  useEffect(() => {
    mainCells.forEach((cell) => {
      const subProgress = calculateSubProgress(cell.id);
      if (subProgress !== cell.achievement) {
        updateMainCell(cell.id, "achievement", subProgress);
      }
    });
  }, [subCharts]);

  // メイン画面（3x3グリッド）
  const renderMainChart = () => {
    const positions = [
      { row: 0, col: 0, idx: 0 }, // 左上
      { row: 0, col: 1, idx: 1 }, // 上中
      { row: 0, col: 2, idx: 2 }, // 右上
      { row: 1, col: 0, idx: 3 }, // 左中
      { row: 1, col: 1, idx: -1 }, // 中央（特別）
      { row: 1, col: 2, idx: 4 }, // 右中
      { row: 2, col: 0, idx: 5 }, // 左下
      { row: 2, col: 1, idx: 6 }, // 下中
      { row: 2, col: 2, idx: 7 }, // 右下
    ];

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold text-text">
            マンダラチャート
          </h1>
          <div className="flex items-center space-x-4">
            <div className="inline-block bg-gradient-to-r from-[#67BACA] to-[#5AA8B8] rounded-full px-6 py-2 shadow-lg ml-auto">
              <div className="flex items-center space-x-3 text-white">
                <TrendingUp className="h-5 w-5" />
                <span className="font-semibold">全体達成度</span>
                <span className="text-2xl font-bold">
                  {calculateOverallProgress()}%
                </span>
                {calculateOverallProgress() >= 80 && (
                  <Award className="h-6 w-6 text-yellow-300 animate-bounce" />
                )}
              </div>
            </div>
            {/* 保存ボタン */}
            <div className="max-w-5xl ml-auto">
              <div className="mt-4 text-right">
                <button
                  onClick={() => {
                    alert(
                      "保存しました！この調子で頑張りましょう！（デモモード）"
                    );
                  }}
                  className="btn-primary flex items-center space-x-2 text-sm px-4 py-2 ml-auto"
                >
                  <Save className="h-4 w-4" />
                  <span>変更を保存</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3x3グリッド */}
        <div className="max-w-10xl mx-auto">
          <div className="grid grid-cols-3 gap-4 p-4">
            {positions.map(({ idx }) => {
              // 中央のセル
              if (idx === -1) {
                return (
                  <div
                    key="center"
                    className="h-64 bg-gradient-to-br from-[#4cb5a9] to-[#4cb5a9] rounded-2xl shadow-2xl p-4 flex flex-col items-center justify-center transition-all duration-300 border-4 border-white"
                  >
                    <div className="mb-2 text-white text-xs text-center font-medium">
                      ✨ すべての起点となる想い ✨
                    </div>
                    {/* 中央目標 */}
                    <textarea
                      value={centerGoal}
                      onChange={(e) => setCenterGoal(e.target.value)}
                      className="w-full h-16 bg-white/95 rounded-lg p-2 text-center font-bold text-base text-gray-800 resize-none focus:ring-4 focus:ring-yellow-400 focus:outline-none shadow-inner mb-2"
                      placeholder="必ず成し遂げたい目標"
                    />

                    {/* なぜこの目標を掲げたのか */}
                    <div className="w-full bg-white/95 rounded-lg p-2 shadow-inner flex-1">
                      <div className="flex items-center space-x-1 mb-1">
                        <MessageCircle className="h-3 w-3 text-red-400" />
                        <label className="text-xs font-medium text-gray-600">
                          なぜこの目標を？
                        </label>
                      </div>
                      <textarea
                        value={centerFeeling}
                        onChange={(e) => setCenterFeeling(e.target.value)}
                        className="w-full h-full text-xs text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent resize-none"
                        placeholder="この目標に込めた想い・感情"
                        rows={3}
                        style={{ height: "10vh" }}
                      />
                    </div>
                  </div>
                );
              }

              const cell = mainCells[idx];
              return (
                <div
                  key={cell.id}
                  className={`h-64 bg-gradient-to-br ${getFixedCellColor(
                    cell.id
                  )} rounded-2xl shadow-lg p-3 transform hover:scale-105 hover:shadow-2xl transition-all duration-300 group border-2 border-white flex flex-col`}
                >
                  {/* 進捗メーター */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-600">
                        進捗度
                      </span>
                      <span className="text-sm font-bold text-gray-700">
                        {cell.achievement}%
                      </span>
                    </div>
                    <div className="w-full bg-white/80 rounded-full h-2 shadow-inner mb-1">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${getMeterColor(
                          cell.achievement
                        )}`}
                        style={{ width: `${cell.achievement}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={cell.achievement}
                      onChange={(e) =>
                        updateMainCell(
                          cell.id,
                          "achievement",
                          parseInt(e.target.value)
                        )
                      }
                      className="w-full h-1 appearance-none bg-transparent cursor-pointer"
                      style={{
                        WebkitAppearance: "none",
                      }}
                    />
                  </div>

                  <div className="flex-1 flex flex-col space-y-2">
                    <input
                      type="text"
                      value={cell.title}
                      onChange={(e) =>
                        updateMainCell(cell.id, "title", e.target.value)
                      }
                      className="w-full bg-white rounded-lg px-2 py-1.5 text-center font-semibold text-gray-800 placeholder-gray-400 text-sm focus:ring-2 focus:ring-[#67BACA] focus:outline-none transition-all shadow-sm"
                      placeholder="目標達成するための要素"
                    />

                    {/* なぜこれを目指すのか */}
                    <div className="bg-white rounded-lg px-2 py-1.5 shadow-sm flex-1">
                      <div className="flex items-center space-x-1 mb-1">
                        <MessageCircle className="h-3 w-3 text-[#67BACA]" />
                        <label className="text-xs font-bold text-gray-700">
                          なぜ？
                        </label>
                      </div>
                      <textarea
                        value={cell.feeling || ""}
                        onChange={(e) =>
                          updateMainCell(cell.id, "feeling", e.target.value)
                        }
                        className="w-full text-xs text-gray-700 placeholder-gray-400 focus:outline-none bg-transparent resize-none"
                        placeholder="目指す理由・想い・感情"
                        rows={2}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => handleMainCellClick(cell.id)}
                    className="mt-2 text-center text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-white/95 backdrop-blur-sm rounded px-2 py-1 text-gray-700 hover:bg-white shadow-sm"
                  >
                    💡 詳細設定へ
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // サブチャート画面（選択したセルの詳細9マス）
  const renderSubChart = (cellId: string) => {
    const mainCell = mainCells.find((c) => c.id === cellId);
    const subChart = subCharts[cellId];

    if (!mainCell || !subChart) return null;

    const positions = [
      { row: 0, col: 0, idx: 0 },
      { row: 0, col: 1, idx: 1 },
      { row: 0, col: 2, idx: 2 },
      { row: 1, col: 0, idx: 3 },
      { row: 1, col: 1, idx: -1 }, // 中央
      { row: 1, col: 2, idx: 4 },
      { row: 2, col: 0, idx: 5 },
      { row: 2, col: 1, idx: 6 },
      { row: 2, col: 2, idx: 7 },
    ];

    return (
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBackToMain}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-[#67BACA] to-[#5AA8B8] text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>メインチャートに戻る</span>
            </button>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-[#67BACA] to-[#5AA8B8] rounded-full px-6 py-3 shadow-lg">
                <div className="flex items-center space-x-3 text-white">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-semibold">達成度</span>
                  <span className="text-2xl font-bold">
                    {calculateSubProgress(cellId)}%
                  </span>
                  {calculateSubProgress(cellId) >= 80 && (
                    <Award className="h-6 w-6 text-yellow-300 animate-bounce" />
                  )}
                </div>
              </div>
              <div className="max-w-5xl ml-auto">
                <div className="mt-4 text-right">
                  <button
                    onClick={() => {
                      alert(
                        "保存しました！この調子で頑張りましょう！（デモモード）"
                      );
                    }}
                    className="btn-primary flex items-center space-x-2 text-sm px-4 py-2 ml-auto"
                  >
                    <Save className="h-4 w-4" />
                    <span>変更を保存</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 励ましメッセージ */}
          <div className="mt-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center justify-center space-x-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <p className="text-sm font-medium text-gray-700">
                「{mainCell.title}
                」を達成することで、理想の自分に近づいていきます！
              </p>
            </div>
          </div>
        </div>

        {/* 3x3グリッド */}
        <div className="max-w-10xl mx-auto">
          <div className="grid grid-cols-3 gap-4 p-4">
            {positions.map(({ idx }) => {
              // 中央のセル（親目標）
              if (idx === -1) {
                return (
                  <div
                    key="center"
                    className={`h-64 bg-gradient-to-br ${getAchievementColor(
                      mainCell.achievement
                    )} rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center`}
                  >
                    {/* <Target className="h-10 w-10 text-white mb-3" /> */}
                    <div className="text-white text-center font-bold text-xl mb-2">
                      {mainCell.title}
                    </div>
                    <div className="text-white/90 text-3xl font-bold">
                      {mainCell.achievement}%
                    </div>
                  </div>
                );
              }

              const subCell = subChart.cells[idx];
              return (
                <div
                  key={subCell.id}
                  className={`h-64 bg-gradient-to-br ${getAchievementColor(
                    subCell.achievement
                  )} rounded-2xl shadow-lg p-4 transform hover:scale-102 transition-all duration-300`}
                >
                  <div className="h-full flex flex-col justify-between space-y-3">
                    {/* タイトル入力 */}
                    <input
                      type="text"
                      value={subCell.title}
                      onChange={(e) =>
                        updateSubCell(
                          cellId,
                          subCell.id,
                          "title",
                          e.target.value
                        )
                      }
                      className="w-full bg-white/95 rounded-lg px-3 py-2 font-semibold text-gray-800 placeholder-gray-400 focus:ring-4 focus:ring-[#67BACA] focus:outline-none shadow-sm"
                      placeholder="具体的な行動"
                    />

                    {/* 達成度スライダー */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-white text-sm font-medium">
                          達成度
                        </span>
                        <div className="flex items-center space-x-1">
                          {getAchievementIcon(subCell.achievement)}
                          <span className="text-white font-bold text-lg">
                            {subCell.achievement}%
                          </span>
                        </div>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={subCell.achievement}
                        onChange={(e) =>
                          updateSubCell(
                            cellId,
                            subCell.id,
                            "achievement",
                            Number(e.target.value)
                          )
                        }
                        className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-white/30 slider"
                        style={{
                          background: `linear-gradient(to right, #fff ${subCell.achievement}%, rgba(255,255,255,0.3) ${subCell.achievement}%)`,
                        }}
                      />
                    </div>

                    {/* 進捗メモ */}
                    <textarea
                      value={subCell.comment}
                      onChange={(e) =>
                        updateSubCell(
                          cellId,
                          subCell.id,
                          "comment",
                          e.target.value
                        )
                      }
                      className="w-full bg-white/95 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder-gray-400 resize-none focus:ring-4 focus:ring-[#67BACA] focus:outline-none shadow-sm"
                      rows={3}
                      placeholder="進捗メモ"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 保存ボタン */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <div className="text-center space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <p className="font-bold text-gray-800">つらくなったら...</p>
              </div>
              <p className="text-sm text-gray-600">
                メインチャートに戻って「なぜ？」の欄を読み返しましょう。
                <br />
                あなたが目標を立てた時の想いが、きっと力をくれます。
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {selectedCell ? renderSubChart(selectedCell) : renderMainChart()}
    </div>
  );
};

export default MandalaChart;
