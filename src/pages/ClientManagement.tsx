import React, { useState, useEffect } from "react";
import {
  Users,
  DollarSign,
  Target,
  Calendar,
  ChevronRight,
  ArrowLeft,
  User,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  History,
  Map,
  PlusCircle,
  TrendingUp,
} from "lucide-react";
import type {
  UserPerformanceData,
  RoadmapYear,
  RoadmapQuarter,
  RoadmapAdvice,
  CompanySize,
  Industry,
  FinancialKnowledge,
  CommentHistory,
  SalesTarget,
} from "../types";

const DEMO_CURRENT_DATE = new Date("2025-07-01");

const defaultRoadmapYear1: RoadmapQuarter = {
  1: {
    title: "事業をスタートさせよう",
    advice: "個人事業主の届出や会社設立から始めよう",
    details: [
      "個人事業主の届出や会社設立の手続き",
      "「どんな商品・サービスを誰に売るか」を明確にする",
      "開業資金を準備する（自分のお金や借入）",
      "家計簿のような帳簿をつける仕組みを作る",
    ],
  },
  2: {
    title: "最初のお客様を見つけよう",
    advice: "実際に商品・サービスを売り始めよう",
    details: [
      "実際に商品・サービスを売り始める",
      "「いくら売れたか」を記録する",
      "毎月の売上と支出をチェックする習慣をつける",
      "確定申告の準備を始める",
    ],
  },
  3: {
    title: "売上を伸ばしていこう",
    advice: "お客様を増やす活動に力を入れよう",
    details: [
      "お客様を増やす活動に力を入れる",
      "「今月はいくら売りたいか」目標を決める",
      "お金の出入りを毎月チェックする",
      "税金の申告について勉強し始める",
    ],
  },
  4: {
    title: "1年目の成果を確認しよう",
    advice: "確定申告・決算を行おう",
    details: [
      "確定申告・決算を行う",
      "「1年間でいくら売れたか、いくら残ったか」を計算",
      "来年の目標を立てる",
      "貯金がどれくらい増えたかチェック",
    ],
  },
};

const defaultRoadmapYear2: RoadmapQuarter = {
  1: {
    title: "事業を安定させよう",
    advice: "既存のお客様との関係を大切にしよう",
    details: [
      "既存のお客様との関係を大切にする",
      "「来月はいくら売れそうか」予測の精度を上げる",
      "無駄な出費がないかチェックする",
      "人を雇うかどうか検討する",
    ],
  },
  2: {
    title: "事業を大きくする準備をしよう",
    advice: "スタッフを雇って教育しよう",
    details: [
      "スタッフを雇って教育する",
      "仕事の流れを整理して効率化する",
      "売上管理をもっと詳しくする",
      "3年後の目標を考える",
    ],
  },
  3: {
    title: "事業を広げよう",
    advice: "新しい商品・サービスを考えよう",
    details: [
      "新しい商品・サービスを考える",
      "営業活動を強化する",
      "「売上に対してどれくらい利益が出ているか」を改善",
      "設備投資を検討する",
    ],
  },
  4: {
    title: "経営の基盤を固めよう",
    advice: "2年目の決算・税務申告を行おう",
    details: [
      "2年目の決算・税務申告",
      "お金の流れをもっと詳しく分析",
      "来年の詳しい予算を作る",
      "個人の資産がどれくらい増えたかチェック",
    ],
  },
};

const generateDefaultRoadmap = (): RoadmapYear[] => {
  const roadmap: RoadmapYear[] = [];
  for (let i = 0; i < 11; i++) {
    const year = 2024 + i;
    if (year === 2024) {
      roadmap.push({ year, quarters: defaultRoadmapYear1 });
    } else if (year < 2034) {
      roadmap.push({ year, quarters: defaultRoadmapYear2 });
    } else {
      // 2034
      const goalAdvice: RoadmapAdvice = {
        title: "10年間のゴール",
        advice: "目標に向けて歩むあなたを、この場所で待っています。",
        details: [],
      };
      roadmap.push({
        year: 2034,
        quarters: {
          1: goalAdvice,
          2: goalAdvice,
          3: goalAdvice,
          4: goalAdvice,
        },
      });
    }
  }
  return roadmap;
};

const generateDefaultSalesTargets = (): SalesTarget[] => {
  return [
    { year: 2024, targetAmount: 8000000 },
    { year: 2025, targetAmount: 16000000 },
    { year: 2026, targetAmount: 24000000 },
    { year: 2027, targetAmount: 32000000 },
    { year: 2028, targetAmount: 40000000 },
    { year: 2029, targetAmount: 48000000 },
    { year: 2030, targetAmount: 56000000 },
    { year: 2031, targetAmount: 64000000 },
    { year: 2032, targetAmount: 72000000 },
    { year: 2033, targetAmount: 80000000 },
  ];
};

