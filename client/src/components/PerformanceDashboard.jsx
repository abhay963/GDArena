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

  if (loading)
    return (
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex flex-col gap-4 items-center justify-center text-white z-50">
        <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin"></div>
        <p className="text-sm font-medium tracking-widest text-slate-400 uppercase animate-pulse">
          Analyzing Performance Data...
        </p>
      </div>
    );

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex justify-center items-center p-4 z-50 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-800 text-slate-100 p-6 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl shadow-indigo-950/20"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-2 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              Performance Analytics
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Historical session insights</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 hover:bg-slate-800 rounded-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Container */}
        <div className="overflow-y-auto pr-2 space-y-6 flex-1 scrollbar-thin scrollbar-thumb-slate-800">
          
          {/* Stats Overview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Total Sessions", value: stats.total_sessions, color: "from-blue-500/10 to-indigo-500/5 text-blue-400" },
              { label: "Total Words", value: stats.total_words, color: "from-emerald-500/10 to-teal-500/5 text-emerald-400" },
              { label: "Total Messages", value: stats.total_messages, color: "from-violet-500/10 to-purple-500/5 text-violet-400" },
              { label: "Avg Score", value: `${stats.average_overall || 0}/10`, color: "from-amber-500/10 to-orange-500/5 text-amber-400 font-semibold" }
            ].map((card, i) => (
              <div key={i} className={`bg-gradient-to-br ${card.color} border border-slate-800/60 p-3.5 rounded-xl`}>
                <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1">{card.label}</p>
                <p className="text-xl font-bold tracking-tight">{card.value ?? 0}</p>
              </div>
            ))}
          </div>

          {/* Breakdown Section */}
          <div>
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Session Reports ({reports.length})</h3>
            
            <div className="space-y-3">
              {reports.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-slate-800 rounded-xl text-slate-500 text-sm">
                  No evaluation reports found.
                </div>
              ) : (
                reports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 hover:border-slate-700 transition-colors"
                  >
                    {/* Card Title Header */}
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium text-slate-200 text-sm md:text-base">{report.topic || "Untitled Session"}</h4>
                      <div className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs px-2 py-0.5 rounded-md font-semibold">
                        Score: {report.overall_score}/10
                      </div>
                    </div>

                    {/* Metrics Grid Sub-badges */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      {[
                        { name: "Communication", val: report.communication },
                        { name: "Confidence", val: report.confidence },
                        { name: "Vocabulary", val: report.vocabulary },
                        { name: "Fluency", val: report.fluency },
                        { name: "Logic", val: report.logic },
                        { name: "Participation", val: report.participation }
                      ].map((metric, idx) => (
                        <div key={idx} className="bg-slate-900/60 border border-slate-800/50 rounded-lg p-2 flex justify-between items-center">
                          <span className="text-slate-400 text-[11px]">{metric.name}</span>
                          <span className="font-mono text-slate-200 font-medium">{metric.val ?? '-'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 active:bg-slate-700 text-slate-200 text-sm font-medium px-5 py-2 rounded-xl transition duration-150 focus:outline-none focus:ring-2 focus:ring-slate-700"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}