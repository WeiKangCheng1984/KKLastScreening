'use client';

import { useState, useCallback, useRef } from 'react';
import { SimulationRunner, type SimResult, type IntegrityReport, type SimStrategy, type IntegrityIssue } from '@/lib/simulationRunner';
import { ChevronDown, ChevronRight, CheckCircle, XCircle, AlertTriangle, Info, Play, RefreshCw, BarChart3, Shield, Zap, Clock } from 'lucide-react';

// ─── 顏色輔助 ──────────────────────────────────────────────────────────
const severityConfig = {
  error:   { icon: XCircle,       color: 'text-red-400',    bg: 'bg-red-900/30',    border: 'border-red-700/50',    label: '錯誤' },
  warning: { icon: AlertTriangle, color: 'text-amber-400',  bg: 'bg-amber-900/20',  border: 'border-amber-700/40',  label: '警告' },
  info:    { icon: Info,          color: 'text-sky-400',    bg: 'bg-sky-900/20',    border: 'border-sky-700/40',    label: '資訊' },
};

const strategyConfig: Record<SimStrategy, { label: string; desc: string; color: string }> = {
  random:         { label: '隨機亂點', desc: '每個選擇點隨機選，模擬真實玩家隨意操作', color: 'text-purple-400' },
  optimal:        { label: '最優路線', desc: '每題選「最佳」答案，驗證正確路徑可達',   color: 'text-emerald-400' },
  explore_all:    { label: '全探索',   desc: '點所有互動點、接所有敏感對話',           color: 'text-sky-400' },
  skip_sensitive: { label: '跳過敏感', desc: '跳過所有敏感對話，測試無敏感路徑',       color: 'text-amber-400' },
};

const endingColors: Record<string, string> = {
  '完整揭露':           'text-emerald-400',
  '程序完成，真相待續': 'text-sky-400',
  '追到了，但資料沒了': 'text-amber-400',
  '現場優先，真相之後': 'text-slate-400',
};

const actionConfig: Record<string, { icon: string; color: string }> = {
  scene_enter:      { icon: '🚪', color: 'text-slate-300' },
  hotspot_click:    { icon: '👆', color: 'text-sky-300' },
  dialog_choice:    { icon: '💬', color: 'text-violet-300' },
  npc_click:        { icon: '🧑', color: 'text-amber-300' },
  sensitive_choice: { icon: '❗', color: 'text-rose-300' },
  qa_answer:        { icon: '📝', color: 'text-green-300' },
  flag_set:         { icon: '🚩', color: 'text-yellow-300' },
  item_gained:      { icon: '📦', color: 'text-teal-300' },
  scene_blocked:    { icon: '🔒', color: 'text-orange-400' },
  error:            { icon: '❌', color: 'text-red-400' },
  ending:           { icon: '🏁', color: 'text-white' },
};