// デモ用のクライアントデータ
const DEMO_USERS: UserPerformanceData[] = [
  {
    userId: "user001",
    userName: "田中 太郎",
    email: "tanaka@example.com",
    companyName: "田中コンサルティング",
    role: "一般ユーザー",
    phoneNumber: "090-1234-5678",
    capital: 10000000,
    companySize: "法人（従業員6-20名）",
    industry: "IT・ソフトウェア",
    businessStartDate: "2023-04",
    financialKnowledge: "中級レベル",
    lastUpdated: "2025-07-05",
    fiscalYearEndMonth: 3, // 3月決算
    performance: {
      twoMonthsAgo: {
        sales: { target: 1000000, actual: 1050000, achievementRate: 105.0 },
        grossProfit: { target: 400000, actual: 420000, achievementRate: 105.0 },
        operatingProfit: {
          target: 200000,
          actual: 210000,
          achievementRate: 105.0,
        },
      },
      lastMonth: {
        sales: { target: 1000000, actual: 950000, achievementRate: 95.0 },
        grossProfit: { target: 400000, actual: 380000, achievementRate: 95.0 },
        operatingProfit: {
          target: 200000,
          actual: 190000,
          achievementRate: 95.0,
        },
      },
      currentMonth: {
        sales: { target: 1200000, actual: 800000, achievementRate: 66.7 },
        grossProfit: { target: 500000, actual: 320000, achievementRate: 64.0 },
        operatingProfit: {
          target: 250000,
          actual: 160000,
          achievementRate: 64.0,
        },
      },
      yoyCurrentMonth: {
        sales: 5.0,
        grossProfit: 2.0,
        operatingProfit: 1.5,
      },
      yoyLastMonth: {
        sales: 10.0,
        grossProfit: 8.0,
        operatingProfit: 5.0,
      },
      yoyTwoMonthsAgo: {
        sales: 12.0,
        grossProfit: 10.0,
        operatingProfit: 8.0,
      },
    },
    hasComment: true,
    comment:
      "7月は売上が目標を下回っていますが、6月は順調でした。夏季の集客アップと経費管理を見直し、秋に向けて準備を進めることをお勧めします。",
    commentDate: "2025-07-05",
    goodPoint: "6月の実績は目標を上回り、好調を維持しています。",
    cautionPoint: "夏季の集客減に備え、新たなキャンペーンを検討しましょう。",
    badPoint:
      "7月の売上が目標を大幅に下回っています。原因の特定と対策が急務です。",
    commentHistory: [
      {
        id: "comment001",
        comment:
          "年度始めとして順調なスタートです。今後も継続的な成長を目指していきましょう。",
        date: "2025-04-15",
        yearMonth: "2025-04",
      },
      {
        id: "comment002",
        comment:
          "5月は目標を上回る実績でした。この調子を維持しつつ、コスト管理にも注意を払ってください。",
        date: "2025-05-16",
        yearMonth: "2025-05",
      },
      {
        id: "comment003",
        comment:
          "6月の実績も好調を維持しています。夏季に向けてマーケティング強化を検討しましょう。",
        date: "2025-06-14",
        yearMonth: "2025-06",
      },
      {
        id: "comment004",
        comment:
          "7月は売上が目標を下回っていますが、6月は順調でした。夏季の集客アップと経費管理を見直し、秋に向けて準備を進めることをお勧めします。",
        date: "2025-07-05",
        yearMonth: "2025-07",
      },
    ],
    roadmap: generateDefaultRoadmap(),
    salesTargets: generateDefaultSalesTargets(),
    grossProfitMarginTarget: 40,
    operatingProfitMarginTarget: 20,
  },
  {
    userId: "user002",
    userName: "佐藤 花子",
    email: "sato@example.com",
    companyName: "佐藤デザイン事務所",
    role: "一般ユーザー",
    phoneNumber: "080-1111-2222",
    capital: 3000000,
    companySize: "法人（従業員1-5名）",
    industry: "IT・ソフトウェア",
    businessStartDate: "2024-01",
    financialKnowledge: "初心者",
    lastUpdated: "2025-07-04",
    fiscalYearEndMonth: 12, // 12月決算
    performance: {
      twoMonthsAgo: {
        sales: { target: 800000, actual: 820000, achievementRate: 102.5 },
        grossProfit: { target: 320000, actual: 330000, achievementRate: 103.1 },
        operatingProfit: {
          target: 160000,
          actual: 165000,
          achievementRate: 103.1,
        },
      },
      lastMonth: {
        sales: { target: 800000, actual: 920000, achievementRate: 115.0 },
        grossProfit: { target: 320000, actual: 380000, achievementRate: 118.8 },
        operatingProfit: {
          target: 160000,
          actual: 190000,
          achievementRate: 118.8,
        },
      },
      currentMonth: {
        sales: { target: 900000, actual: 750000, achievementRate: 83.3 },
        grossProfit: { target: 360000, actual: 300000, achievementRate: 83.3 },
        operatingProfit: {
          target: 180000,
          actual: 150000,
          achievementRate: 83.3,
        },
      },
      yoyCurrentMonth: {
        sales: -2.5,
        grossProfit: -3.0,
        operatingProfit: -3.5,
      },
      yoyLastMonth: {
        sales: 15.0,
        grossProfit: 18.0,
        operatingProfit: 20.0,
      },
      yoyTwoMonthsAgo: {
        sales: 2.5,
        grossProfit: 3.1,
        operatingProfit: 3.1,
      },
    },
    hasComment: true,
    comment:
      "6月は目標を大幅に上回る結果で素晴らしいです！7月も堅調に推移しています。創意工夫とクライアント満足度の維持を心がけてください。",
    commentDate: "2025-07-04",
    goodPoint:
      "新規クライアントからの評価が高く、リピート受注に繋がっています。",
    cautionPoint:
      "プロジェクトの納期管理に注意し、遅延が発生しないようにしましょう。",
    badPoint: "",
    commentHistory: [
      {
        id: "comment005",
        comment:
          "4月の実績は素晴らしいです。デザイン案件の品質が高いことが評価されています。",
        date: "2025-04-20",
        yearMonth: "2025-04",
      },
      {
        id: "comment006",
        comment:
          "6月は目標を大幅に上回る結果で素晴らしいです！7月も堅調に推移しています。創意工夫とクライアント満足度の維持を心がけてください。",
        date: "2025-07-04",
        yearMonth: "2025-07",
      },
    ],
    roadmap: generateDefaultRoadmap(),
    salesTargets: generateDefaultSalesTargets(),
    grossProfitMarginTarget: 40,
    operatingProfitMarginTarget: 20,
  },
  {
    userId: "user003",
    userName: "山田 一郎",
    email: "yamada@example.com",
    companyName: "山田商事",
    role: "一般ユーザー",
    phoneNumber: "",
    capital: 50000000,
    companySize: "法人（従業員21名以上）",
    industry: "IT・ソフトウェア",
    businessStartDate: "2020-06",
    financialKnowledge: "上級レベル",
    lastUpdated: "2025-07-03",
    fiscalYearEndMonth: 6, // 6月決算
    performance: {
      twoMonthsAgo: {
        sales: { target: 1400000, actual: 1300000, achievementRate: 92.9 },
        grossProfit: { target: 560000, actual: 520000, achievementRate: 92.9 },
        operatingProfit: {
          target: 280000,
          actual: 260000,
          achievementRate: 92.9,
        },
      },
      lastMonth: {
        sales: { target: 1500000, actual: 1350000, achievementRate: 90.0 },
        grossProfit: { target: 600000, actual: 540000, achievementRate: 90.0 },
        operatingProfit: {
          target: 300000,
          actual: 270000,
          achievementRate: 90.0,
        },
      },
      currentMonth: {
        sales: { target: 1600000, actual: 1200000, achievementRate: 75.0 },
        grossProfit: { target: 640000, actual: 480000, achievementRate: 75.0 },
        operatingProfit: {
          target: 320000,
          actual: 240000,
          achievementRate: 75.0,
        },
      },
      yoyCurrentMonth: {
        sales: -10.0,
        grossProfit: -12.0,
        operatingProfit: -15.0,
      },
      yoyLastMonth: {
        sales: -5.0,
        grossProfit: -8.0,
        operatingProfit: -10.0,
      },
      yoyTwoMonthsAgo: {
        sales: -7.1,
        grossProfit: -7.1,
        operatingProfit: -7.1,
      },
    },
    hasComment: true,
    comment:
      "夏の繁忙期に向けて準備を進めましょう。在庫管理と資金繰りに注意が必要です。",
    commentDate: "2025-05-10",
    goodPoint: "主要取引先との関係が良好で、安定した受注が見込めます。",
    cautionPoint:
      "原材料費の上昇が利益を圧迫する可能性があるため、代替案の検討が必要です。",
    badPoint: "",
    commentHistory: [
      {
        id: "comment007",
        comment:
          "夏の繁忙期に向けて準備を進めましょう。在庫管理と資金繰りに注意が必要です。",
        date: "2025-05-10",
        yearMonth: "2025-05",
      },
    ],
    roadmap: generateDefaultRoadmap(),
    salesTargets: generateDefaultSalesTargets(),
    grossProfitMarginTarget: 40,
    operatingProfitMarginTarget: 20,
  },
  {
    userId: "user004",
    userName: "鈴木 美咲",
    email: "suzuki@example.com",
    companyName: "鈴木マーケティング",
    role: "一般ユーザー",
    phoneNumber: "",
    capital: 5000000,
    companySize: "法人（従業員1-5名）",
    industry: "IT・ソフトウェア",
    businessStartDate: "2023-10",
    financialKnowledge: "初心者",
    lastUpdated: "2025-07-05",
    fiscalYearEndMonth: 9, // 9月決算
    performance: {
      twoMonthsAgo: {
        sales: { target: 500000, actual: 550000, achievementRate: 110.0 },
        grossProfit: { target: 200000, actual: 220000, achievementRate: 110.0 },
        operatingProfit: {
          target: 100000,
          actual: 110000,
          achievementRate: 110.0,
        },
      },
      lastMonth: {
        sales: { target: 600000, actual: 680000, achievementRate: 113.3 },
        grossProfit: { target: 240000, actual: 272000, achievementRate: 113.3 },
        operatingProfit: {
          target: 120000,
          actual: 136000,
          achievementRate: 113.3,
        },
      },
      currentMonth: {
        sales: { target: 700000, actual: 520000, achievementRate: 74.3 },
        grossProfit: { target: 280000, actual: 208000, achievementRate: 74.3 },
        operatingProfit: {
          target: 140000,
          actual: 104000,
          achievementRate: 74.3,
        },
      },
      yoyCurrentMonth: {
        sales: 20.0,
        grossProfit: 22.0,
        operatingProfit: 25.0,
      },
      yoyLastMonth: {
        sales: 13.3,
        grossProfit: 13.3,
        operatingProfit: 13.3,
      },
      yoyTwoMonthsAgo: {
        sales: 10.0,
        grossProfit: 10.0,
        operatingProfit: 10.0,
      },
    },
    hasComment: false,
    comment: "",
    commentDate: "",
    goodPoint: "",
    cautionPoint: "",
    badPoint: "",
    commentHistory: [],
    roadmap: generateDefaultRoadmap(),
    salesTargets: generateDefaultSalesTargets(),
    grossProfitMarginTarget: 40,
    operatingProfitMarginTarget: 20,
  },
  {
    userId: "user005",
    userName: "高橋 健太",
    email: "takahashi@example.com",
    companyName: "高橋IT開発",
    role: "一般ユーザー",
    phoneNumber: "",
    capital: 20000000,
    companySize: "法人（従業員6-20名）",
    industry: "IT・ソフトウェア",
    businessStartDate: "2021-02",
    financialKnowledge: "中級レベル",
    lastUpdated: "2025-07-02",
    fiscalYearEndMonth: 12, // 12月決算
    performance: {
      twoMonthsAgo: {
        sales: { target: 1800000, actual: 1900000, achievementRate: 105.6 },
        grossProfit: { target: 720000, actual: 760000, achievementRate: 105.6 },
        operatingProfit: {
          target: 360000,
          actual: 380000,
          achievementRate: 105.6,
        },
      },
      lastMonth: {
        sales: { target: 2000000, actual: 2200000, achievementRate: 110.0 },
        grossProfit: { target: 800000, actual: 880000, achievementRate: 110.0 },
        operatingProfit: {
          target: 400000,
          actual: 440000,
          achievementRate: 110.0,
        },
      },
      currentMonth: {
        sales: { target: 2100000, actual: 1800000, achievementRate: 85.7 },
        grossProfit: { target: 840000, actual: 720000, achievementRate: 85.7 },
        operatingProfit: {
          target: 420000,
          actual: 360000,
          achievementRate: 85.7,
        },
      },
      yoyCurrentMonth: {
        sales: 8.7,
        grossProfit: 8.7,
        operatingProfit: 8.7,
      },
      yoyLastMonth: {
        sales: 10.0,
        grossProfit: 10.0,
        operatingProfit: 10.0,
      },
      yoyTwoMonthsAgo: {
        sales: 5.6,
        grossProfit: 5.6,
        operatingProfit: 5.6,
      },
    },
    hasComment: true,
    comment:
      "IT開発案件の受注が好調です。技術者のスキルアップと品質管理を継続していきましょう。",
    commentDate: "2025-07-02",
    goodPoint: "大規模案件の受注に成功し、売上が大幅に増加しました。",
    cautionPoint:
      "人材不足がボトルネックになる可能性があります。採用計画を前倒しで進めましょう。",
    badPoint: "",
    commentHistory: [
      {
        id: "comment009",
        comment:
          "新技術への投資が売上増につながっています。継続的な学習を推奨します。",
        date: "2025-05-20",
        yearMonth: "2025-05",
      },
      {
        id: "comment010",
        comment:
          "IT開発案件の受注が好調です。技術者のスキルアップと品質管理を継続していきましょう。",
        date: "2025-07-02",
        yearMonth: "2025-07",
      },
    ],
    roadmap: generateDefaultRoadmap(),
    salesTargets: generateDefaultSalesTargets(),
    grossProfitMarginTarget: 40,
    operatingProfitMarginTarget: 20,
  },
];

