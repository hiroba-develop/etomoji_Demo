// マンダラチャートと予実管理の連動ユーティリティ

import { MandalaGoal, YearlyTargetLink } from "../types";

/**
 * マンダラチャートのデータを取得
 */
export const getMandalaData = () => {
  const centerGoal = localStorage.getItem("mandala_center_goal_v2") || "";
  const majorCells = JSON.parse(
    localStorage.getItem("mandala_major_cells_v2") || "[]"
  );
  const middleCharts = JSON.parse(
    localStorage.getItem("mandala_middle_charts_v2") || "{}"
  );
  const minorCharts = JSON.parse(
    localStorage.getItem("mandala_minor_charts_v2") || "{}"
  );

  return {
    centerGoal,
    majorCells,
    middleCharts,
    minorCharts,
  };
};

/**
 * マンダラの目標を年次予実管理の目標値に変換
 * 大目標または中目標のタイトルから金額目標を推定
 */
export const convertMandalaGoalToYearlyTarget = (
  goalTitle: string,
  goalLevel: "major" | "middle"
): {
  revenueTarget?: number;
  profitTarget?: number;
  type: "revenue" | "profit" | "custom";
} => {
  const lowerTitle = goalTitle.toLowerCase();

  // 売上関連のキーワード
  const revenueKeywords = [
    "売上",
    "売り上げ",
    "revenue",
    "sales",
    "年商",
    "億円",
    "万円",
  ];
  // 利益関連のキーワード
  const profitKeywords = [
    "利益",
    "profit",
    "収益",
    "営業利益",
    "純利益",
  ];

  // 金額を抽出（例：「年商1億円」→ 100000000）
  const extractAmount = (text: string): number | null => {
    // 億円の場合
    const okuMatch = text.match(/(\d+(?:\.\d+)?)億/);
    if (okuMatch) {
      return parseFloat(okuMatch[1]) * 100000000;
    }

    // 万円の場合
    const manMatch = text.match(/(\d+(?:\.\d+)?)万/);
    if (manMatch) {
      return parseFloat(manMatch[1]) * 10000;
    }

    // 数字のみの場合（そのまま使用）
    const numMatch = text.match(/(\d+)/);
    if (numMatch) {
      return parseInt(numMatch[1], 10);
    }

    return null;
  };

  const amount = extractAmount(goalTitle);

  // 売上関連の目標か判定
  if (revenueKeywords.some((keyword) => lowerTitle.includes(keyword))) {
    return {
      revenueTarget: amount || undefined,
      type: "revenue",
    };
  }

  // 利益関連の目標か判定
  if (profitKeywords.some((keyword) => lowerTitle.includes(keyword))) {
    return {
      profitTarget: amount || undefined,
      type: "profit",
    };
  }

  // カスタム目標（数値が含まれる場合は売上として扱う）
  if (amount) {
    return {
      revenueTarget: amount,
      type: "custom",
    };
  }

  return { type: "custom" };
};

/**
 * マンダラの大目標から年次目標を生成
 */
export const syncMandalaToYearlyTargets = () => {
  const { majorCells } = getMandalaData();

  // 各大目標から目標値を抽出
  const yearlyTargets: Array<{
    goalId: string;
    goalTitle: string;
    revenueTarget?: number;
    profitTarget?: number;
    type: "revenue" | "profit" | "custom";
  }> = [];

  majorCells.forEach((cell: any) => {
    if (cell.title) {
      const target = convertMandalaGoalToYearlyTarget(cell.title, "major");
      yearlyTargets.push({
        goalId: cell.id,
        goalTitle: cell.title,
        ...target,
      });
    }
  });

  // LocalStorageに保存
  localStorage.setItem(
    "mandala_yearly_targets",
    JSON.stringify(yearlyTargets)
  );

  return yearlyTargets;
};

/**
 * 予実管理の実績入力時、該当する小目標を達成扱いにする
 */