// ─── 子組件 ──────────────────────────────────────────────────────────

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${color} bg-white/10`}>{children}</span>;
}

function Section({ title, children, icon }: { title: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center gap-2">
        {icon}
        <h3 className="text-white/80 font-semibold text-sm tracking-wide">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function IntegrityIssueRow({ issue }: { issue: IntegrityIssue }) {
  const cfg = severityConfig[issue.severity];
  const Icon = cfg.icon;
  return (
    <div className={`flex gap-3 p-2.5 rounded-lg ${cfg.bg} border ${cfg.border} text-xs`}>
      <Icon size={14} className={`mt-0.5 shrink-0 ${cfg.color}`} />
      <div className="flex-1 min-w-0">
        <div className="flex gap-2 items-center flex-wrap mb-0.5">
          <span className={`font-bold ${cfg.color}`}>{issue.chapter.toUpperCase()}</span>
          <span className="text-white/40">·</span>
          <code className="text-white/50 truncate max-w-[280px]">{issue.location}</code>
        </div>
        <p className="text-white/80">{issue.message}</p>
      </div>
    </div>
  );
}

function SimResultCard({ result, index }: { result: SimResult; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const endingColor = endingColors[result.endingLabel] ?? 'text-slate-400';

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-white/5 transition-colors text-left"
      >
        <span className="text-white/30 text-xs w-6 shrink-0">#{index + 1}</span>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
          <div>
            <div className="text-white/40 mb-0.5">策略</div>
            <div className={strategyConfig[result.strategy]?.color ?? 'text-white'}>
              {strategyConfig[result.strategy]?.label ?? result.strategy}
            </div>
          </div>
          <div>
            <div className="text-white/40 mb-0.5">結局</div>
            <div className={endingColor}>{result.endingLabel}</div>
          </div>
          <div>
            <div className="text-white/40 mb-0.5">道具</div>
            <div className="text-white/70">{result.finalInventory.length} 件</div>
          </div>
          <div>
            <div className="text-white/40 mb-0.5">錯誤 / 警告</div>
            <div className={result.errors.length > 0 ? 'text-red-400' : 'text-emerald-400'}>
              {result.errors.length} / {result.warnings.length}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-white/30 text-xs">{result.durationMs}ms</span>
          {result.errors.length > 0
            ? <XCircle size={14} className="text-red-400" />
            : <CheckCircle size={14} className="text-emerald-400" />}
          {expanded ? <ChevronDown size={14} className="text-white/40" /> : <ChevronRight size={14} className="text-white/40" />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-white/10 p-4 space-y-4">
          {/* 步驟記錄 */}
          <div>
            <p className="text-xs text-white/40 mb-2">步驟記錄（{result.steps.length} 步）</p>
            <div className="space-y-0.5 max-h-64 overflow-y-auto pr-1">
              {result.steps.map((step) => {
                const ac = actionConfig[step.action] ?? { icon: '·', color: 'text-white/50' };
                return (
                  <div key={step.seq} className="flex gap-2 text-xs py-0.5">
                    <span className="shrink-0 w-5 text-center">{ac.icon}</span>
                    <span className={`shrink-0 w-24 truncate text-white/30`}>{step.chapter}/{step.scene.replace(/scene_ch\d_/, '')}</span>
                    <span className={`${ac.color} flex-1 truncate`}>{step.label}</span>
                    {step.error && <span className="text-red-400 truncate max-w-[160px]">{step.error}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 旗標 */}
          <div>
            <p className="text-xs text-white/40 mb-2">最終旗標（{Object.keys(result.finalFlags).length} 個）</p>
            <div className="flex flex-wrap gap-1">
              {Object.entries(result.finalFlags)
                .filter(([, v]) => v === true)
                .map(([k]) => (
                  <code key={k} className="text-xs bg-white/5 text-green-300/80 px-1.5 py-0.5 rounded">{k}</code>
                ))}
            </div>
          </div>

          {/* 道具 */}
          {result.finalInventory.length > 0 && (
            <div>
              <p className="text-xs text-white/40 mb-2">道具欄</p>
              <div className="flex flex-wrap gap-1">
                {result.finalInventory.map((item) => (
                  <code key={item} className="text-xs bg-white/5 text-teal-300/80 px-1.5 py-0.5 rounded">{item}</code>
                ))}
              </div>
            </div>
          )}

          {/* 錯誤 / 警告 */}
          {(result.errors.length > 0 || result.warnings.length > 0) && (
            <div className="space-y-1">
              {result.errors.map((e, i) => (
                <div key={i} className="flex gap-2 items-start text-xs text-red-400 bg-red-900/20 rounded p-2">
                  <XCircle size={12} className="mt-0.5 shrink-0" />
                  <span>{e}</span>
                </div>
              ))}
              {result.warnings.slice(0, 5).map((w, i) => (
                <div key={i} className="flex gap-2 items-start text-xs text-amber-400 bg-amber-900/10 rounded p-2">
                  <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                  <span>{w}</span>
                </div>
              ))}
              {result.warnings.length > 5 && (
                <p className="text-xs text-white/30">…還有 {result.warnings.length - 5} 條警告</p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── 主頁面 ──────────────────────────────────────────────────────────

type Tab = 'integrity' | 'simulate' | 'stats';

export default function SimulatePage() {
  const runnerRef = useRef<SimulationRunner | null>(null);
  const getRunner = () => {
    if (!runnerRef.current) runnerRef.current = new SimulationRunner();
    return runnerRef.current;
  };

  const [tab, setTab] = useState<Tab>('integrity');

  // 完整性
  const [integrityReport, setIntegrityReport] = useState<IntegrityReport | null>(null);
  const [integrityLoading, setIntegrityLoading] = useState(false);
  const [integrityFilter, setIntegrityFilter] = useState<'all' | 'error' | 'warning' | 'info'>('all');

  // 模擬
  const [strategy, setStrategy] = useState<SimStrategy>('random');
  const [runCount, setRunCount] = useState(5);
  const [forceUnlock, setForceUnlock] = useState(true);
  const [simResults, setSimResults] = useState<SimResult[]>([]);
  const [simLoading, setSimLoading] = useState(false);
  const [simProgress, setSimProgress] = useState(0);

  // ── 完整性檢查 ──────────────────────────────────────────────

  const handleIntegrityCheck = useCallback(async () => {
    setIntegrityLoading(true);
    try {
      const runner = getRunner();
      await runner.loadAllChapterData();
      const report = runner.checkIntegrity();
      setIntegrityReport(report);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIntegrityLoading(false);
    }
  }, []);

  // ── 模擬演練 ──────────────────────────────────────────────

  const handleRunSimulation = useCallback(async () => {
    setSimLoading(true);
    setSimProgress(0);
    setSimResults([]);
    try {
      const runner = getRunner();
      const results = await runner.runBatch(
        runCount,
        { strategy, forceUnlock },
        (done, total) => setSimProgress(Math.round((done / total) * 100))
      );
      setSimResults(results);
      setTab('stats');
    } catch (e: any) {
      console.error(e);
    } finally {
      setSimLoading(false);
      setSimProgress(100);
    }
  }, [strategy, runCount, forceUnlock]);

  // ── 篩選完整性問題 ──────────────────────────────────────────

  const filteredIssues = integrityReport?.issues.filter((i) =>
    integrityFilter === 'all' ? true : i.severity === integrityFilter
  ) ?? [];

  // ── 統計 ────────────────────────────────────────────────────

  const stats = simResults.length > 0 ? SimulationRunner.analyzeResults(simResults) : null;

  // ── 渲染 ────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0d1117] text-white font-sans">
      {/* 頂部標題 */}
      <div className="border-b border-white/10 px-6 py-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-amber-400" />
          <h1 className="text-lg font-bold tracking-tight">KK 模擬演練 · 測試中心</h1>
        </div>
        <span className="text-white/30 text-sm">/dev/simulate</span>
        <a
          href="/"
          className="ml-auto text-xs text-white/40 hover:text-white/70 transition-colors border border-white/10 rounded-lg px-3 py-1.5"
        >
          ← 返回遊戲
        </a>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* 分頁 Tab */}
        <div className="flex gap-1 border border-white/10 rounded-xl p-1 bg-white/3 w-fit">
          {([
            { id: 'integrity', label: '資料完整性', icon: Shield },
            { id: 'simulate',  label: '模擬演練',   icon: Play },
            { id: 'stats',     label: '統計結果',   icon: BarChart3 },
          ] as const).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === id
                  ? 'bg-white/15 text-white shadow'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* ── Tab: 資料完整性 ───────────────────────────────── */}
        {tab === 'integrity' && (
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <h2 className="text-base font-semibold text-white mb-1">資料完整性檢查</h2>
                <p className="text-sm text-white/50">靜態分析全 6 章遊戲資料，找出事件/道具/對話節點的引用錯誤</p>
              </div>
              <button
                onClick={handleIntegrityCheck}
                disabled={integrityLoading}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors shrink-0"
              >
                {integrityLoading
                  ? <RefreshCw size={14} className="animate-spin" />
                  : <Shield size={14} />}
                {integrityLoading ? '分析中…' : '開始檢查'}
              </button>
            </div>

            {integrityReport && (
              <>
                {/* 摘要卡片 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: '錯誤', count: integrityReport.summary.errors,   color: 'text-red-400',    bg: 'bg-red-900/20',    filter: 'error' as const },
                    { label: '警告', count: integrityReport.summary.warnings, color: 'text-amber-400',  bg: 'bg-amber-900/20',  filter: 'warning' as const },
                    { label: '資訊', count: integrityReport.summary.info,     color: 'text-sky-400',    bg: 'bg-sky-900/20',    filter: 'info' as const },
                    { label: '合計', count: integrityReport.summary.total,    color: 'text-white/80',   bg: 'bg-white/5',       filter: 'all' as const },
                  ].map(({ label, count, color, bg, filter: f }) => (
                    <button
                      key={label}
                      onClick={() => setIntegrityFilter(f)}
                      className={`${bg} border ${
                        integrityFilter === f ? 'border-white/30' : 'border-white/10'
                      } rounded-xl p-3 text-left transition-all hover:border-white/20`}
                    >
                      <div className={`text-2xl font-bold ${color} mb-0.5`}>{count}</div>
                      <div className="text-xs text-white/40">{label}</div>
                    </button>
                  ))}
                </div>

                {integrityReport.summary.errors === 0 && integrityReport.summary.warnings === 0 && (
                  <div className="flex items-center gap-3 p-4 bg-emerald-900/20 border border-emerald-700/40 rounded-xl">
                    <CheckCircle size={18} className="text-emerald-400 shrink-0" />
                    <p className="text-emerald-300 text-sm">太好了！所有 {integrityReport.chaptersChecked.length} 章資料均通過完整性檢查，無嚴重問題。</p>
                  </div>
                )}

                {/* 問題列表 */}
                {filteredIssues.length > 0 && (
                  <Section title={`問題列表（${filteredIssues.length} 項）`}>
                    <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                      {filteredIssues.map((issue, i) => (
                        <IntegrityIssueRow key={i} issue={issue} />
                      ))}
                    </div>
                  </Section>
                )}

                <p className="text-xs text-white/30 text-right">
                  已檢查 {integrityReport.chaptersChecked.join('、')} · {integrityReport.checkedAt}
                </p>
              </>
            )}
          </div>
        )}

        {/* ── Tab: 模擬演練 ───────────────────────────────── */}
        {tab === 'simulate' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold text-white mb-1">模擬演練設定</h2>
              <p className="text-sm text-white/50">在 GameEngine 層模擬玩家操作，測試各種路徑是否能正確運行</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* 策略選擇 */}
              <Section title="操作策略">
                <div className="space-y-2">
                  {(Object.entries(strategyConfig) as [SimStrategy, typeof strategyConfig[SimStrategy]][]).map(([key, cfg]) => (
                    <label
                      key={key}
                      className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        strategy === key
                          ? 'border-white/30 bg-white/8'
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <input
                        type="radio"
                        name="strategy"
                        value={key}
                        checked={strategy === key}
                        onChange={() => setStrategy(key)}
                        className="mt-0.5 accent-amber-400"
                      />
                      <div>
                        <div className={`text-sm font-medium ${cfg.color}`}>{cfg.label}</div>
                        <div className="text-xs text-white/40 mt-0.5">{cfg.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </Section>

              {/* 執行設定 */}
              <div className="space-y-4">
                <Section title="執行設定">
                  <div className="space-y-4">
                    {/* 執行次數 */}
                    <div>
                      <label className="text-sm text-white/60 block mb-2">模擬次數</label>
                      <div className="flex gap-2">
                        {[1, 3, 5, 10, 20].map((n) => (
                          <button
                            key={n}
                            onClick={() => setRunCount(n)}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                              runCount === n
                                ? 'bg-white/15 border-white/30 text-white'
                                : 'border-white/10 text-white/40 hover:text-white/70'
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 強制解鎖 */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div
                        onClick={() => setForceUnlock(!forceUnlock)}
                        className={`w-10 h-6 rounded-full transition-all relative ${
                          forceUnlock ? 'bg-amber-500' : 'bg-white/20'
                        }`}
                      >
                        <span
                          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                            forceUnlock ? 'left-5' : 'left-1'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="text-sm text-white/80">強制解鎖場景</div>
                        <div className="text-xs text-white/40">即使條件未滿足，也強制進入所有場景（測試全部內容）</div>
                      </div>
                    </label>
                  </div>
                </Section>

                {/* 說明卡片 */}
                <div className="p-4 bg-white/3 border border-white/10 rounded-xl space-y-2 text-xs text-white/50">
                  <p className="flex items-center gap-2"><Shield size={12} className="text-amber-400" /> 完整性檢查可單獨使用，不需要先執行模擬</p>
                  <p className="flex items-center gap-2"><Play size={12} className="text-sky-400" /> 模擬在 GameEngine 層執行，不影響你的遊戲存檔</p>
                  <p className="flex items-center gap-2"><BarChart3 size={12} className="text-emerald-400" /> 結局由 ch5 D6 選擇 + ch6 D7 選擇 + 林子睿對話決定</p>
                </div>
              </div>
            </div>

            {/* 執行按鈕 */}
            <button
              onClick={handleRunSimulation}
              disabled={simLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 bg-gradient-to-r from-violet-700 to-indigo-700 hover:from-violet-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold text-sm transition-all"
            >
              {simLoading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  模擬中… {simProgress}%
                </>
              ) : (
                <>
                  <Play size={16} />
                  執行 {runCount} 次模擬（策略：{strategyConfig[strategy].label}）
                </>
              )}
            </button>

            {simLoading && (
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-300 rounded-full"
                  style={{ width: `${simProgress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {/* ── Tab: 統計結果 ───────────────────────────────── */}
        {tab === 'stats' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-white mb-1">統計結果</h2>
                <p className="text-sm text-white/50">
                  {simResults.length > 0 ? `${simResults.length} 次模擬完成` : '尚未執行模擬'}
                </p>
              </div>
              {simResults.length > 0 && (
                <button
                  onClick={() => { setTab('simulate'); setSimResults([]); }}
                  className="text-xs text-white/40 hover:text-white/70 border border-white/10 rounded-lg px-3 py-1.5"
                >
                  清除結果
                </button>
              )}
            </div>

            {simResults.length === 0 && (
              <div className="text-center py-16 text-white/30">
                <Play size={32} className="mx-auto mb-4 opacity-40" />
                <p className="text-sm">前往「模擬演練」頁面執行測試</p>
              </div>
            )}

            {stats && (
              <>
                {/* 總覽卡片 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="text-2xl font-bold text-white mb-0.5">{simResults.length}</div>
                    <div className="text-xs text-white/40">執行次數</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className={`text-2xl font-bold mb-0.5 ${stats.errorRate === 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                      {Math.round(stats.errorRate * 100)}%
                    </div>
                    <div className="text-xs text-white/40">有錯誤的比例</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="text-2xl font-bold text-sky-400 mb-0.5">{stats.avgDuration}</div>
                    <div className="text-xs text-white/40">平均時間 (ms)</div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <div className="text-2xl font-bold text-amber-400 mb-0.5">{stats.warningCount}</div>
                    <div className="text-xs text-white/40">總警告數</div>
                  </div>
                </div>

                {/* 結局分佈 */}
                <Section title="結局分佈" icon={<BarChart3 size={14} className="text-emerald-400" />}>
                  <div className="space-y-2">
                    {Object.entries(stats.endingDistribution)
                      .sort((a, b) => b[1] - a[1])
                      .map(([label, count]) => {
                        const pct = Math.round((count / simResults.length) * 100);
                        const color = endingColors[label] ?? 'text-slate-400';
                        return (
                          <div key={label} className="flex items-center gap-3">
                            <div className={`text-sm font-medium w-48 shrink-0 ${color}`}>{label}</div>
                            <div className="flex-1 h-6 bg-white/5 rounded-lg overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <div className="text-sm text-white/60 w-20 text-right shrink-0">
                              {count} 次 ({pct}%)
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </Section>

                {/* 常見錯誤 */}
                {stats.commonErrors.length > 0 && (
                  <Section title="常見錯誤（Top 5）" icon={<XCircle size={14} className="text-red-400" />}>
                    <div className="space-y-2">
                      {stats.commonErrors.map((e, i) => (
                        <div key={i} className="text-xs text-red-300 bg-red-900/20 rounded-lg p-2.5 border border-red-800/30">
                          {e}
                        </div>
                      ))}
                    </div>
                  </Section>
                )}
              </>
            )}

            {/* 各次結果 */}
            {simResults.length > 0 && (
              <Section title={`各次演練詳情（${simResults.length} 次）`}>
                <div className="space-y-2">
                  {simResults.map((r, i) => (
                    <SimResultCard key={r.runId} result={r} index={i} />
                  ))}
                </div>
              </Section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
