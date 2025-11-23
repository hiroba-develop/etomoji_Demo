import React, { useEffect, useState } from "react";
import { Award, Heart, Sparkles, X } from "lucide-react";

interface AchievementPopupProps {
  isOpen: boolean;
  onClose: () => void;
  goalTitle: string;
  level: "major" | "middle" | "minor";
  message?: string;
}

const AchievementPopup: React.FC<AchievementPopupProps> = ({
  isOpen,
  onClose,
  goalTitle,
  level,
  message,
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // 紙吹雪アニメーションを3秒後に停止
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getLevelConfig = () => {
    switch (level) {
      case "major":
        return {
          title: "🎉 大目標達成！",
          color: "from-pink-500 to-rose-500",
          icon: <Award className="w-20 h-20 text-white" />,
          confettiColor: "bg-gradient-to-br from-pink-400 to-rose-400",
        };
      case "middle":
        return {
          title: "🌟 中目標達成！",
          color: "from-purple-500 to-indigo-500",
          icon: <Sparkles className="w-16 h-16 text-white" />,
          confettiColor: "bg-gradient-to-br from-purple-400 to-indigo-400",
        };
      case "minor":
        return {
          title: "💖 小目標達成！",
          color: "from-achieved to-pink-600",
          icon: <Heart className="w-14 h-14 text-white fill-current" />,
          confettiColor: "bg-gradient-to-br from-achieved to-pink-400",
        };
    }
  };

  const config = getLevelConfig();

  return (
    <>
      {/* オーバーレイ */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      >
        {/* 紙吹雪エフェクト */}
        {showConfetti && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-3 h-3 ${config.confettiColor} rounded-full animate-celebration`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-10px`,
                  animation: `fall ${2 + Math.random() * 2}s linear ${
                    Math.random() * 2
                  }s`,
                  opacity: Math.random(),
                }}
              />
            ))}
          </div>
        )}

        {/* ポップアップコンテンツ */}
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-white rounded-card-xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn">
            {/* ヘッダー部分 */}
            <div
              className={`bg-gradient-to-r ${config.color} p-8 text-center relative`}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* アイコン */}
              <div className="flex justify-center mb-4 animate-celebration">
                {config.icon}
              </div>

              {/* タイトル */}
              <h2 className="text-heading text-white font-bold mb-2">
                {config.title}
              </h2>
              <p className="text-white/90 text-body-lg">おめでとうございます！</p>
            </div>

            {/* コンテンツ部分 */}
            <div className="p-6 space-y-4">
              {/* 達成した目標 */}
              <div className="bg-gray-50 rounded-card p-4 border-2 border-primary/20">
                <p className="text-note text-gray-600 mb-2">達成した目標</p>
                <p className="text-body-lg font-bold text-text">{goalTitle}</p>
              </div>

              {/* メッセージ */}
              {message && (
                <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-card p-4">
                  <p className="text-body text-gray-700">{message}</p>
                </div>
              )}

              {/* 励ましメッセージ */}
              <div className="text-center py-4">
                <p className="text-body text-gray-600">
                  素晴らしい成果です！
                  <br />
                  この調子で次の目標も達成しましょう！
                </p>
              </div>

              {/* ボタン */}
              <button
                onClick={onClose}
                className="w-full bg-primary text-white py-3 rounded-card font-bold text-body hover:bg-primary/90 transition-all shadow-subtle hover:shadow-card"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 紙吹雪アニメーション用のスタイル */}
      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default AchievementPopup;

