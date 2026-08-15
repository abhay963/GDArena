import { useEffect, useMemo, useState } from "react";
import {
  FiX,
  FiArrowUpRight,
  FiTrendingUp,
  FiMessageSquare,
  FiMic,
  FiTarget,
  FiActivity,
  FiChevronRight,
  FiCalendar,
  FiZap,
  FiAward,
  FiClock,
  FiBarChart2,
} from "react-icons/fi";

const metrics = {
  communication: {
    label: "Communication",
    description: "Clarity, structure and effectiveness of your arguments.",
    icon: FiMessageSquare,
  },
  confidence: {
    label: "Confidence",
    description: "How confidently and decisively you express ideas.",
    icon: FiTarget,
  },
  vocabulary: {
    label: "Vocabulary",
    description: "Range and precision of the language you use.",
    icon: FiZap,
  },
  fluency: {
    label: "Fluency",
    description: "Natural flow, pace and continuity of speech.",
    icon: FiMic,
  },
  logic: {
    label: "Logic",
    description: "Reasoning quality and strength of your arguments.",
    icon: FiActivity,
  },
  participation: {
    label: "Participation",
    description: "How effectively you contribute to the discussion.",
    icon: FiTrendingUp,
  },
};

function ScoreBar({ value, accent = "cyan" }) {
  const gradients = {
    cyan: "from-cyan-300 to-blue-500",
    violet: "from-violet-300 to-fuchsia-500",
    emerald: "from-emerald-300 to-cyan-500",
    amber: "from-amber-300 to-orange-500",
  };

  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.055]">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${gradients[accent]} transition-all duration-700`}
        style={{ width: `${Math.min((Number(value) || 0) * 10, 100)}%` }}
      />
    </div>
  );
}

function ScoreOrb({ value }) {
  const score = Number(value) || 0;

  return (
    <div className="relative h-52 w-52">
      <div className="absolute inset-0 rounded-full border border-white/[0.07]" />
      <div className="absolute inset-3 rounded-full border border-white/[0.05]" />

      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 210deg, #67e8f9 0deg, #818cf8 ${score * 36}deg, transparent ${score * 36}deg 360deg)`,
          maskImage: "radial-gradient(circle, transparent 63%, black 64%, black 70%, transparent 71%)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 63%, black 64%, black 70%, transparent 71%)",
        }}
      />

      <div className="absolute inset-9 flex flex-col items-center justify-center rounded-full bg-[#090d12] shadow-[inset_0_0_50px_rgba(255,255,255,.025)]">
        <span className="text-6xl font-black tracking-[-0.08em] text-white">
          {score % 1 === 0 ? score : score.toFixed(1)}
        </span>
        <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.3em] text-white/25">
          overall score
        </span>
      </div>

      <div className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,.9)]" />
    </div>
  );
}

function TrendChart({ reports }) {
  const values = reports
    .slice(0, 8)
    .reverse()
    .map((item) => Number(item.overall_score) || 0);

  if (!values.length) {
    return (
      <div className="flex h-40 items-center justify-center text-[9px] uppercase tracking-[0.25em] text-white/15">
        Complete more arenas to reveal your trend
      </div>
    );
  }

  const max = Math.max(...values, 10);

  const points = values
    .map((value, index) => {
      const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100;
      const y = 90 - (value / max) * 72;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="relative h-40">
      <div className="absolute inset-0 flex flex-col justify-between">
        {[0, 1, 2, 3, 4].map((item) => (
          <div key={item} className="h-px bg-white/[0.045]" />
        ))}
      </div>

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <defs>
          <linearGradient id="editorialTrend" x1="0" x2="1">
            <stop offset="0%" stopColor="#67e8f9" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
          <linearGradient id="editorialFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity=".12" />
            <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
          </linearGradient>
        </defs>

        <polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#editorialFill)"
        />

        <polyline
          points={points}
          fill="none"
          stroke="url(#editorialTrend)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {values.map((value, index) => {
          const x = values.length === 1 ? 50 : (index / (values.length - 1)) * 100;
          const y = 90 - (value / max) * 72;

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r={index === values.length - 1 ? 2.8 : 1.6}
              fill={index === values.length - 1 ? "#67e8f9" : "#a78bfa"}
            />
          );
        })}
      </svg>
    </div>
  );
}