export const updateMinorGoalsFromActuals = (
  year: number,
  actualRevenue?: number,
  actualProfit?: number
) => {
  const { minorCharts } = getMandalaData();

  // 小目標のタイトルから、実績に関連するものを探す
  let updated = false;

  Object.keys(minorCharts).forEach((chartKey) => {
    const chart = minorCharts[chartKey];
    chart.cells.forEach((cell: any, index: number) => {
      if (!cell.title) return;

      const lowerTitle = cell.title.toLowerCase();
      let shouldCheck = false;

      // 売上関連の小目標
      if (
        actualRevenue &&
        (lowerTitle.includes("売上") ||
          lowerTitle.includes("revenue") ||
          lowerTitle.includes("販売"))
      ) {
        // 売上実績が目標を達成していればチェック
        const target = convertMandalaGoalToYearlyTarget(cell.title, "middle");
        if (
          target.revenueTarget &&
          actualRevenue >= target.revenueTarget
        ) {
          shouldCheck = true;
        }
      }

      // 利益関連の小目標
      if (
        actualProfit &&
        (lowerTitle.includes("利益") ||
          lowerTitle.includes("profit") ||
          lowerTitle.includes("収益"))
      ) {
        const target = convertMandalaGoalToYearlyTarget(cell.title, "middle");
        if (target.profitTarget && actualProfit >= target.profitTarget) {
          shouldCheck = true;
        }
      }

      // チェック状態を更新
      if (shouldCheck && !cell.isChecked) {
        chart.cells[index] = {
          ...cell,
          isChecked: true,
          achievement: 100,
          status: "achieved",
        };
        updated = true;
      }
    });
  });

  // 更新があった場合はLocalStorageに保存
  if (updated) {
    localStorage.setItem(
      "mandala_minor_charts_v2",
      JSON.stringify(minorCharts)
    );

    // 中目標と大目標の達成度も再計算が必要（マンダラチャートの再読み込みで反映）
    return true;
  }

  return false;
};

/**
 * マンダラの進捗を取得
 */
export const getMandalaProgress = () => {
  const { majorCells, middleCharts, minorCharts } = getMandalaData();

  // 大目標の達成度
  const majorAchievement =
    majorCells.length > 0
      ? majorCells.reduce((sum: number, cell: any) => sum + cell.achievement, 0) /
        majorCells.length
      : 0;

  // 中目標の達成度
  const middleAchievements: number[] = [];
  Object.values(middleCharts).forEach((chart: any) => {
    chart.cells.forEach((cell: any) => {
      middleAchievements.push(cell.achievement);
    });
  });
  const middleAchievement =
    middleAchievements.length > 0
      ? middleAchievements.reduce((sum, val) => sum + val, 0) /
        middleAchievements.length
      : 0;

  // 小目標の達成度（チェック済み数）
  let minorTotal = 0;
  let minorChecked = 0;
  Object.values(minorCharts).forEach((chart: any) => {
    chart.cells.forEach((cell: any) => {
      if (cell.title) {
        minorTotal++;
        if (cell.isChecked) {
          minorChecked++;
        }
      }
    });
  });
  const minorAchievement =
    minorTotal > 0 ? (minorChecked / minorTotal) * 100 : 0;

  return {
    major: Math.round(majorAchievement),
    middle: Math.round(middleAchievement),
    minor: Math.round(minorAchievement),
    overall: Math.round((majorAchievement + middleAchievement + minorAchievement) / 3),
  };
};

/**
 * 予実管理のデータ保存時のフック
 * 年次予実の実績が更新されたら、マンダラの小目標を自動更新
 */
export const onYearlyActualUpdate = (
  year: number,
  data: {
    revenueActual?: number;
    grossProfitActual?: number;
    operatingProfitActual?: number;
  }
) => {
  const updated = updateMinorGoalsFromActuals(
    year,
    data.revenueActual,
    data.operatingProfitActual
  );

  if (updated) {
    // 更新があったことを通知（UI側で処理）
    const event = new CustomEvent("mandala-updated", {
      detail: { year, data },
    });
    window.dispatchEvent(event);
  }

  return updated;
};

/**
 * マンダラの目標変更時のフック
 * 大目標または中目標が変更されたら、年次予実管理の目標値を自動更新
 */
export const onMandalaGoalUpdate = () => {
  const yearlyTargets = syncMandalaToYearlyTargets();

  // 更新があったことを通知
  const event = new CustomEvent("yearly-targets-updated", {
    detail: { yearlyTargets },
  });
  window.dispatchEvent(event);

  return yearlyTargets;
};

