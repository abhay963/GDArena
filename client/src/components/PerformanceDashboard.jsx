import { useEffect, useState } from "react";

export default function Performance({ uid, onClose }) {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!uid) return;

    async function fetchPerformance() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/performance/${uid}`
        );
        const data = await response.json();
        setReports(data.reports || []);
        setStats(data.stats || {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchPerformance();
  }, [uid]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const getScoreColor = (score) => {
    if (score == null) return "text-slate-500";
    if (score >= 8) return "text-emerald-400";
    if (score >= 6) return "text-amber-400";
    if (score >= 4) return "text-orange-400";
    return "text-red-400";
  };

  const getScoreBg = (score) => {
    if (score == null) return "bg-slate-800/50 border-slate-700/50";
    if (score >= 8) return "bg-emerald-500/10 border-emerald-500/25";
    if (score >= 6) return "bg-amber-500/10 border-amber-500/25";
    if (score >= 4) return "bg-orange-500/10 border-orange-500/25";
    return "bg-red-500/10 border-red-500/25";
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col gap-5 items-center justify-center text-white z-50">
        <div className="relative">
          <div className="w-14 h-14 border-[3px] border-indigo-500/20 border-t-indigo-400 rounded-full animate-spin" />
          <div className="absolute inset-0 w-14 h-14 border-[3px] border-transparent border-b-cyan-400/40 rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.2s]" />
        </div>
        <div className="text-center space-y-1.5">
          <p className="text-sm font-semibold tracking-widest text-slate-300 uppercase">
            Analyzing Performance
          </p>
          <p className="text-xs text-slate-500 animate-pulse">
            Fetching your session insights…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm flex justify-center items-center p-3 sm:p-4 z-50"
      style={{ animation: "fadeIn 180ms ease-out forwards" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900/95 border border-slate-700/60 text-slate-100 p-5 sm:p-6 rounded-2xl w-full max-w-2xl max-h-[88vh] flex flex-col shadow-2xl shadow-indigo-950/40 backdrop-blur-xl"
        style={{ animation: "modalIn 220ms cubic-bezier(0.16, 1, 0.3, 1) forwards" }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-5 pb-4 border-b border-slate-800/80">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-300 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              Performance Analytics
            </h2>
            <p className="text-xs text-slate-400">
              Historical session insights &amp; skill breakdown
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-all p-2 hover:bg-slate-800 rounded-xl active:scale-95"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto pr-1 -mr-1 space-y-6 flex-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
            {[
              {
                label: "Total Sessions",
                value: stats.total_sessions,
                accent: "from-blue-500/15 to-indigo-500/5 border-blue-500/20 text-blue-300",
                icon: "📊",
              },
              {
                label: "Total Words",
                value: stats.total_words,
                accent: "from-emerald-500/15 to-teal-500/5 border-emerald-500/20 text-emerald-300",
                icon: "✍️",
              },
              {
                label: "Total Messages",
                value: stats.total_messages,
                accent: "from-violet-500/15 to-purple-500/5 border-violet-500/20 text-violet-300",
                icon: "💬",
              },
              {
                label: "Avg Score",
                value: `${stats.average_overall ?? 0}/10`,
                accent: "from-amber-500/15 to-orange-500/5 border-amber-500/20 text-amber-300",
                icon: "⭐",
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${card.accent} border p-3.5 rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98]`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider text-slate-400">
                    {card.label}
                  </p>
                  <span className="text-sm opacity-80">{card.icon}</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold tracking-tight">
                  {card.value ?? 0}
                </p>
              </div>
            ))}
          </div>

          {/* Reports Section */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Session Reports
              </h3>
              <span className="text-[11px] font-medium text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-md">
                {reports.length} total
              </span>
            </div>

            <div className="space-y-3">
              {reports.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-slate-700/70 rounded-2xl bg-slate-950/30">
                  <div className="text-3xl mb-3 opacity-60">📭</div>
                  <p className="text-sm font-medium text-slate-400">No evaluation reports yet</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Complete a session to see your analytics here
                  </p>
                </div>
              ) : (
                reports.map((report, idx) => (
                  <div
                    key={report.id || idx}
                    className="group bg-slate-950/50 border border-slate-800/80 hover:border-slate-600/80 rounded-xl p-4 transition-all duration-200 hover:bg-slate-950/70 hover:shadow-lg hover:shadow-indigo-950/20"
                  >
                    {/* Card header */}
                    <div className="flex justify-between items-start gap-3 mb-3.5">
                      <div className="min-w-0">
                        <h4 className="font-semibold text-slate-100 text-sm sm:text-base truncate group-hover:text-white transition-colors">
                          {report.topic || "Untitled Session"}
                        </h4>
                        {report.created_at && (
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {new Date(report.created_at).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                      <div
                        className={`shrink-0 text-xs px-2.5 py-1 rounded-lg font-bold border ${getScoreBg(
                          report.overall_score
                        )} ${getScoreColor(report.overall_score)}`}
                      >
                        {report.overall_score ?? "–"}/10
                      </div>
                    </div>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { name: "Communication", val: report.communication },
                        { name: "Confidence", val: report.confidence },
                        { name: "Vocabulary", val: report.vocabulary },
                        { name: "Fluency", val: report.fluency },
                        { name: "Logic", val: report.logic },
                        { name: "Participation", val: report.participation },
                      ].map((metric, mIdx) => (
                        <div
                          key={mIdx}
                          className="bg-slate-900/70 border border-slate-800/60 rounded-lg px-2.5 py-2 flex justify-between items-center gap-2"
                        >
                          <span className="text-[11px] text-slate-400 truncate">
                            {metric.name}
                          </span>
                          <span
                            className={`font-mono text-xs font-semibold tabular-nums ${getScoreColor(
                              metric.val
                            )}`}
                          >
                            {metric.val ?? "–"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 active:bg-slate-750 text-slate-200 text-sm font-medium px-5 py-2.5 rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 active:scale-95"
          >
            Dismiss
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}