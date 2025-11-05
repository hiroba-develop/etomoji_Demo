import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Save,
  TrendingUp,
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

  // ガイドページ表示状態（null: 非表示, 'center': 最終目標, 0-7: 要素番号）
  const [showGuidePage, setShowGuidePage] = useState<null | "center" | number>(
    null
  );

  // STEP2の現在のページ（0-12の13ページ）
  const [currentElementPage, setCurrentElementPage] = useState(0);

  // 初回表示時、最終目標が未設定なら目標デザインガイドを開く
  useEffect(() => {
    if (!centerGoal) {
      setShowGuidePage("center");
    }
  }, []); // 初回マウント時のみ実行

  // ガイドページでの回答を一時保存（分野数は可変、最終的に8つ選択）
  const [guideAnswers, setGuideAnswers] = useState<{
    centerGoalAnswer: string;
    centerGoalQuestions?: string[]; // 最終目標の深掘り質問の回答
    centerFeelingAnswer: string;
    categories: {
      [key: string]: {
        answers: string[]; // 質問の回答（分野で共有）
        elements: Array<{
          id: string;
          title: string;
          position: number | null; // 1-8の位置、nullは未選択
        }>;
      };
    };
  }>({
    centerGoalAnswer: "",
    centerGoalQuestions: [],
    centerFeelingAnswer: "",
    categories: {},
  });

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
    setShowGuidePage(null);
    setCurrentElementPage(0);
  };

  const handleShowCenterGuide = () => {
    setShowGuidePage("center");
  };

  const handleShowElementGuide = (elementIndex: number) => {
    setShowGuidePage(elementIndex);

    // 既に入力されている要素があれば、その分野を探す
    const cell = mainCells[elementIndex];
    if (cell && cell.title) {
      const categoryIndex = elementCategories.findIndex(
        (cat) => cat.title === cell.title || cat.placeholder === cell.title
      );
      if (categoryIndex >= 0) {
        setCurrentElementPage(categoryIndex);
      } else {
        setCurrentElementPage(0);
      }
    } else {
      setCurrentElementPage(0);
    }
    // 初期表示は未選択にするため、positionは自動設定しない
  };

  const handleNextElementPage = () => {
    if (currentElementPage < 12) {
      setCurrentElementPage(currentElementPage + 1);
    }
  };

  const handlePrevElementPage = () => {
    if (currentElementPage > 0) {
      setCurrentElementPage(currentElementPage - 1);
    }
  };

  const handleApplyGuideAnswers = () => {
    // 中央目標のみ保存する場合
    if (showGuidePage === "center") {
      if (guideAnswers.centerGoalAnswer) {
        setCenterGoal(guideAnswers.centerGoalAnswer);
      }
      if (guideAnswers.centerFeelingAnswer) {
        setCenterFeeling(guideAnswers.centerFeelingAnswer);
      }
      alert("最終目標と想いを保存しました！");

      // 最終目標が設定されている場合のみメインチャートに遷移
      if (guideAnswers.centerGoalAnswer) {
        setShowGuidePage(null);
      }
      return;
    }

    // 要素ガイドページから保存する場合（全ての分野を一括保存）
    if (typeof showGuidePage === "number") {
      // 位置ベースで全ての要素を配置
      const positionMap: { [key: number]: string } = {};
      Object.values(guideAnswers.categories).forEach((cat) => {
        cat.elements?.forEach((element) => {
          if (element.position && element.title) {
            positionMap[element.position] = element.title;
          }
        });
      });

      setMainCells((prev) =>
        prev.map((cell, index) => ({
          ...cell,
          title: positionMap[index + 1] || cell.title,
        }))
      );

      const selectedCount = Object.keys(positionMap).length;
      if (selectedCount === 0) {
        alert("配置位置を選択してください。");
        return;
      } else if (selectedCount < 8) {
        alert(
          `${selectedCount}個の要素が保存されました。メインチャートで残りを記入してください。`
        );
      } else {
        alert("保存しました！8つの要素がメインチャートに反映されました。");
      }
      setShowGuidePage(null);
      return;
    }

    // 全体保存（従来の動作）
    if (guideAnswers.centerGoalAnswer) {
      setCenterGoal(guideAnswers.centerGoalAnswer);
    }
    if (guideAnswers.centerFeelingAnswer) {
      setCenterFeeling(guideAnswers.centerFeelingAnswer);
    }

    // 位置ベースで要素を配置
    const positionMap: { [key: number]: string } = {};
    Object.values(guideAnswers.categories).forEach((cat) => {
      cat.elements?.forEach((element) => {
        if (element.position && element.title) {
          positionMap[element.position] = element.title;
        }
      });
    });

    setMainCells((prev) =>
      prev.map((cell, index) => ({
        ...cell,
        title: positionMap[index + 1] || cell.title,
      }))
    );

    const selectedCount = Object.keys(positionMap).length;
    if (selectedCount < 8) {
      alert(
        `${selectedCount}個の要素が保存されました。メインチャートで残りを記入してください。`
      );
    } else {
      alert("保存しました！8つの要素がメインチャートに反映されました。");
    }
    setShowGuidePage(null);
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

  // 分野の定義（中央目標と8要素用）
  const elementCategories = [
    {
      number: 1,
      title: "キャリア・仕事",
      color: "from-blue-50 to-blue-100",
      borderColor: "border-blue-300",
      deepQuestions: [
        "あなたが仕事で達成したいことは何ですか？",
        "なぜそれを達成したいのですか？",
        "それを達成することで、あなたはどう変わりますか？",
        "なぜその変化を求めているのですか？",
        "それが実現したら、どのような気持ちになりますか？",
        "その願いは、いつ、どんな体験から生まれましたか？",
      ],
      placeholder: "例：リーダーシップを発揮できる人材になる",
    },
    {
      number: 2,
      title: "健康・体力",
      color: "from-green-50 to-green-100",
      borderColor: "border-green-300",
      deepQuestions: [
        "あなたが手に入れたい健康状態を具体的に教えてください",
        "なぜその健康状態を手に入れたいのですか？",
        "健康になることで、何ができるようになりますか？",
        "なぜそれをやりたいのですか？",
        "その想いの原点は、どんな体験にありますか？",
      ],
      placeholder: "例：毎日エネルギッシュに活動できる体力",
    },
    {
      number: 3,
      title: "経済・お金",
      color: "from-yellow-50 to-yellow-100",
      borderColor: "border-yellow-300",
      deepQuestions: [
        "経済的に、どんな状態になりたいですか？",
        "なぜその状態を目指しているのですか？",
        "お金があることで実現したいことは何ですか？",
        "なぜそれを実現したいのですか？",
        "その背景にある、あなたの価値観は何ですか？",
        "その価値観は、どんな経験から生まれましたか？",
      ],
      placeholder: "例：経済的な不安なく、自由に選択できる",
    },
    {
      number: 4,
      title: "人間関係",
      color: "from-pink-50 to-pink-100",
      borderColor: "border-pink-300",
      deepQuestions: [
        "どんな人間関係を築きたいですか？",
        "なぜそのような関係を求めているのですか？",
        "その関係があることで、あなたは何を得られますか？",
        "なぜそれが必要なのですか？",
        "人間関係に求める本質的なものは何ですか？",
        "それを求めるようになったきっかけは何ですか？",
      ],
      placeholder: "例：互いに支え合える信頼関係",
    },
    {
      number: 5,
      title: "学び・スキル",
      color: "from-purple-50 to-purple-100",
      borderColor: "border-purple-300",
      deepQuestions: [
        "どんな知識やスキルを身につけたいですか？",
        "なぜそれを学びたいのですか？",
        "それを習得することで、どんな自分になれますか？",
        "なぜそんな自分になりたいのですか？",
        "学びを通じて、本当に実現したいことは何ですか？",
        "その想いは、いつから持っていますか？",
      ],
      placeholder: "例：専門性を深めて、唯一無二の存在になる",
    },
    {
      number: 6,
      title: "趣味・楽しみ",
      color: "from-orange-50 to-orange-100",
      borderColor: "border-orange-300",
      deepQuestions: [
        "どんなことを楽しみたいですか？",
        "なぜそれを楽しみたいのですか？",
        "それをすることで、どんな気持ちになりますか？",
        "なぜその気持ちを求めているのですか？",
        "人生で大切にしたい「楽しみ」の本質は何ですか？",
      ],
      placeholder: "例：心から没頭できる趣味を持つ",
    },
    {
      number: 7,
      title: "生活習慣",
      color: "from-teal-50 to-teal-100",
      borderColor: "border-teal-300",
      deepQuestions: [
        "どんな生活習慣を身につけたいですか？",
        "なぜその習慣が必要だと感じていますか？",
        "その習慣があることで、何が変わりますか？",
        "なぜその変化を求めているのですか？",
        "理想の日常を送ることで、本当に得たいものは何ですか？",
      ],
      placeholder: "例：規則正しく、充実した毎日を送る",
    },
    {
      number: 8,
      title: "家族・パートナー",
      color: "from-rose-50 to-rose-100",
      borderColor: "border-rose-300",
      deepQuestions: [
        "家族やパートナーと、どんな関係でいたいですか？",
        "なぜそのような関係を築きたいのですか？",
        "それが実現したら、あなたはどう感じますか？",
        "なぜそう感じたいのですか？",
        "家族に対する本当の想いは何ですか？",
        "その想いは、どこから来ていますか？",
      ],
      placeholder: "例：家族みんなが笑顔で過ごせる関係",
    },
    {
      number: 9,
      title: "社会貢献",
      color: "from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-300",
      deepQuestions: [
        "社会にどんな貢献をしたいですか？",
        "なぜその貢献をしたいのですか？",
        "それをすることで、あなたは何を感じますか？",
        "なぜそう感じたいのですか？",
        "社会貢献を通じて実現したい本質的なことは何ですか？",
        "その想いの原点にある体験は何ですか？",
      ],
      placeholder: "例：次世代に良い影響を与える存在になる",
    },
    {
      number: 10,
      title: "精神・心の豊かさ",
      color: "from-violet-50 to-violet-100",
      borderColor: "border-violet-300",
      deepQuestions: [
        "心の豊かさとは、あなたにとって何ですか？",
        "なぜそれを求めているのですか？",
        "それがあることで、人生はどう変わりますか？",
        "なぜその変化が大切なのですか？",
        "心の奥底で本当に求めているものは何ですか？",
      ],
      placeholder: "例：穏やかで満たされた心の状態",
    },
    {
      number: 11,
      title: "自己表現・創造",
      color: "from-fuchsia-50 to-fuchsia-100",
      borderColor: "border-fuchsia-300",
      deepQuestions: [
        "どんな形で自分を表現したいですか？",
        "なぜそれを表現したいのですか？",
        "表現することで、何を伝えたいのですか？",
        "なぜそれを伝えたいのですか？",
        "自己表現を通じて、本当に実現したいことは何ですか？",
        "その想いは、どんな体験から生まれましたか？",
      ],
      placeholder: "例：自分らしさを形にして発信する",
    },
    {
      number: 12,
      title: "時間・自由",
      color: "from-cyan-50 to-cyan-100",
      borderColor: "border-cyan-300",
      deepQuestions: [
        "時間をどう使いたいですか？",
        "なぜそのように時間を使いたいのですか？",
        "自由な時間があることで、何をしたいですか？",
        "なぜそれをしたいのですか？",
        "時間の自由を通じて、本当に手に入れたいものは何ですか？",
      ],
      placeholder: "例：自分の時間を自分でコントロールできる",
    },
    {
      number: 13,
      title: "その他",
      color: "from-gray-50 to-gray-100",
      borderColor: "border-gray-300",
      deepQuestions: [
        "あなたの目標に関連する、上記以外の重要な分野は何ですか？",
        "なぜその分野が重要だと思いますか？",
        "その分野で達成したいことは何ですか？",
        "なぜそれを達成したいのですか？",
        "その分野を通じて、本当に実現したいことは何ですか？",
        "その想いの原点はどこにありますか？",
      ],
      placeholder: "例：地域貢献、環境保護、子育てなど",
    },
  ];

  // 中央目標ガイドページ（STEP 1のみ）
  const renderCenterGuidePage = () => {
    return (
      <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto px-2 sm:px-4">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 border border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <button
              onClick={handleBackToMain}
              disabled={!centerGoal}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all transform ${
                !centerGoal
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#67BACA] to-[#5AA8B8] text-white hover:shadow-lg hover:scale-105"
              }`}
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">メインチャートへ</span>
              <span className="sm:hidden">メインチャートへ</span>
            </button>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
              目標デザインガイド
            </h2>
            <div className="w-16 sm:w-24 hidden md:block"></div>
          </div>
        </div>

        {/* ステップ1: 中央の最終目標 */}
        <div className="bg-gradient-to-br from-[#4cb5a9] to-[#3a9b8f] rounded-xl shadow-xl p-4 sm:p-8 border-4 border-white">
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              ✨ あなたの最終目標は何ですか？
            </h3>
            <p className="text-white/90 text-xs sm:text-sm">
              必ず成し遂げたい、人生の大きな目標を一つ決めましょう
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg space-y-3 sm:space-y-4">
            {/* 深掘り質問 */}
            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-[#4cb5a9]/10 to-[#67BACA]/10 rounded-lg p-3 sm:p-4 border-2 border-[#4cb5a9]/30">
                <p className="text-sm sm:text-base font-semibold text-gray-800 mb-2">
                  🤔 まず、あなたの心に問いかけてみましょう
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  以下の質問に答えながら、あなたの本当に達成したい目標を見つけましょう。
                </p>
              </div>

              {[
                "あなたが人生で成し遂げたいことは何ですか？",
                "なぜそれを成し遂げたいのですか？",
                "それを達成したとき、あなたはどんな気持ちになると思いますか？",
                "なぜその気持ちを得たいのですか？",
                "その目標の先に、本当に手に入れたいものは何ですか？",
              ].map((question, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-3 sm:p-4 border-2 border-gray-200"
                >
                  <div className="flex items-start space-x-2 mb-2">
                    <span className="bg-[#4cb5a9] text-white px-2 py-1 rounded text-xs font-bold flex-shrink-0">
                      Q{index + 1}.
                    </span>
                    <p className="text-sm text-gray-700 font-medium">
                      {question}
                    </p>
                  </div>
                  <textarea
                    value={guideAnswers.centerGoalQuestions?.[index] || ""}
                    onChange={(e) =>
                      setGuideAnswers((prev) => {
                        const newQuestions = [
                          ...(prev.centerGoalQuestions || []),
                        ];
                        // 配列のサイズを確保
                        while (newQuestions.length <= index) {
                          newQuestions.push("");
                        }
                        newQuestions[index] = e.target.value;
                        return {
                          ...prev,
                          centerGoalQuestions: newQuestions,
                        };
                      })
                    }
                    className="w-full h-16 sm:h-20 border-2 border-gray-300 rounded-lg p-2 sm:p-3 text-sm text-gray-700 focus:border-[#4cb5a9] focus:outline-none resize-none bg-white"
                    placeholder="回答を入力してください"
                  />
                </div>
              ))}
            </div>

            {/* 最終目標の決定 */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 sm:p-5 border-3 border-[#4cb5a9]">
              <label className="block text-sm sm:text-base font-bold text-gray-800 mb-2">
                <span className="bg-[#4cb5a9] text-white px-3 py-1 rounded text-sm mr-2">
                  決定
                </span>
                あなたの最終目標を一言で表現してください
              </label>
              <textarea
                value={guideAnswers.centerGoalAnswer}
                onChange={(e) =>
                  setGuideAnswers((prev) => ({
                    ...prev,
                    centerGoalAnswer: e.target.value,
                  }))
                }
                className="w-full h-16 sm:h-20 border-2 border-[#4cb5a9] rounded-lg p-2 sm:p-3 text-sm sm:text-base text-gray-800 focus:border-[#4cb5a9] focus:ring-2 focus:ring-[#4cb5a9]/30 focus:outline-none resize-none bg-white font-semibold"
                placeholder="例：起業して年商1億円を達成する"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-2">
                💭 なぜその目標を達成したいのですか？（あなたの想い）
              </label>
              <textarea
                value={guideAnswers.centerFeelingAnswer}
                onChange={(e) =>
                  setGuideAnswers((prev) => ({
                    ...prev,
                    centerFeelingAnswer: e.target.value,
                  }))
                }
                className="w-full h-20 sm:h-24 border-2 border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base text-gray-800 focus:border-[#4cb5a9] focus:outline-none resize-none"
                placeholder="この目標を達成したいと思った理由、込めた想いや感情を自由に書いてください"
              />
            </div>
          </div>
        </div>

        {/* 保存ボタン */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border border-gray-200">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Award className="h-5 w-5 sm:h-6 sm:w-6 text-[#4cb5a9]" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                回答を保存しますか？
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 px-2">
              保存すると、最終目標と想いがメインチャートの中央に反映されます。
              <br />
              最終目標未入力の場合はメインチャートに遷移しません。
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={handleBackToMain}
                disabled={!centerGoal}
                className={`font-bold px-6 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base order-2 sm:order-1 ${
                  !centerGoal
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-500 text-white hover:bg-gray-600"
                }`}
              >
                キャンセル
              </button>
              <button
                onClick={handleApplyGuideAnswers}
                className="bg-gradient-to-r from-[#4cb5a9] to-[#3a9b8f] text-white font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base order-1 sm:order-2"
              >
                <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>保存してメインチャートへ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 要素ガイドページ（STEP 2のみ）
  const renderElementGuidePage = () => {
    return (
      <div className="space-y-4 sm:space-y-6 max-w-5xl mx-auto px-2 sm:px-4">
        {/* ヘッダー */}
        <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 border border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <button
              onClick={handleBackToMain}
              disabled={!centerGoal}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all transform ${
                !centerGoal
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#67BACA] to-[#5AA8B8] text-white hover:shadow-lg hover:scale-105"
              }`}
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">メインチャートへ</span>
              <span className="sm:hidden">メインチャートへ</span>
            </button>
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">
              目標デザインガイド - 要素を考える
            </h2>
            <div className="w-16 sm:w-24 hidden md:block"></div>
          </div>
        </div>

        {/* ステップ2: 8つの要素 */}
        <div className="bg-white rounded-xl shadow-xl p-4 sm:p-8 border-2 border-gray-200">
          <div className="text-center mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              🎯 目標達成に必要な要素を考えましょう
            </h3>
            <p className="text-gray-600 text-xs sm:text-sm px-2">
              質問に答えながら思考を深め、目標要素を決めてください。
              <br className="hidden sm:inline" />
              <span className="sm:hidden"> </span>
              全ての分野に答える必要はありません。あなたの目標に関連する分野だけで構いません。
            </p>

            {/* ページインジケーター */}
            <div className="mt-4 flex flex-col items-center space-y-3">
              <span className="text-sm font-bold text-gray-600">
                分野 {currentElementPage + 1} / {elementCategories.length}
              </span>
              <div className="flex space-x-1">
                {elementCategories.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentElementPage(index)}
                    className={`h-2 rounded-full transition-all hover:opacity-80 ${
                      index === currentElementPage
                        ? "bg-purple-500 w-6"
                        : "bg-gray-300 w-2 hover:bg-gray-400"
                    }`}
                    title={`${elementCategories[index].title}に移動`}
                  />
                ))}
              </div>

              {/* 分野名のタブ */}
              <div className="w-full overflow-x-auto -mx-2 sm:mx-0">
                <div
                  className="flex gap-2 px-2 sm:px-4 pb-2"
                  style={{ minWidth: "max-content" }}
                >
                  {elementCategories.map((category, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentElementPage(index)}
                      className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                        index === currentElementPage
                          ? "bg-purple-500 text-white shadow-md"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {elementCategories
              .filter((_, index) => index === currentElementPage)
              .map((category, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br ${category.color} rounded-xl p-4 sm:p-6 border-2 ${category.borderColor} shadow-md`}
                >
                  {/* カテゴリーヘッダー */}
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-4 sm:mb-5">
                    <div className="bg-purple-500 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-base sm:text-lg shadow-md flex-shrink-0">
                      {category.number}
                    </div>
                    <h4 className="text-lg sm:text-xl font-bold text-gray-800">
                      {category.title}
                    </h4>
                  </div>

                  {/* 深掘り質問と記述欄 */}
                  <div className="space-y-4 mb-4">
                    <p className="text-xs font-bold text-purple-700 flex items-center">
                      <Lightbulb className="h-4 w-4 mr-1" />
                      思考を深める質問
                    </p>
                    {category.deepQuestions.map((question, qIndex) => {
                      const categoryKey = `category${category.number}`;
                      const currentCategory = guideAnswers.categories[
                        categoryKey
                      ] || {
                        answers: [],
                        elements: [],
                      };

                      return (
                        <div
                          key={qIndex}
                          className="bg-white/70 rounded-lg p-3 sm:p-4"
                        >
                          <div className="mb-2 flex items-start">
                            <span className="text-purple-500 mr-2 font-bold min-w-[24px] text-sm">
                              Q{qIndex + 1}.
                            </span>
                            <p className="text-sm text-gray-700 font-medium">
                              {question}
                            </p>
                          </div>
                          <textarea
                            value={currentCategory.answers[qIndex] || ""}
                            onChange={(e) =>
                              setGuideAnswers((prev) => {
                                const newAnswers = [
                                  ...(prev.categories[categoryKey]?.answers ||
                                    []),
                                ];
                                newAnswers[qIndex] = e.target.value;
                                return {
                                  ...prev,
                                  categories: {
                                    ...prev.categories,
                                    [categoryKey]: {
                                      ...prev.categories[categoryKey],
                                      answers: newAnswers,
                                      elements:
                                        prev.categories[categoryKey]
                                          ?.elements || [],
                                    },
                                  },
                                };
                              })
                            }
                            className="w-full h-20 sm:h-24 border-2 border-gray-300 rounded-lg p-2 sm:p-3 text-sm text-gray-700 focus:border-purple-500 focus:outline-none resize-none bg-white"
                            placeholder="回答を入力してください"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* 要素の登録エリア */}
                  <div className="bg-white rounded-lg p-3 sm:p-4 border-2 border-purple-300">
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-xs sm:text-sm font-bold text-gray-800">
                        <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs mr-2">
                          決定
                        </span>
                        <span className="text-xs sm:text-sm">
                          この分野の要素を登録
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setGuideAnswers((prev) => {
                            const categoryKey = `category${category.number}`;
                            const currentElements =
                              prev.categories[categoryKey]?.elements || [];
                            return {
                              ...prev,
                              categories: {
                                ...prev.categories,
                                [categoryKey]: {
                                  ...prev.categories[categoryKey],
                                  answers:
                                    prev.categories[categoryKey]?.answers || [],
                                  elements: [
                                    ...currentElements,
                                    {
                                      id: `${categoryKey}_${Date.now()}`,
                                      title: "",
                                      position: null,
                                    },
                                  ],
                                },
                              },
                            };
                          });
                        }}
                        className="bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:shadow-md transition-all"
                      >
                        ➕ 要素を追加
                      </button>
                    </div>

                    {/* 要素リスト */}
                    {(() => {
                      const categoryKey = `category${category.number}`;
                      const currentElements =
                        guideAnswers.categories[categoryKey]?.elements || [];

                      if (currentElements.length === 0) {
                        return (
                          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                            <p className="text-sm text-gray-500">
                              「➕
                              要素を追加」ボタンをクリックして要素を追加してください
                            </p>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-3">
                          {currentElements.map((element, elementIndex) => (
                            <div
                              key={element.id}
                              className="bg-purple-50 border-2 border-purple-200 rounded-lg p-3 space-y-3"
                            >
                              <div className="flex items-start gap-2">
                                <span className="bg-purple-500 text-white px-2 py-1 rounded text-xs font-bold flex-shrink-0">
                                  {elementIndex + 1}
                                </span>
                                <input
                                  type="text"
                                  value={element.title}
                                  onChange={(e) =>
                                    setGuideAnswers((prev) => {
                                      const newElements = [
                                        ...(prev.categories[categoryKey]
                                          ?.elements || []),
                                      ];
                                      newElements[elementIndex] = {
                                        ...newElements[elementIndex],
                                        title: e.target.value,
                                      };
                                      return {
                                        ...prev,
                                        categories: {
                                          ...prev.categories,
                                          [categoryKey]: {
                                            ...prev.categories[categoryKey],
                                            answers:
                                              prev.categories[categoryKey]
                                                ?.answers || [],
                                            elements: newElements,
                                          },
                                        },
                                      };
                                    })
                                  }
                                  className="flex-1 border-2 border-purple-300 rounded-lg p-2 text-sm font-semibold text-gray-800 focus:border-purple-600 focus:outline-none bg-white"
                                  placeholder={category.placeholder}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    setGuideAnswers((prev) => {
                                      const newElements = [
                                        ...(prev.categories[categoryKey]
                                          ?.elements || []),
                                      ];
                                      newElements.splice(elementIndex, 1);
                                      return {
                                        ...prev,
                                        categories: {
                                          ...prev.categories,
                                          [categoryKey]: {
                                            ...prev.categories[categoryKey],
                                            answers:
                                              prev.categories[categoryKey]
                                                ?.answers || [],
                                            elements: newElements,
                                          },
                                        },
                                      };
                                    });
                                  }}
                                  className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold hover:bg-red-600 transition-all flex-shrink-0"
                                >
                                  削除
                                </button>
                              </div>

                              <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-700">
                                  マンダラチャートの配置位置:
                                </label>

                                {/* 要素未入力時の注意メッセージ */}
                                {!element.title.trim() && (
                                  <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-2 text-center">
                                    <p className="text-xs text-yellow-700 font-semibold">
                                      ⚠️
                                      要素を入力してから配置位置を選択してください
                                    </p>
                                  </div>
                                )}

                                {/* 配置位置の選択可能な図 */}
                                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-2 border-2 border-purple-200">
                                  <div className="grid grid-cols-3 gap-1 max-w-[200px] mx-auto">
                                    {[
                                      { pos: 1, label: "左上" },
                                      { pos: 2, label: "中上" },
                                      { pos: 3, label: "右上" },
                                      { pos: 4, label: "左中" },
                                      null, // 中央
                                      { pos: 5, label: "右中" },
                                      { pos: 6, label: "左下" },
                                      { pos: 7, label: "中下" },
                                      { pos: 8, label: "右下" },
                                    ].map((item) => {
                                      if (item === null) {
                                        // 中央（選択不可）
                                        return (
                                          <div
                                            key="center"
                                            className="bg-gradient-to-br from-purple-200 to-purple-300 border-2 border-purple-400 rounded p-1.5 text-center cursor-not-allowed"
                                          >
                                            <span className="text-[10px] font-bold text-purple-800">
                                              目標
                                            </span>
                                          </div>
                                        );
                                      }

                                      const isSelected =
                                        element.position === item.pos;
                                      const isTitleEmpty =
                                        !element.title.trim();

                                      // 他の要素で既に使用されている位置かチェック
                                      const isOccupiedByOther = Object.values(
                                        guideAnswers.categories
                                      ).some((cat) =>
                                        cat.elements?.some(
                                          (el) =>
                                            el.id !== element.id &&
                                            el.position === item.pos
                                        )
                                      );

                                      const isDisabled =
                                        isOccupiedByOther ||
                                        (isTitleEmpty && !isSelected);

                                      return (
                                        <button
                                          key={item.pos}
                                          type="button"
                                          disabled={isDisabled}
                                          onClick={() => {
                                            if (isDisabled) return;

                                            setGuideAnswers((prev) => {
                                              const newElements = [
                                                ...(prev.categories[categoryKey]
                                                  ?.elements || []),
                                              ];
                                              newElements[elementIndex] = {
                                                ...newElements[elementIndex],
                                                position: isSelected
                                                  ? null
                                                  : item.pos,
                                              };
                                              return {
                                                ...prev,
                                                categories: {
                                                  ...prev.categories,
                                                  [categoryKey]: {
                                                    ...prev.categories[
                                                      categoryKey
                                                    ],
                                                    answers:
                                                      prev.categories[
                                                        categoryKey
                                                      ]?.answers || [],
                                                    elements: newElements,
                                                  },
                                                },
                                              };
                                            });
                                          }}
                                          className={`rounded p-1.5 text-center transition-all ${
                                            isSelected
                                              ? "bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-purple-700 shadow-lg text-white"
                                              : isDisabled
                                              ? "bg-gray-200 border-2 border-gray-400 cursor-not-allowed opacity-50"
                                              : "bg-white border-2 border-purple-300 hover:bg-purple-100 hover:scale-105 transform"
                                          }`}
                                        >
                                          <span
                                            className={`text-xs font-bold ${
                                              isSelected
                                                ? "text-white"
                                                : isDisabled
                                                ? "text-gray-500"
                                                : "text-purple-600"
                                            }`}
                                          >
                                            {item.pos}
                                          </span>
                                          {isDisabled && isOccupiedByOther && (
                                            <div className="text-[8px] text-gray-500">
                                              済
                                            </div>
                                          )}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  {element.position && (
                                    <div className="mt-1.5 text-center">
                                      <span className="inline-block bg-purple-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                                        位置 {element.position} を選択中
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              ))}
          </div>

          {/* ページネーションナビゲーション */}
          <div className="flex items-center justify-between mt-4 sm:mt-6 pt-4 sm:pt-6 border-t-2 border-gray-200 gap-2">
            <button
              onClick={handlePrevElementPage}
              disabled={currentElementPage === 0}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                currentElementPage === 0
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105"
              }`}
            >
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">前の分野</span>
              <span className="sm:hidden">前へ</span>
            </button>

            <div className="text-center flex-1">
              <p className="text-xs sm:text-sm text-gray-600 font-semibold truncate px-2">
                {elementCategories[currentElementPage].title}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {currentElementPage + 1} / {elementCategories.length}
              </p>
            </div>

            <button
              onClick={handleNextElementPage}
              disabled={currentElementPage === 12}
              className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg font-bold transition-all text-sm sm:text-base ${
                currentElementPage === 12
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:shadow-lg transform hover:scale-105"
              }`}
            >
              <span className="hidden sm:inline">次の分野</span>
              <span className="sm:hidden">次へ</span>
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 rotate-180" />
            </button>
          </div>
        </div>

        {/* 保存ボタン */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 border-2 border-[#4cb5a9] sticky bottom-2 sm:bottom-4">
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Award className="h-5 w-5 sm:h-6 sm:w-6 text-[#4cb5a9]" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                回答を保存しますか？
              </h3>
            </div>

            {/* 選択中の要素一覧 */}
            {typeof showGuidePage === "number" &&
              (() => {
                const selectedElements: Array<{
                  position: number;
                  title: string;
                }> = [];

                Object.values(guideAnswers.categories).forEach((cat) => {
                  cat.elements?.forEach((element) => {
                    if (element.position && element.title) {
                      selectedElements.push({
                        position: element.position,
                        title: element.title,
                      });
                    }
                  });
                });

                selectedElements.sort((a, b) => a.position - b.position);

                if (selectedElements.length > 0) {
                  const positionNames = [
                    "左上",
                    "中上",
                    "右上",
                    "左中",
                    "右中",
                    "左下",
                    "中下",
                    "右下",
                  ];
                  return (
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-3 border-2 border-purple-200 max-w-2xl mx-auto">
                      <p className="text-xs font-bold text-purple-700 mb-2">
                        📋 配置される要素一覧
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                        {selectedElements.map((element, index) => (
                          <div
                            key={index}
                            className="bg-white rounded px-3 py-2 text-xs flex items-center space-x-2 border border-purple-200"
                          >
                            <span className="bg-purple-500 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center text-xs flex-shrink-0">
                              {element.position}
                            </span>
                            <span className="text-gray-500 text-[10px] flex-shrink-0">
                              {positionNames[element.position - 1]}:
                            </span>
                            <span className="text-gray-800 font-semibold truncate">
                              {element.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

            <p className="text-xs sm:text-sm text-gray-600 px-2">
              {typeof showGuidePage === "number" ? (
                <>
                  {(() => {
                    let selectedCount = 0;
                    Object.values(guideAnswers.categories).forEach((cat) => {
                      cat.elements?.forEach((element) => {
                        if (element.position && element.title) {
                          selectedCount++;
                        }
                      });
                    });

                    if (selectedCount === 0) {
                      return "配置位置を選択した要素がメインチャートに保存されます。";
                    } else if (selectedCount === 1) {
                      return `現在1つの要素に配置位置が指定されています。保存するとメインチャートに反映されます。`;
                    } else {
                      return `現在${selectedCount}個の要素に配置位置が指定されています。保存するとメインチャートに反映されます。`;
                    }
                  })()}
                  <br className="hidden sm:inline" />
                  <span className="sm:hidden"> </span>
                </>
              ) : (
                <>
                  保存すると、中央の最終目標・想いと、位置を選択した要素がメインチャートに反映されます。
                  <br className="hidden sm:inline" />
                  <span className="sm:hidden"> </span>
                  13の分野から、あなたの目標に関連する要素を最大8つ選び、配置位置を指定してください。
                </>
              )}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={handleBackToMain}
                disabled={!centerGoal}
                className={`font-bold px-6 py-2.5 sm:py-3 rounded-lg transition-all text-sm sm:text-base order-2 sm:order-1 ${
                  !centerGoal
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gray-500 text-white hover:bg-gray-600"
                }`}
              >
                キャンセル
              </button>
              <button
                onClick={handleApplyGuideAnswers}
                className="bg-gradient-to-r from-[#4cb5a9] to-[#3a9b8f] text-white font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2 text-sm sm:text-base order-1 sm:order-2"
              >
                <Save className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>保存してメインチャートへ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

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

        {/* 3x3グリッド - マンダラチャートスタイル */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-0 border-4 border-gray-400 bg-white shadow-2xl rounded-xl">
            {positions.map(({ idx }) => {
              // 中央のセル
              if (idx === -1) {
                return (
                  <div
                    key="center"
                    className="aspect-square bg-gradient-to-br from-[#4cb5a9] to-[#4cb5a9] p-6 flex flex-col items-center justify-center transition-all duration-300 border-2 border-gray-800 group relative"
                  >
                    <div className="mb-3 text-white text-sm text-center font-bold">
                      ✨ 最終目標 ✨
                    </div>
                    {/* 中央目標（読み取り専用） */}
                    <div className="w-full min-h-[80px] max-h-40 bg-white border-2 border-white p-3 text-center font-bold text-lg text-gray-800 overflow-y-auto flex items-center justify-center">
                      {centerGoal ? (
                        <p className="whitespace-pre-wrap">{centerGoal}</p>
                      ) : (
                        <p className="text-gray-400">
                          📝 目標を考えるボタンから設定
                        </p>
                      )}
                    </div>

                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={handleShowCenterGuide}
                        className="text-center text-xs font-medium bg-purple-500 text-white rounded px-3 py-1 hover:bg-purple-600 shadow-md whitespace-nowrap"
                      >
                        📝 目標を考える
                      </button>
                    </div>

                    {/* なぜこの目標を掲げたのか - ホバー時に吹き出しとして表示 */}
                    <div className="absolute left-full ml-6 top-1/2 -translate-y-1/2 w-96 bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 border-4 border-[#4cb5a9] animate-in">
                      {/* 吹き出しの三角形 - より大きく目立つように */}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent border-r-[24px] border-r-[#4cb5a9] drop-shadow-lg"></div>
                      <div className="absolute right-full top-1/2 -translate-y-1/2 ml-1 w-0 h-0 border-t-[16px] border-t-transparent border-b-[16px] border-b-transparent border-r-[20px] border-r-white"></div>

                      {/* ヘッダー部分 */}
                      <div className="flex items-center space-x-2 mb-4 pb-3 border-b-2 border-[#4cb5a9]/30">
                        <div className="bg-[#4cb5a9] rounded-full p-2">
                          <MessageCircle className="h-5 w-5 text-white" />
                        </div>
                        <label className="text-base font-bold text-gray-800">
                          なぜこの目標を掲げたのか？
                        </label>
                      </div>

                      {/* 表示エリア（読み取り専用） */}
                      <div className="relative">
                        <div className="w-full h-36 text-sm text-gray-700 bg-gray-50 rounded-2xl border-3 border-[#4cb5a9]/20 p-4 shadow-inner overflow-y-auto">
                          {centerFeeling ? (
                            <p className="whitespace-pre-wrap">
                              {centerFeeling}
                            </p>
                          ) : (
                            <p className="text-gray-400 italic">
                              💭 目標デザインガイドで想いを記入してください
                            </p>
                          )}
                        </div>
                      </div>

                      {/* 下部のヒント */}
                      <div className="mt-3 text-xs text-gray-500 text-center italic">
                        ✨ あなたの想いが、目標達成への原動力になります
                      </div>
                    </div>
                  </div>
                );
              }

              const cell = mainCells[idx];
              const cornerClass =
                idx === 0
                  ? "rounded-tl-lg" // 左上
                  : idx === 2
                  ? "rounded-tr-lg" // 右上
                  : idx === 5
                  ? "rounded-bl-lg" // 左下
                  : idx === 7
                  ? "rounded-br-lg" // 右下
                  : "";
              return (
                <div
                  key={cell.id}
                  className={`aspect-square bg-[#f8fffe] p-4 transform hover:bg-[#e8f7f5] transition-all duration-200 group border border-gray-800 flex flex-col relative ${cornerClass}`}
                >
                  {/* 達成度表示 */}
                  <div className="absolute top-2 right-2">
                    <div className="bg-white rounded-full px-2 py-1 shadow-sm border border-gray-300">
                      <span className="text-xs font-bold text-gray-700">
                        {cell.achievement}%
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center">
                    <textarea
                      value={cell.title}
                      onChange={(e) =>
                        updateMainCell(cell.id, "title", e.target.value)
                      }
                      className="w-full bg-gray-50 border-2 border-gray-300 px-3 py-2 text-center font-semibold text-gray-800 text-sm min-h-[40px] max-h-32 focus:bg-white focus:border-[#4cb5a9] focus:outline-none resize-none overflow-y-auto"
                      placeholder="要素を入力"
                      rows={1}
                      style={{
                        height: "auto",
                        minHeight: "40px",
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height =
                          Math.min(target.scrollHeight, 128) + "px";
                      }}
                    />
                  </div>

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() =>
                        handleShowElementGuide(idx < 4 ? idx : idx - 1)
                      }
                      className="text-center text-xs font-medium bg-purple-500 text-white rounded px-3 py-1 hover:bg-purple-600 shadow-md whitespace-nowrap"
                    >
                      📝 要素を考える
                    </button>
                    <button
                      onClick={() => handleMainCellClick(cell.id)}
                      className="text-center text-xs font-medium bg-[#4cb5a9] text-white rounded px-3 py-1 hover:bg-[#3a9b8f] shadow-md whitespace-nowrap"
                    >
                      💡 詳細チャートへ
                    </button>
                  </div>
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
              <span>メインチャートへ</span>
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

        {/* 3x3グリッド - サブチャート */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-0 border-4 border-gray-400 bg-white shadow-2xl rounded-xl">
            {positions.map(({ idx }) => {
              // 中央のセル（親目標）
              if (idx === -1) {
                return (
                  <div
                    key="center"
                    className={`aspect-square bg-gradient-to-br ${getAchievementColor(
                      mainCell.achievement
                    )} p-6 flex flex-col items-center justify-center border-2 border-gray-800`}
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
              const cornerClass =
                idx === 0
                  ? "rounded-tl-lg" // 左上
                  : idx === 2
                  ? "rounded-tr-lg" // 右上
                  : idx === 5
                  ? "rounded-bl-lg" // 左下
                  : idx === 7
                  ? "rounded-br-lg" // 右下
                  : "";
              return (
                <div
                  key={subCell.id}
                  className={`aspect-square bg-gradient-to-br ${getAchievementColor(
                    subCell.achievement
                  )} p-4 transition-all duration-200 border border-gray-800 ${cornerClass}`}
                >
                  <div className="h-full flex flex-col justify-between space-y-2">
                    {/* タイトル入力 */}
                    <textarea
                      value={subCell.title}
                      onChange={(e) =>
                        updateSubCell(
                          cellId,
                          subCell.id,
                          "title",
                          e.target.value
                        )
                      }
                      className="w-full min-h-[36px] max-h-24 bg-white border-2 border-white px-2 py-1.5 font-semibold text-sm text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-white focus:outline-none resize-none overflow-y-auto"
                      placeholder="具体的な行動"
                      rows={1}
                      style={{
                        height: "auto",
                        minHeight: "36px",
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height =
                          Math.min(target.scrollHeight, 96) + "px";
                      }}
                    />

                    {/* 達成度スライダー */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white text-xs font-bold">
                          達成度
                        </span>
                        <span className="text-white font-bold text-sm bg-white/20 px-2 py-0.5 rounded">
                          {subCell.achievement}%
                        </span>
                      </div>
                      {/* プログレスバーとスライダーを重ねる */}
                      <div className="relative">
                        {/* プログレスバー */}
                        <div className="w-full bg-white/30 h-3 border border-white/50">
                          <div
                            className={`h-full transition-all duration-300 ${getMeterColor(
                              subCell.achievement
                            )}`}
                            style={{ width: `${subCell.achievement}%` }}
                          />
                        </div>
                        {/* スライダーをプログレスバーの上に重ねる */}
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
                          className="absolute top-0 left-0 w-full h-3 appearance-none bg-transparent cursor-pointer"
                          style={{
                            WebkitAppearance: "none",
                          }}
                        />
                      </div>
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
                      className="w-full min-h-[48px] max-h-32 bg-white border-2 border-white px-2 py-1.5 text-xs text-gray-800 placeholder-gray-400 resize-none focus:ring-2 focus:ring-white focus:outline-none overflow-y-auto"
                      rows={2}
                      placeholder="進捗メモ"
                      style={{
                        height: "auto",
                        minHeight: "48px",
                      }}
                      onInput={(e) => {
                        const target = e.target as HTMLTextAreaElement;
                        target.style.height = "auto";
                        target.style.height =
                          Math.min(target.scrollHeight, 128) + "px";
                      }}
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
                最終目標を掲げた理由を読み返しましょう。
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
    <div className="min-h-screen bg-background">
      {showGuidePage === "center"
        ? renderCenterGuidePage()
        : showGuidePage !== null
        ? renderElementGuidePage()
        : selectedCell
        ? renderSubChart(selectedCell)
        : renderMainChart()}
    </div>
  );
};

export default MandalaChart;