interface SalesTargetEditorProps {
  targets: SalesTarget[];
  onChange: (year: number, newTarget: number) => void;
  grossProfitMarginTarget: number;
  operatingProfitMarginTarget: number;
  onProfitMarginChange: (type: "gross" | "operating", value: number) => void;
}

const SalesTargetEditor: React.FC<SalesTargetEditorProps> = ({
  targets,
  onChange,
  grossProfitMarginTarget,
  operatingProfitMarginTarget,
  onProfitMarginChange,
}) => {
  const [editingCell, setEditingCell] = useState<{
    year: number;
    value: string;
  } | null>(null);

  const handleDoubleClick = (year: number, amount: number) => {
    setEditingCell({ year, value: String(amount) });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingCell) {
      setEditingCell({ ...editingCell, value: e.target.value });
    }
  };

  const handleInputBlur = () => {
    if (editingCell) {
      const newTarget = parseInt(editingCell.value.replace(/,/g, ""), 10);
      if (!isNaN(newTarget)) {
        onChange(editingCell.year, newTarget);
      }
      setEditingCell(null);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
    if (e.key === "Escape") {
      setEditingCell(null);
    }
  };

  const renderTableRows = (start: number, end: number) => {
    return (
      <React.Fragment>
        <tr>
          {targets.slice(start, end).map((target, index) => (
            <td
              key={target.year}
              className="p-2 border text-center bg-gray-100 font-medium"
            >
              {start + index + 1}年目 ({target.year}年度)
            </td>
          ))}
        </tr>
        <tr>
          {targets.slice(start, end).map((target) => (
            <td
              key={target.year}
              className="p-2 border text-center"
              onDoubleClick={() =>
                handleDoubleClick(target.year, target.targetAmount)
              }
            >
              {editingCell?.year === target.year ? (
                <input
                  type="text"
                  value={editingCell.value}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  onKeyDown={handleInputKeyDown}
                  className="w-full text-center p-1 border rounded"
                  autoFocus
                />
              ) : (
                new Intl.NumberFormat("ja-JP").format(target.targetAmount)
              )}
            </td>
          ))}
        </tr>
      </React.Fragment>
    );
  };

  return (
    <div className="overflow-x-auto">
      <h3 className="text-lg font-semibold text-text flex items-center space-x-2">
        <span>年間売上目標</span>
      </h3>
      <table className="w-full border-collapse">
        <tbody>
          {renderTableRows(0, 5)}
          {renderTableRows(5, 10)}
        </tbody>
      </table>
      <div className="flex flex-col gap-4 grid grid-cols-2 mt-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-text flex items-center space-x-2">
            <span>粗利益率目標(%)</span>
          </h3>
          <input
            type="number"
            value={grossProfitMarginTarget}
            onChange={(e) =>
              onProfitMarginChange("gross", Number(e.target.value))
            }
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-text flex items-center space-x-2">
            <span>営業利益率目標(%)</span>
          </h3>
          <input
            type="number"
            value={operatingProfitMarginTarget}
            onChange={(e) =>
              onProfitMarginChange("operating", Number(e.target.value))
            }
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

const ClientManagement: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<UserPerformanceData | null>(
    null
  );
  const [users, setUsers] = useState<UserPerformanceData[]>(DEMO_USERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("name_asc");
  const [currentComment, setCurrentComment] = useState("");
  const [goodPoint, setGoodPoint] = useState("");
  const [cautionPoint, setCautionPoint] = useState("");
  const [badPoint, setBadPoint] = useState("");
  const [isCommentSaving, setIsCommentSaving] = useState(false);
  const [showCommentHistory, setShowCommentHistory] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState<
    Partial<UserPerformanceData> & {
      password?: string;
      businessStartYear?: string;
      businessStartMonth?: string;
    }
  >({
    role: "一般ユーザー",
    companyName: "",
    userName: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const companySizeOptions: CompanySize[] = [
    "個人事業主",
    "法人（従業員1-5名）",
    "法人（従業員6-20名）",
    "法人（従業員21名以上）",
  ];

  const industryOptions: Industry[] = [
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

  const financialKnowledgeOptions: FinancialKnowledge[] = [
    "初心者",
    "基本レベル",
    "中級レベル",
    "上級レベル",
  ];

  const currentYear = DEMO_CURRENT_DATE.getFullYear();
  const currentMonth = DEMO_CURRENT_DATE.getMonth() + 1;

  useEffect(() => {
    // 年月が変更されたときに、選択された年月が未来にならないように調整
    if (
      newUser.businessStartYear &&
      newUser.businessStartMonth &&
      Number(newUser.businessStartYear) === currentYear &&
      Number(newUser.businessStartMonth) > currentMonth
    ) {
      setNewUser((prev) => ({
        ...prev,
        businessStartMonth: String(currentMonth).padStart(2, "0"),
      }));
    }
  }, [
    newUser.businessStartYear,
    newUser.businessStartMonth,
    currentYear,
    currentMonth,
  ]);

  useEffect(() => {
    // デモ用のローディングシミュレーション
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1秒後にローディングを終了

    return () => clearTimeout(timer); // クリーンアップ関数
  }, []); // 空の依存配列でコンポーネントマウント時に一度だけ実行

  const [editableRoadmap, setEditableRoadmap] = useState<RoadmapYear[]>([]);
  const [openYear, setOpenYear] = useState<number | null>(null);
  const [editableSalesTargets, setEditableSalesTargets] = useState<
    SalesTarget[]
  >([]);
  const [isSalesTargetModified, setIsSalesTargetModified] =
    useState<boolean>(false);

  // selectedUser が変更されたときにロードマップ編集用のstateを更新
  useEffect(() => {
    if (selectedUser) {
      setEditableRoadmap(selectedUser.roadmap);
      setEditableSalesTargets(selectedUser.salesTargets || []);
      setIsSalesTargetModified(false);
    } else {
      setEditableRoadmap([]);
      setEditableSalesTargets([]);
    }
    setOpenYear(null); // ユーザー切り替え時にアコーディオンを閉じる
  }, [selectedUser]);

  const getCardBorderClass = (user: UserPerformanceData) => {
    if (!user.hasComment || !user.commentDate) {
      return "";
    }

    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    oneMonthAgo.setHours(0, 0, 0, 0);

    const commentDate = new Date(user.commentDate);
    commentDate.setHours(0, 0, 0, 0);

    if (commentDate < oneMonthAgo) {
      return "border-l-4 border-l-red-500";
    }

    return "border-l-4 border-l-green-500";
  };

  // フィルタリングとソート
  const filteredAndSortedUsers = users
    .filter(
      (user) =>
        user.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.companyName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOrder) {
        case "date_asc": {
          const aDate = a.commentDate
            ? new Date(a.commentDate).getTime()
            : Infinity;
          const bDate = b.commentDate
            ? new Date(b.commentDate).getTime()
            : Infinity;
          if (aDate === bDate) {
            return a.userName.localeCompare(b.userName);
          }
          return aDate - bDate;
        }
        case "date_desc": {
          const aDate = a.commentDate
            ? new Date(a.commentDate).getTime()
            : -Infinity;
          const bDate = b.commentDate
            ? new Date(b.commentDate).getTime()
            : -Infinity;
          if (aDate === bDate) {
            return a.userName.localeCompare(b.userName);
          }
          return bDate - aDate;
        }
        case "name_asc":
        default:
          return a.userName.localeCompare(b.userName);
      }
    });

  const formatCurrency = (amount: number) => {
    return (amount / 10000).toFixed(0) + "万円";
  };

  const formatPercentage = (rate: number) => {
    return rate.toFixed(1) + "%";
  };

  const getPerformanceColor = (rate: number) => {
    if (rate >= 100) return "text-green-600";
    if (rate >= 80) return "text-yellow-600";
    return "text-red-600";
  };

  const getPerformanceBgColor = (rate: number) => {
    if (rate >= 100) return "bg-green-50 border-green-200";
    if (rate >= 80) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  // コメント保存関数（デモ版）
  const handleSaveComment = async () => {
    if (!selectedUser) return;
    if (
      !currentComment.trim() &&
      !goodPoint.trim() &&
      !cautionPoint.trim() &&
      !badPoint.trim()
    )
      return;

    setIsCommentSaving(true);

    try {
      // デモ用の遅延
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const currentDateStr = new Date().toISOString().split("T")[0];
      const currentYearMonth = currentDateStr.substring(0, 7); // YYYY-MM形式

      const updatedUsers = users.map((user) => {
        if (user.userId === selectedUser.userId) {
          const newHistoryEntry: CommentHistory | null = currentComment.trim()
            ? {
                id: `comment_${Date.now()}`,
                comment: currentComment.trim(),
                date: currentDateStr,
                yearMonth: currentYearMonth,
              }
            : null;

          const newCommentHistory = newHistoryEntry
            ? [...user.commentHistory, newHistoryEntry]
            : user.commentHistory;

          const hasNewMainComment = !!currentComment.trim();

          return {
            ...user,
            hasComment: user.hasComment || hasNewMainComment,
            comment: hasNewMainComment ? currentComment.trim() : user.comment,
            commentDate: hasNewMainComment ? currentDateStr : user.commentDate,
            goodPoint: goodPoint.trim(),
            cautionPoint: cautionPoint.trim(),
            badPoint: badPoint.trim(),
            commentHistory: newCommentHistory,
          };
        }
        return user;
      });

      setUsers(updatedUsers);

      // 選択中のユーザーも更新
      const updatedSelectedUser = updatedUsers.find(
        (user) => user.userId === selectedUser.userId
      );
      if (updatedSelectedUser) {
        setSelectedUser(updatedSelectedUser);
        setGoodPoint(updatedSelectedUser.goodPoint || "");
        setCautionPoint(updatedSelectedUser.cautionPoint || "");
        setBadPoint(updatedSelectedUser.badPoint || "");
      }

      setCurrentComment("");
      // 下書きがあれば削除
      localStorage.removeItem(`comment_draft_${selectedUser.userId}`);

      alert("アドバイスを保存しました (デモモード)");
    } catch (err) {
      console.error("デモコメント保存エラー:", err);
      alert("コメントの保存中にエラーが発生しました");
    } finally {
      setIsCommentSaving(false);
    }
  };

  const openAddUserModal = () => {
    setNewUser({
      role: "一般ユーザー",
      companyName: "",
      userName: "",
      email: "",
      password: "",
    });
    setErrors({});
    setIsAddUserModalOpen(true);
  };

  const closeAddUserModal = () => {
    setIsAddUserModalOpen(false);
  };

  const handleNewUserChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateNewUserForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!newUser.userName) newErrors.userName = "ユーザー名は必須です。";
    if (!newUser.companyName) newErrors.companyName = "会社名は必須です。";
    if (!newUser.email) {
      newErrors.email = "メールアドレスは必須です。";
    } else if (newUser.email.includes("@")) {
      newErrors.email = "メールアドレスに「@」は含めないでください。";
    }
    if (!newUser.password || newUser.password.length < 8) {
      newErrors.password = "パスワードは8文字以上で入力してください。";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddNewUser = () => {
    if (!validateNewUserForm()) return;

    const businessStartDate =
      newUser.businessStartYear && newUser.businessStartMonth
        ? `${newUser.businessStartYear}-${newUser.businessStartMonth.padStart(
            2,
            "0"
          )}`
        : "";

    const newUserPayload = { ...newUser };
    delete (newUserPayload as any).businessStartYear;
    delete (newUserPayload as any).businessStartMonth;

    const newUserWithDefaults: UserPerformanceData = {
      userId: `user_${Date.now()}`,
      lastUpdated: DEMO_CURRENT_DATE.toISOString().split("T")[0],
      performance: {
        currentMonth: {
          sales: { target: 0, actual: 0, achievementRate: 0 },
          grossProfit: { target: 0, actual: 0, achievementRate: 0 },
          operatingProfit: { target: 0, actual: 0, achievementRate: 0 },
        },
        lastMonth: {
          sales: { target: 0, actual: 0, achievementRate: 0 },
          grossProfit: { target: 0, actual: 0, achievementRate: 0 },
          operatingProfit: { target: 0, actual: 0, achievementRate: 0 },
        },
        twoMonthsAgo: {
          sales: { target: 0, actual: 0, achievementRate: 0 },
          grossProfit: { target: 0, actual: 0, achievementRate: 0 },
          operatingProfit: { target: 0, actual: 0, achievementRate: 0 },
        },
      },
      hasComment: false,
      comment: "",
      commentDate: "",
      commentHistory: [],
      roadmap: generateDefaultRoadmap(),
      fiscalYearEndMonth: 12, // デフォルト
      ...newUserPayload,
      businessStartDate,
      role: "一般ユーザー",
      salesTargets: generateDefaultSalesTargets(),
      grossProfitMarginTarget: 40,
      operatingProfitMarginTarget: 20,
    } as UserPerformanceData;

    setUsers((prev) => [...prev, newUserWithDefaults]);
    closeAddUserModal();
  };

  // コメント下書き保存関数
  const handleSaveDraft = () => {
    if (!selectedUser) return;
    const draftData = {
      comment: currentComment,
      goodPoint,
      cautionPoint,
      badPoint,
    };

    if (!Object.values(draftData).some((val) => val.trim())) return;

    localStorage.setItem(
      `comment_draft_${selectedUser.userId}`,
      JSON.stringify(draftData)
    );
    if (window.confirm("下書きを保存しました。ユーザー一覧に戻りますか？")) {
      setSelectedUser(null);
    }
  };

  // ユーザー選択時にコメントを読み込む
  const handleUserSelect = (user: UserPerformanceData) => {
    setSelectedUser(user);
    // 下書きがあれば読み込む
    const draft = localStorage.getItem(`comment_draft_${user.userId}`);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setCurrentComment(parsed.comment || "");
        setGoodPoint(parsed.goodPoint || user.goodPoint || "");
        setCautionPoint(parsed.cautionPoint || user.cautionPoint || "");
        setBadPoint(parsed.badPoint || user.badPoint || "");
      } catch (e) {
        // 古い形式の下書き（文字列のみ）との互換性のため
        setCurrentComment(draft);
        setGoodPoint(user.goodPoint || "");
        setCautionPoint(user.cautionPoint || "");
        setBadPoint(user.badPoint || "");
      }
    } else {
      setCurrentComment("");
      setGoodPoint(user.goodPoint || "");
      setCautionPoint(user.cautionPoint || "");
      setBadPoint(user.badPoint || "");
    }
  };

  // 年のリストを取得
  const getAvailableYears = () => {
    if (!selectedUser) return [];

    const years = selectedUser.commentHistory.map(
      (comment) => comment.yearMonth.split("-")[0]
    );
    const uniqueYears = [...new Set(years)].sort().reverse();

    return uniqueYears;
  };

  // 月のリストを取得（選択された年に応じて）
  const getAvailableMonths = (year: string) => {
    if (!selectedUser || !year) return [];

    const months = selectedUser.commentHistory
      .filter((comment) => comment.yearMonth.startsWith(year))
      .map((comment) => comment.yearMonth.split("-")[1]);
    const uniqueMonths = [...new Set(months)].sort();

    return uniqueMonths;
  };

  // フィルタリングされた履歴を取得
  const getFilteredHistory = () => {
    if (!selectedUser) return [];

    let filteredHistory = [...selectedUser.commentHistory];

    if (selectedYear && selectedMonth) {
      const targetYearMonth = `${selectedYear}-${selectedMonth}`;
      filteredHistory = filteredHistory.filter(
        (comment) => comment.yearMonth === targetYearMonth
      );
    } else if (selectedYear) {
      filteredHistory = filteredHistory.filter((comment) =>
        comment.yearMonth.startsWith(selectedYear)
      );
    }

    return filteredHistory.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  // 月名を日本語に変換
  const getMonthName = (month: string) => {
    const monthNames = {
      "01": "1月",
      "02": "2月",
      "03": "3月",
      "04": "4月",
      "05": "5月",
      "06": "6月",
      "07": "7月",
      "08": "8月",
      "09": "9月",
      "10": "10月",
      "11": "11月",
      "12": "12月",
    };
    return monthNames[month as keyof typeof monthNames] || month;
  };

  const handleRoadmapChange = (
    year: number,
    quarter: number,
    field: "title" | "advice",
    value: string
  ) => {
    setEditableRoadmap((prev) =>
      prev.map((y) => {
        if (y.year === year) {
          const newQuarters = { ...y.quarters };
          newQuarters[quarter] = {
            ...newQuarters[quarter],
            [field]: value,
          };
          return { ...y, quarters: newQuarters };
        }
        return y;
      })
    );
  };

  const handleDetailChange = (
    year: number,
    quarter: number,
    detailIndex: number,
    value: string
  ) => {
    setEditableRoadmap((prev) =>
      prev.map((y) => {
        if (y.year === year) {
          const newQuarters = { ...y.quarters };
          const newDetails = [...newQuarters[quarter].details];
          newDetails[detailIndex] = value;
          newQuarters[quarter] = {
            ...newQuarters[quarter],
            details: newDetails,
          };
          return { ...y, quarters: newQuarters };
        }
        return y;
      })
    );
  };

  const handleSaveRoadmap = () => {
    if (!selectedUser) return; // ユーザーが選択されていない場合は何もしない

    const updatedUsers = users.map((user) =>
      user.userId === selectedUser.userId
        ? { ...user, roadmap: editableRoadmap }
        : user
    );
    setUsers(updatedUsers);

    const updatedSelectedUser = updatedUsers.find(
      (user) => user.userId === selectedUser.userId
    );
    if (updatedSelectedUser) {
      setSelectedUser(updatedSelectedUser);
    }
    alert("ナビゲーションを保存しました (デモモード)");
  };

  const handleSalesTargetChange = (year: number, newTarget: number) => {
    setEditableSalesTargets((prev) =>
      prev.map((target) =>
        target.year === year ? { ...target, targetAmount: newTarget } : target
      )
    );
    setIsSalesTargetModified(true);
  };

  const handleProfitMarginChange = (
    type: "gross" | "operating",
    value: number
  ) => {
    if (!selectedUser) return;
    const key =
      type === "gross"
        ? "grossProfitMarginTarget"
        : "operatingProfitMarginTarget";
    setSelectedUser((prev) => (prev ? { ...prev, [key]: value } : null));
    setEditableSalesTargets((prev) => [...prev]); // HACK: to trigger re-render and show save button
    setIsSalesTargetModified(true);
  };

  const handleSaveSalesTargets = () => {
    if (!selectedUser) return;
    const updatedUsers = users.map((user) =>
      user.userId === selectedUser.userId
        ? {
            ...user,
            salesTargets: editableSalesTargets,
            grossProfitMarginTarget: selectedUser.grossProfitMarginTarget,
            operatingProfitMarginTarget:
              selectedUser.operatingProfitMarginTarget,
          }
        : user
    );
    setUsers(updatedUsers);
    const updatedSelectedUser = updatedUsers.find(
      (u) => u.userId === selectedUser.userId
    );
    if (updatedSelectedUser) {
      setSelectedUser(updatedSelectedUser);
    }
    setIsSalesTargetModified(false);
    alert("売上目標を保存しました (デモモード)");
  };

  // ユーザー詳細画面
  if (selectedUser) {
    const currentDate = DEMO_CURRENT_DATE; // デモデータに基づいた現在日付
    const formatYearMonth = (date: Date) => {
      return `${date.getFullYear()}年${date.getMonth() + 1}月`;
    };

    const currentMonthDate = currentDate;
    const lastMonthDate = new Date(currentDate);
    lastMonthDate.setMonth(currentDate.getMonth() - 1);
    const twoMonthsAgoDate = new Date(currentDate);
    twoMonthsAgoDate.setMonth(currentDate.getMonth() - 2);

    return (
      <div className="space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedUser(null)}
              className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>ユーザー一覧に戻る</span>
            </button>
          </div>
        </div>

        {/* ユーザー情報 */}
        <div className="card">
          <div className="flex items-center space-x-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <User className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-text">
                {selectedUser.userName}
              </h2>
              <p className="text-text/70">{selectedUser.email}</p>
              <p className="text-text/70">{selectedUser.companyName}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-text/70 mb-1">事業開始年月</div>
              <div className="text-lg font-semibold text-primary">
                {selectedUser.businessStartDate
                  ? `${selectedUser.businessStartDate.split("-")[0]}年${
                      selectedUser.businessStartDate.split("-")[1]
                    }月`
                  : "未設定"}
              </div>
            </div>
          </div>
        </div>

        {/* 予実管理状況 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 先々月実績 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-text mb-4 flex items-center space-x-2">
              <span>{`${formatYearMonth(twoMonthsAgoDate)}実績`}</span>
            </h3>
            <div className="space-y-3">
              {/* 売上 */}
              <div
                className={`p-3 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.performance.twoMonthsAgo.sales.achievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">売上</span>
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.twoMonthsAgo.sales.target
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.twoMonthsAgo.sales.actual
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.performance.twoMonthsAgo.sales
                          .achievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.performance.twoMonthsAgo.sales
                          .achievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 粗利益 */}
              <div
                className={`p-3 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.performance.twoMonthsAgo.grossProfit
                    .achievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">
                    粗利益
                  </span>
                  <Target className="h-4 w-4 text-success" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.twoMonthsAgo.grossProfit.target
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.twoMonthsAgo.grossProfit.actual
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.performance.twoMonthsAgo.grossProfit
                          .achievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.performance.twoMonthsAgo.grossProfit
                          .achievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 営業利益 */}
              <div
                className={`p-3 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.performance.twoMonthsAgo.operatingProfit
                    .achievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">
                    営業利益
                  </span>
                  <Target className="h-4 w-4 text-info" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.twoMonthsAgo.operatingProfit
                          .target
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.twoMonthsAgo.operatingProfit
                          .actual
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.performance.twoMonthsAgo.operatingProfit
                          .achievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.performance.twoMonthsAgo.operatingProfit
                          .achievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 先月実績 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-text mb-4 flex items-center space-x-2">
              <span>{`${formatYearMonth(lastMonthDate)}実績`}</span>
            </h3>

            <div className="space-y-3">
              {/* 売上 */}
              <div
                className={`p-3 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.performance.lastMonth.sales.achievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">売上</span>
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.lastMonth.sales.target
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.lastMonth.sales.actual
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.performance.lastMonth.sales.achievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.performance.lastMonth.sales.achievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 粗利益 */}
              <div
                className={`p-3 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.performance.lastMonth.grossProfit.achievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">
                    粗利益
                  </span>
                  <Target className="h-4 w-4 text-success" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.lastMonth.grossProfit.target
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.lastMonth.grossProfit.actual
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.performance.lastMonth.grossProfit
                          .achievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.performance.lastMonth.grossProfit
                          .achievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 営業利益 */}
              <div
                className={`p-3 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.performance.lastMonth.operatingProfit
                    .achievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">
                    営業利益
                  </span>
                  <Target className="h-4 w-4 text-info" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.lastMonth.operatingProfit
                          .target
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.lastMonth.operatingProfit
                          .actual
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.performance.lastMonth.operatingProfit
                          .achievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.performance.lastMonth.operatingProfit
                          .achievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 今月実績 */}
          <div className="card">
            <h3 className="text-lg font-semibold text-text mb-4 flex items-center space-x-2">
              <span>{`${formatYearMonth(currentMonthDate)}実績`}</span>
            </h3>

            <div className="space-y-3">
              {/* 売上 */}
              <div
                className={`p-3 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.performance.currentMonth.sales.achievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">売上</span>
                  <DollarSign className="h-4 w-4 text-primary" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.currentMonth.sales.target
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.currentMonth.sales.actual
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.performance.currentMonth.sales
                          .achievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.performance.currentMonth.sales
                          .achievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 粗利益 */}
              <div
                className={`p-3 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.performance.currentMonth.grossProfit
                    .achievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">
                    粗利益
                  </span>
                  <Target className="h-4 w-4 text-success" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.currentMonth.grossProfit.target
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.currentMonth.grossProfit.actual
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.performance.currentMonth.grossProfit
                          .achievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.performance.currentMonth.grossProfit
                          .achievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* 営業利益 */}
              <div
                className={`p-3 rounded-lg border ${getPerformanceBgColor(
                  selectedUser.performance.currentMonth.operatingProfit
                    .achievementRate
                )}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text/70">
                    営業利益
                  </span>
                  <Target className="h-4 w-4 text-info" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-text/60">目標</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.currentMonth.operatingProfit
                          .target
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">実績</p>
                    <p className="font-semibold">
                      {formatCurrency(
                        selectedUser.performance.currentMonth.operatingProfit
                          .actual
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-text/60">達成率</p>
                    <p
                      className={`font-bold ${getPerformanceColor(
                        selectedUser.performance.currentMonth.operatingProfit
                          .achievementRate
                      )}`}
                    >
                      {formatPercentage(
                        selectedUser.performance.currentMonth.operatingProfit
                          .achievementRate
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 前年同月比 */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4 flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>前年同月比</span>
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 font-medium text-text/70">年月</th>
                  <th className="p-3 font-medium text-text/70">売上</th>
                  <th className="p-3 font-medium text-text/70">粗利益</th>
                  <th className="p-3 font-medium text-text/70">営業利益</th>
                </tr>
              </thead>
              <tbody>
                {selectedUser.performance.yoyCurrentMonth && (
                  <tr className="border-b">
                    <td className="p-3 font-medium">
                      {formatYearMonth(currentMonthDate)}
                    </td>
                    <td
                      className={`p-3 font-semibold ${
                        selectedUser.performance.yoyCurrentMonth.sales >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedUser.performance.yoyCurrentMonth.sales.toFixed(
                        1
                      )}
                      %
                    </td>
                    <td
                      className={`p-3 font-semibold ${
                        selectedUser.performance.yoyCurrentMonth.grossProfit >=
                        0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedUser.performance.yoyCurrentMonth.grossProfit.toFixed(
                        1
                      )}
                      %
                    </td>
                    <td
                      className={`p-3 font-semibold ${
                        selectedUser.performance.yoyCurrentMonth
                          .operatingProfit >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedUser.performance.yoyCurrentMonth.operatingProfit.toFixed(
                        1
                      )}
                      %
                    </td>
                  </tr>
                )}
                {selectedUser.performance.yoyLastMonth && (
                  <tr className="border-b">
                    <td className="p-3 font-medium">
                      {formatYearMonth(lastMonthDate)}
                    </td>
                    <td
                      className={`p-3 font-semibold ${
                        selectedUser.performance.yoyLastMonth.sales >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedUser.performance.yoyLastMonth.sales.toFixed(1)}%
                    </td>
                    <td
                      className={`p-3 font-semibold ${
                        selectedUser.performance.yoyLastMonth.grossProfit >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedUser.performance.yoyLastMonth.grossProfit.toFixed(
                        1
                      )}
                      %
                    </td>
                    <td
                      className={`p-3 font-semibold ${
                        selectedUser.performance.yoyLastMonth.operatingProfit >=
                        0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedUser.performance.yoyLastMonth.operatingProfit.toFixed(
                        1
                      )}
                      %
                    </td>
                  </tr>
                )}
                {selectedUser.performance.yoyTwoMonthsAgo && (
                  <tr className="border-b">
                    <td className="p-3 font-medium">
                      {formatYearMonth(twoMonthsAgoDate)}
                    </td>
                    <td
                      className={`p-3 font-semibold ${
                        selectedUser.performance.yoyTwoMonthsAgo.sales >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedUser.performance.yoyTwoMonthsAgo.sales.toFixed(
                        1
                      )}
                      %
                    </td>
                    <td
                      className={`p-3 font-semibold ${
                        selectedUser.performance.yoyTwoMonthsAgo.grossProfit >=
                        0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedUser.performance.yoyTwoMonthsAgo.grossProfit.toFixed(
                        1
                      )}
                      %
                    </td>
                    <td
                      className={`p-3 font-semibold ${
                        selectedUser.performance.yoyTwoMonthsAgo
                          .operatingProfit >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedUser.performance.yoyTwoMonthsAgo.operatingProfit.toFixed(
                        1
                      )}
                      %
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 既存コメント表示 */}
        {selectedUser.hasComment && (
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-center space-x-2 mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-text">
                最新のアドバイス
              </h3>
              <span className="text-sm text-text/70">
                {selectedUser.commentDate.includes("T")
                  ? selectedUser.commentDate.replace("T", " ").split(".")[0]
                  : selectedUser.commentDate}
              </span>
            </div>
            <div className="p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-text whitespace-pre-wrap">
                {selectedUser.comment}
              </p>
            </div>
          </div>
        )}

        {/* アドバイス履歴セクション */}
        {selectedUser.commentHistory.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text flex items-center space-x-2">
                <History className="h-5 w-5 text-primary" />
                <span>アドバイス履歴</span>
                <span className="text-sm text-text/70">
                  （{selectedUser.commentHistory.length}件）
                </span>
              </h3>
              <button
                onClick={() => setShowCommentHistory(!showCommentHistory)}
                className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
              >
                <span>
                  {showCommentHistory ? "履歴を閉じる" : "履歴を表示"}
                </span>
                {showCommentHistory ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            </div>

            {showCommentHistory && (
              <div className="space-y-4">
                {/* フィルター */}
                <div className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-text/70 mb-1">
                      年で絞り込み
                    </label>
                    <select
                      value={selectedYear}
                      onChange={(e) => {
                        setSelectedYear(e.target.value);
                        setSelectedMonth(""); // 年が変わったら月をリセット
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">すべての年</option>
                      {getAvailableYears().map((year) => (
                        <option key={year} value={year}>
                          {year}年
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-text/70 mb-1">
                      月で絞り込み
                    </label>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      disabled={!selectedYear}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="">すべての月</option>
                      {getAvailableMonths(selectedYear).map((month) => (
                        <option key={month} value={month}>
                          {getMonthName(month)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {(selectedYear || selectedMonth) && (
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setSelectedYear("");
                          setSelectedMonth("");
                        }}
                        className="px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        フィルタークリア
                      </button>
                    </div>
                  )}
                </div>

                {/* 履歴一覧 */}
                <div className="space-y-3">
                  {getFilteredHistory().map((historyItem) => (
                    <div
                      key={historyItem.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-primary" />
                          <span className="font-medium text-text">
                            {historyItem.yearMonth.split("-")[0]}年
                            {getMonthName(historyItem.yearMonth.split("-")[1])}
                          </span>
                        </div>
                        <span className="text-sm text-text/70">
                          {historyItem.date.includes("T")
                            ? historyItem.date.replace("T", " ").split(".")[0]
                            : historyItem.date}
                        </span>
                      </div>
                      <div className="p-3 bg-white rounded border">
                        <p className="text-text whitespace-pre-wrap">
                          {historyItem.comment}
                        </p>
                      </div>
                    </div>
                  ))}

                  {getFilteredHistory().length === 0 && (
                    <div className="text-center py-8">
                      <History className="h-8 w-8 text-text/30 mx-auto mb-2" />
                      <p className="text-text/70">
                        {selectedYear || selectedMonth
                          ? "選択された期間にアドバイスはありません"
                          : "アドバイス履歴がありません"}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* アドバイス入力エリア */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4">
            アドバイス入力
          </h3>

          {/* アドバイスサマリー */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
            <div className="p-4 rounded-lg border-green-200 bg-green-50">
              <h4 className="font-bold text-green-800 mb-2 flex items-center">
                ◎ 良かった点
              </h4>
              <textarea
                className={`w-full p-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-y ${
                  goodPoint !== (selectedUser.goodPoint || "")
                    ? "bg-yellow-100"
                    : ""
                }`}
                rows={4}
                placeholder="良かった点を入力..."
                value={goodPoint}
                onChange={(e) => setGoodPoint(e.target.value)}
                maxLength={500}
              />
              <div className="text-right text-sm text-text/70 mt-1">
                {goodPoint.length}/500文字
              </div>
            </div>
            <div className="p-4 rounded-lg border-yellow-200 bg-yellow-50">
              <h4 className="font-bold text-yellow-800 mb-2 flex items-center">
                △ 注意点
              </h4>
              <textarea
                className={`w-full p-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-y ${
                  cautionPoint !== (selectedUser.cautionPoint || "")
                    ? "bg-yellow-100"
                    : ""
                }`}
                rows={4}
                placeholder="注意点を入力..."
                value={cautionPoint}
                onChange={(e) => setCautionPoint(e.target.value)}
                maxLength={500}
              />
              <div className="text-right text-sm text-text/70 mt-1">
                {cautionPoint.length}/500文字
              </div>
            </div>
            <div className="p-4 rounded-lg border-red-200 bg-red-50">
              <h4 className="font-bold text-red-800 mb-2 flex items-center">
                × 悪かった点
              </h4>
              <textarea
                className={`w-full p-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-y ${
                  badPoint !== (selectedUser.badPoint || "")
                    ? "bg-yellow-100"
                    : ""
                }`}
                rows={4}
                placeholder="悪かった点を入力..."
                value={badPoint}
                onChange={(e) => setBadPoint(e.target.value)}
                maxLength={500}
              />
              <div className="text-right text-sm text-text/70 mt-1">
                {badPoint.length}/500文字
              </div>
            </div>
          </div>

          {/* 詳細アドバイス */}
          <h4 className="text-md font-semibold text-text mb-2">
            {selectedUser.hasComment
              ? "新しいアドバイス追加（履歴に登録）"
              : "ワンポイントアドバイス（履歴に登録）"}
          </h4>
          <textarea
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            rows={4}
            placeholder="こちらに税理士からのアドバイスを入力してください..."
            value={currentComment}
            onChange={(e) => setCurrentComment(e.target.value)}
            maxLength={500}
          />
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-text/70">
              {currentComment.length}/500文字
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleSaveDraft}
                disabled={
                  isCommentSaving ||
                  (!currentComment.trim() &&
                    !goodPoint.trim() &&
                    !cautionPoint.trim() &&
                    !badPoint.trim())
                }
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                下書き保存
              </button>
              <button
                onClick={handleSaveComment}
                disabled={
                  isCommentSaving ||
                  (!currentComment.trim() &&
                    !goodPoint.trim() &&
                    !cautionPoint.trim() &&
                    !badPoint.trim())
                }
                className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isCommentSaving && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>送信</span>
              </button>
            </div>
          </div>
        </div>

        {/* ナビゲーション編集セクション */}
        <div className="card">
          <h3 className="text-lg font-semibold text-text mb-4 flex items-center space-x-2">
            <Map className="h-5 w-5 text-primary" />
            <span>ナビゲーション編集</span>
          </h3>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
            {editableRoadmap.map((yearData) => {
              const originalYearData = selectedUser.roadmap.find(
                (y) => y.year === yearData.year
              );
              return (
                <div key={yearData.year} className="border rounded-lg">
                  <button
                    onClick={() =>
                      setOpenYear(
                        openYear === yearData.year ? null : yearData.year
                      )
                    }
                    className="w-full text-left p-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <span className="font-semibold">{yearData.year}年度</span>
                    {openYear === yearData.year ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                  {openYear === yearData.year && (
                    <div className="p-4 border-t space-y-4">
                      {Object.entries(yearData.quarters).map(
                        ([q, advice]: [string, RoadmapAdvice]) => {
                          const quarter = parseInt(q);
                          const originalQuarterAdvice =
                            originalYearData?.quarters[quarter];
                          return (
                            <div
                              key={quarter}
                              className="mb-4 p-4 border rounded-md bg-white shadow-sm"
                            >
                              <h4 className="font-bold text-primary mb-3">
                                第{quarter}四半期
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-text/70 mb-1">
                                    タイトル
                                  </label>
                                  <input
                                    type="text"
                                    value={advice.title}
                                    onChange={(e) =>
                                      handleRoadmapChange(
                                        yearData.year,
                                        quarter,
                                        "title",
                                        e.target.value
                                      )
                                    }
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                                      originalQuarterAdvice &&
                                      originalQuarterAdvice.title !==
                                        advice.title
                                        ? "bg-yellow-100"
                                        : ""
                                    }`}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-text/70 mb-1">
                                    アドバイス
                                  </label>
                                  <textarea
                                    value={advice.advice}
                                    onChange={(e) =>
                                      handleRoadmapChange(
                                        yearData.year,
                                        quarter,
                                        "advice",
                                        e.target.value
                                      )
                                    }
                                    rows={2}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-y ${
                                      originalQuarterAdvice &&
                                      originalQuarterAdvice.advice !==
                                        advice.advice
                                        ? "bg-yellow-100"
                                        : ""
                                    }`}
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-text/70 mb-1">
                                    詳細タスク
                                  </label>
                                  <div className="space-y-2">
                                    {advice.details.map(
                                      (detail: string, index: number) => {
                                        const isDetailChanged =
                                          originalQuarterAdvice &&
                                          originalQuarterAdvice.details[
                                            index
                                          ] !== detail;
                                        return (
                                          <div
                                            key={index}
                                            className="flex items-center space-x-2"
                                          >
                                            <input
                                              type="text"
                                              value={detail}
                                              onChange={(e) =>
                                                handleDetailChange(
                                                  yearData.year,
                                                  quarter,
                                                  index,
                                                  e.target.value
                                                )
                                              }
                                              className={`flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${
                                                isDetailChanged
                                                  ? "bg-yellow-100"
                                                  : ""
                                              }`}
                                            />
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSaveRoadmap}
              className="px-6 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
            >
              ナビゲーションを保存
            </button>
          </div>
        </div>

        {/* 売上目標編集セクション */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text flex items-center space-x-2">
              <Target className="h-5 w-5 text-primary" />
              <span>目標設定・編集</span>
            </h3>
            {isSalesTargetModified && (
              <button
                onClick={handleSaveSalesTargets}
                className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                保存
              </button>
            )}
          </div>
          <SalesTargetEditor
            targets={editableSalesTargets}
            onChange={handleSalesTargetChange}
            grossProfitMarginTarget={selectedUser.grossProfitMarginTarget || 0}
            operatingProfitMarginTarget={
              selectedUser.operatingProfitMarginTarget || 0
            }
            onProfitMarginChange={handleProfitMarginChange}
          />
        </div>
      </div>
    );
  }

  // ユーザー一覧画面
  return (
    <div className="space-y-6">
      {/* ヘッダー */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-text">
          クライアント管理 (デモモード)
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={openAddUserModal}
            className="flex items-center justify-center bg-primary text-white font-medium py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <PlusCircle className="h-5 w-5 mr-2" />
            新規クライアント追加
          </button>
          <div className="text-sm text-text/70">
            登録ユーザー数: {users.length}名
            {isLoading && <span className="ml-2">(読み込み中...)</span>}
          </div>
        </div>
      </div>

      {/* ローディング表示 */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-text/70">データを読み込んでいます...</p>
          <p className="text-sm text-blue-600 mt-2">(デモモード)</p>
        </div>
      ) : (
        <>
          {/* 検索・フィルター */}
          <div className="card">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="ユーザー名または事業名で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-text/70">並び順:</span>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="pl-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="name_asc">名前順</option>
                  <option value="date_asc">最終アドバイス日順(昇順)</option>
                  <option value="date_desc">最終アドバイス日順(降順)</option>
                </select>
              </div>
            </div>
          </div>

          {/* ユーザー一覧 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedUsers.map((user) => (
              <div
                key={user.userId}
                className={`card hover:shadow-lg transition-shadow cursor-pointer ${getCardBorderClass(
                  user
                )}`}
                onClick={() => handleUserSelect(user)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-text">
                          {user.userName}
                        </h3>
                      </div>
                      <p className="text-sm text-text/70">{user.email}</p>
                      <p className="text-sm text-text/70">{user.companyName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ChevronRight className="h-5 w-5 text-text/40" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-text/70">事業開始年月</span>
                    <span className="text-sm font-medium text-primary">
                      {user.businessStartDate
                        ? `${user.businessStartDate.split("-")[0]}年${
                            user.businessStartDate.split("-")[1]
                          }月`
                        : "未設定"}
                    </span>
                  </div>

                  {user.hasComment && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text/70">
                        最終アドバイス日
                      </span>
                      <span className="text-sm text-green-600 font-medium">
                        {user.commentDate.includes("T")
                          ? user.commentDate.replace("T", " ").split(".")[0]
                          : user.commentDate}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedUsers.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-text/30 mx-auto mb-4" />
              <p className="text-text/70">
                該当するユーザーが見つかりませんでした
              </p>
            </div>
          )}
        </>
      )}

      {/* 新規ユーザー追加モーダル */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 sm:p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">新規クライアント追加</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">
                  メールアドレス *
                </label>
                <input
                  type="text"
                  name="email"
                  value={newUser.email || ""}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">
                  パスワード *
                </label>
                <input
                  type="text"
                  name="password"
                  value={newUser.password || ""}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
              {/* User Name */}
              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">
                  ユーザー名 *
                </label>
                <input
                  type="text"
                  name="userName"
                  value={newUser.userName || ""}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {errors.userName && (
                  <p className="text-red-500 text-xs mt-1">{errors.userName}</p>
                )}
              </div>
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">
                  会社名 *
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={newUser.companyName || ""}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
                {errors.companyName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.companyName}
                  </p>
                )}
              </div>
              {/* Capital */}
              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">
                  資本金 (円)
                </label>
                <input
                  type="number"
                  name="capital"
                  value={newUser.capital || 0}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              {/* Company Size */}
              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">
                  会社規模
                </label>
                <select
                  name="companySize"
                  value={newUser.companySize}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {companySizeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {/* Industry */}
              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">
                  業界
                </label>
                <select
                  name="industry"
                  value={newUser.industry}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {industryOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
              {/* Business Start Date */}
              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">
                  事業開始年月
                </label>
                <div className="flex gap-2">
                  <select
                    name="businessStartYear"
                    value={newUser.businessStartYear || ""}
                    onChange={handleNewUserChange}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {Array.from({ length: 11 }, (_, i) => currentYear - i).map(
                      (year) => (
                        <option key={year} value={year}>
                          {year}年
                        </option>
                      )
                    )}
                  </select>
                  <select
                    name="businessStartMonth"
                    value={newUser.businessStartMonth || ""}
                    onChange={handleNewUserChange}
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {Array.from({ length: 12 }, (_, i) =>
                      String(i + 1).padStart(2, "0")
                    ).map((month) => {
                      if (
                        newUser.businessStartYear &&
                        Number(newUser.businessStartYear) === currentYear &&
                        Number(month) > currentMonth
                      ) {
                        return null;
                      }
                      return (
                        <option key={month} value={month}>
                          {Number(month)}月
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              {/* Knowledge Level */}
              <div>
                <label className="block text-sm font-medium text-text/70 mb-1">
                  財務・会計の知識レベル
                </label>
                <select
                  name="financialKnowledge"
                  value={newUser.financialKnowledge}
                  onChange={handleNewUserChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {financialKnowledgeOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={closeAddUserModal}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                キャンセル
              </button>
              <button
                onClick={handleAddNewUser}
                className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