export default function Performance({ uid, onClose }) {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeMetric, setActiveMetric] = useState("communication");

  useEffect(() => {
    if (!uid) {
      setLoading(false);
      return;
    }

    const fetchPerformance = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/performance/${uid}`
        );

        if (!response.ok) throw new Error("Failed to fetch performance.");

        const data = await response.json();
        setReports(data.reports || []);
        setStats(data.stats || {});
      } catch (error) {
        console.error("Performance error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformance();
  }, [uid]);

  useEffect(() => {
    const escape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", escape);
    return () => document.removeEventListener("keydown", escape);
  }, [onClose]);

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = oldOverflow;
    };
  }, []);

  const average = Number(stats.average_overall) || 0;
  const best = Number(stats.best_overall) || 0;
  const improvement = Number(stats.improvement) || 0;
  const latest = reports[0] || null;

  const metricData = useMemo(() => {
    if (!latest) return {};

    return {
      communication: latest.communication || 0,
      confidence: latest.confidence || 0,
      vocabulary: latest.vocabulary || 0,
      fluency: latest.fluency || 0,
      logic: latest.logic || 0,
      participation: latest.participation || 0,
    };
  }, [latest]);

  const active = metrics[activeMetric];
  const ActiveIcon = active.icon;
  const activeValue = Number(metricData[activeMetric]) || 0;

  const scoreLabel =
    average >= 8
      ? "Exceptional"
      : average >= 7
      ? "Strong Speaker"
      : average >= 5
      ? "Developing"
      : "Getting Started";

  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#05070a]/95 backdrop-blur-2xl">
        <div className="relative">
          <div className="h-12 w-12 animate-spin rounded-full border border-white/10 border-t-cyan-300" />
          <FiActivity className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 text-cyan-300" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-[#05070a]/90 p-3 backdrop-blur-2xl sm:p-8"
      onClick={onClose}
    >
      {/* Editorial background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[8%] h-80 w-80 rounded-full bg-cyan-400/[0.045] blur-[120px]" />
        <div className="absolute bottom-[8%] right-[8%] h-96 w-96 rounded-full bg-violet-500/[0.04] blur-[140px]" />

        <div className="absolute inset-0 opacity-[0.018] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:90px_90px]" />
      </div>

      <div
        onClick={(event) => event.stopPropagation()}
        className="relative mx-auto min-h-[calc(100vh-24px)] max-w-6xl overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#080b10] shadow-[0_50px_180px_rgba(0,0,0,.75)] sm:min-h-0"
      >
        {/* Top editorial rule */}
        <div className="absolute left-0 right-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/[0.07] px-5 py-5 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="hidden h-8 w-px bg-cyan-300/60 sm:block" />

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] font-bold uppercase tracking-[0.35em] text-cyan-300/60">
                  GD Arena
                </span>
                <span className="text-white/10">/</span>
                <span className="text-[8px] uppercase tracking-[0.25em] text-white/25">
                  Intelligence Report
                </span>
              </div>

              <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-white sm:text-xl">
                Performance Review
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] text-white/30 transition hover:border-white/15 hover:bg-white/[0.04] hover:text-white"
          >
            <FiX className="h-4 w-4" />
          </button>
        </header>

        <main className="p-5 sm:p-8">
          {/* Intro */}
          <section className="grid items-end gap-5 border-b border-white/[0.07] pb-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20">
                Communication intelligence · {reports.length} sessions
              </p>

              <h1 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.055em] text-white sm:text-5xl">
                See how you
                <span className="text-white/30"> sound,</span>{" "}
                <span className="bg-gradient-to-r from-cyan-300 to-violet-300 bg-clip-text text-transparent">
                  think
                </span>{" "}
                and
                <span className="text-white/30"> perform.</span>
              </h1>

              <p className="mt-4 max-w-xl text-xs leading-6 text-white/30 sm:text-sm">
                Your AI-evaluated communication profile, built from every completed
                discussion in GD Arena.
              </p>
            </div>

            <div className="flex items-center gap-2 pb-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-emerald-300/60">
                Profile active
              </span>
            </div>
          </section>

          {/* Main score + editorial stats */}
          <section className="grid gap-0 border-b border-white/[0.07] lg:grid-cols-[.9fr_1.1fr]">
            <div className="relative flex min-h-[390px] flex-col items-center justify-center border-b border-white/[0.07] py-10 lg:border-b-0 lg:border-r lg:py-8">
              <div className="absolute left-0 top-10 text-[7px] font-bold uppercase tracking-[0.3em] text-white/15">
                01 / Overall readiness
              </div>

              <ScoreOrb value={average} />

              <div className="mt-6 text-center">
                <p className="text-sm font-semibold text-white/75">{scoreLabel}</p>

                <div className="mt-2 flex items-center justify-center gap-2">
                  <span className="text-[9px] text-white/20">
                    Best {best || "—"}/10
                  </span>

                  {improvement > 0 && (
                    <>
                      <span className="h-2.5 w-px bg-white/10" />
                      <span className="flex items-center gap-1 text-[9px] text-emerald-300/70">
                        <FiTrendingUp className="h-3 w-3" />
                        +{improvement}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3">
              {[
                ["Sessions", stats.total_sessions || 0, FiBarChart2],
                ["Words spoken", stats.total_words || 0, FiMessageSquare],
                ["Messages", stats.total_messages || 0, FiMic],
                ["Best score", best ? `${best}/10` : "—", FiAward],
                ["Improvement", improvement ? `+${improvement}%` : "—", FiTrendingUp],
                ["Latest", average ? `${average}/10` : "—", FiActivity],
              ].map(([label, value, Icon], index) => (
                <div
                  key={label}
                  className={`group border-white/[0.06] p-5 transition hover:bg-white/[0.02] ${
                    index < 3 ? "border-b" : ""
                  } ${index % 2 === 0 ? "sm:border-r" : ""} ${
                    index === 2 ? "sm:border-r-0" : ""
                  } ${index === 3 ? "sm:border-r" : ""} ${
                    index === 4 ? "sm:border-r" : ""
                  }`}
                >
                  <Icon className="h-4 w-4 text-white/20 transition group-hover:text-cyan-300/60" />

                  <p className="mt-10 text-[8px] font-bold uppercase tracking-[0.22em] text-white/20">
                    {label}
                  </p>

                  <p className="mt-2 text-xl font-semibold tracking-tight text-white/65">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Trend */}
          <section className="grid gap-0 border-b border-white/[0.07] lg:grid-cols-[1.35fr_.65fr]">
            <div className="border-b border-white/[0.07] py-8 lg:border-b-0 lg:border-r lg:pr-8">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-cyan-300/50">
                    02 / Trajectory
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-white">
                    Performance over time
                  </h3>
                </div>

                <FiTrendingUp className="h-4 w-4 text-white/20" />
              </div>

              <div className="mt-7">
                <TrendChart reports={reports} />
              </div>

              <div className="mt-2 flex justify-between text-[7px] font-bold uppercase tracking-[0.2em] text-white/15">
                <span>Earlier</span>
                <span>Latest</span>
              </div>
            </div>

            <div className="py-8 lg:pl-8">
              <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-violet-300/50">
                03 / Focus
              </p>

              <h3 className="mt-2 text-lg font-semibold text-white">
                What deserves attention
              </h3>

              <div className="mt-6 space-y-4">
                {Object.entries(metrics).map(([key, config]) => {
                  const value = Number(metricData[key]) || 0;
                  const Icon = config.icon;
                  const selected = key === activeMetric;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setActiveMetric(key)}
                      className="group w-full text-left"
                    >
                      <div className="mb-1.5 flex items-center justify-between">
                        <span
                          className={`flex items-center gap-2 text-[9px] ${
                            selected ? "text-white/70" : "text-white/30"
                          }`}
                        >
                          <Icon
                            className={`h-3 w-3 ${
                              selected ? "text-cyan-300" : "text-white/20"
                            }`}
                          />
                          {config.label}
                        </span>

                        <span
                          className={`font-mono text-[9px] ${
                            selected ? "text-cyan-300" : "text-white/30"
                          }`}
                        >
                          {value || "—"}
                        </span>
                      </div>

                      <ScoreBar
                        value={value}
                        accent={selected ? "cyan" : "violet"}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Active insight */}
          <section className="grid gap-0 border-b border-white/[0.07] lg:grid-cols-[.7fr_1.3fr]">
            <div className="border-b border-white/[0.07] py-8 lg:border-b-0 lg:border-r lg:pr-8">
              <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-cyan-300/50">
                Selected dimension
              </p>

              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/15 bg-cyan-300/[0.06]">
                  <ActiveIcon className="h-5 w-5 text-cyan-300" />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white">
                    {active.label}
                  </h3>
                  <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-white/20">
                    Latest evaluation
                  </p>
                </div>
              </div>

              <div className="mt-7 flex items-end gap-2">
                <span className="text-6xl font-black tracking-[-0.08em] text-white">
                  {activeValue || "—"}
                </span>
                <span className="mb-2 text-xs text-white/20">/ 10</span>
              </div>
            </div>

            <div className="py-8 lg:pl-8">
              <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-violet-300/50">
                AI interpretation
              </p>

              <p className="mt-4 max-w-2xl text-lg leading-8 tracking-[-0.02em] text-white/65">
                {active.description}
              </p>

              <div className="mt-7 border-t border-white/[0.06] pt-5">
                <div className="flex items-start gap-3">
                  <FiArrowUpRight className="mt-0.5 h-4 w-4 text-cyan-300/60" />
                  <p className="max-w-xl text-[10px] leading-5 text-white/25">
                    {activeValue >= 8
                      ? "This is currently one of your stronger signals. Preserve the behaviors that produced this result while improving the weaker dimensions."
                      : activeValue >= 6
                      ? "This dimension is functional but has room to become more consistent. Focus on deliberate practice during your next discussions."
                      : "This dimension is a useful growth target. Work on it deliberately in your next arena and watch how the score changes over time."}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Session archive */}
          <section className="pt-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-white/20">
                  04 / Archive
                </p>
                <h3 className="mt-2 text-lg font-semibold text-white">
                  Recent discussions
                </h3>
              </div>

              <span className="text-[8px] uppercase tracking-[0.2em] text-white/20">
                {reports.length} total
              </span>
            </div>

            {reports.length === 0 ? (
              <div className="mt-6 border-y border-dashed border-white/[0.08] py-16 text-center">
                <FiMic className="mx-auto h-5 w-5 text-white/15" />
                <p className="mt-4 text-xs text-white/30">No sessions yet.</p>
                <p className="mt-1 text-[9px] text-white/15">
                  Complete your first GD Arena discussion to generate your profile.
                </p>
              </div>
            ) : (
              <div className="mt-5 divide-y divide-white/[0.06] border-y border-white/[0.06]">
                {reports.map((report, index) => {
                  const score = Number(report.overall_score) || 0;
                  const date = report.created_at
                    ? new Date(report.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "";

                  return (
                    <div
                      key={report.id || index}
                      className="group grid gap-4 py-4 transition hover:bg-white/[0.018] sm:grid-cols-[70px_1fr_auto] sm:items-center"
                    >
                      <div className="flex items-center gap-3 sm:block">
                        <span className="font-mono text-xl font-bold tracking-tight text-white/70">
                          {score || "—"}
                        </span>
                        <span className="text-[7px] uppercase tracking-[0.18em] text-white/15 sm:ml-1">
                          /10
                        </span>
                      </div>

                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-semibold text-white/60 transition group-hover:text-white">
                          {report.topic || "Untitled Discussion"}
                        </h4>

                        <div className="mt-1 flex items-center gap-2">
                          {date && (
                            <span className="flex items-center gap-1 text-[8px] text-white/20">
                              <FiCalendar className="h-2.5 w-2.5" />
                              {date}
                            </span>
                          )}
                          <span className="h-0.5 w-0.5 rounded-full bg-white/10" />
                          <span className="text-[8px] text-white/20">
                            AI evaluated
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-5 text-[8px] font-mono text-white/30">
                        <span>
                          COM {report.communication ?? "—"}
                        </span>
                        <span className="hidden sm:inline">
                          CONF {report.confidence ?? "—"}
                        </span>
                        <span className="hidden sm:inline">
                          LOGIC {report.logic ?? "—"}
                        </span>
                        <FiChevronRight className="h-3.5 w-3.5 text-white/15 transition group-hover:text-cyan-300/60" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <footer className="flex items-center justify-between border-t border-white/[0.06] pt-5 mt-8">
            <span className="text-[7px] uppercase tracking-[0.25em] text-white/15">
              GD Arena · Personal intelligence report
            </span>
            <span className="flex items-center gap-1.5 text-[7px] uppercase tracking-[0.2em] text-white/15">
              <FiClock className="h-3 w-3" />
              Continuously updated
            </span>
          </footer>
        </main>
      </div>

      <style>{`
        ::-webkit-scrollbar {
          width: 4px;
        }

        ::-webkit-scrollbar-track {
          background: transparent;
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,.08);
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}