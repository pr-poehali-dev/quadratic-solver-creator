import { useState } from "react";
import Icon from "@/components/ui/icon";

interface Step {
  title: string;
  content: string;
  formula?: string;
}

interface Solution {
  discriminant: number;
  roots: number[];
  steps: Step[];
  type: "two" | "one" | "none";
}

function solve(a: number, b: number, c: number): Solution {
  const steps: Step[] = [];

  steps.push({
    title: "Запись уравнения",
    content: `Дано уравнение вида ax² + bx + c = 0, где a = ${a}, b = ${b}, c = ${c}`,
    formula: `${a}x² ${b >= 0 ? "+" : ""}${b}x ${c >= 0 ? "+" : ""}${c} = 0`,
  });

  steps.push({
    title: "Вычисление дискриминанта",
    content: `Дискриминант — это выражение D = b² − 4ac. Он показывает, сколько корней имеет уравнение.`,
    formula: `D = ${b}² − 4 · ${a} · ${c} = ${b * b} − ${4 * a * c} = ${b * b - 4 * a * c}`,
  });

  const D = b * b - 4 * a * c;

  if (D > 0) {
    const sqrtD = Math.sqrt(D);
    const x1 = (-b + sqrtD) / (2 * a);
    const x2 = (-b - sqrtD) / (2 * a);

    steps.push({
      title: "Анализ дискриминанта",
      content: `D = ${D} > 0, значит уравнение имеет два различных вещественных корня.`,
    });

    steps.push({
      title: "Нахождение первого корня",
      content: `Применяем формулу корней квадратного уравнения: x = (−b ± √D) / (2a)`,
      formula: `x₁ = (−${b} + √${D}) / (2 · ${a}) = (${-b} + ${sqrtD.toFixed(4)}) / ${2 * a} = ${x1.toFixed(4)}`,
    });

    steps.push({
      title: "Нахождение второго корня",
      content: `Используем ту же формулу, но с противоположным знаком перед √D`,
      formula: `x₂ = (−${b} − √${D}) / (2 · ${a}) = (${-b} − ${sqrtD.toFixed(4)}) / ${2 * a} = ${x2.toFixed(4)}`,
    });

    steps.push({
      title: "Проверка корней",
      content: `Подставляем найденные значения обратно в уравнение для проверки.`,
      formula: `x₁ = ${+x1.toFixed(6)},  x₂ = ${+x2.toFixed(6)}`,
    });

    return { discriminant: D, roots: [+x1.toFixed(6), +x2.toFixed(6)], steps, type: "two" };
  } else if (D === 0) {
    const x = -b / (2 * a);

    steps.push({
      title: "Анализ дискриминанта",
      content: `D = 0, значит уравнение имеет ровно один корень (два совпадающих корня).`,
    });

    steps.push({
      title: "Нахождение корня",
      content: `При D = 0 формула упрощается: x = −b / (2a)`,
      formula: `x = −${b} / (2 · ${a}) = ${-b} / ${2 * a} = ${x}`,
    });

    return { discriminant: D, roots: [x], steps, type: "one" };
  } else {
    steps.push({
      title: "Анализ дискриминанта",
      content: `D = ${D} < 0 — дискриминант отрицательный. Квадратный корень из отрицательного числа в вещественных числах не существует.`,
    });

    steps.push({
      title: "Вывод",
      content: `Уравнение не имеет вещественных корней. В области комплексных чисел корни существуют, но в школьной программе уравнение считается не имеющим решений.`,
    });

    return { discriminant: D, roots: [], steps, type: "none" };
  }
}

function formatCoeff(val: string): number {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
}

const EXAMPLES = [
  { a: "1", b: "-5", c: "6", label: "x² − 5x + 6 = 0" },
  { a: "1", b: "2", c: "1", label: "x² + 2x + 1 = 0" },
  { a: "1", b: "0", c: "4", label: "x² + 4 = 0" },
];

export default function Index() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [solution, setSolution] = useState<Solution | null>(null);
  const [error, setError] = useState("");
  const [solvedKey, setSolvedKey] = useState(0);

  function handleSolve() {
    setError("");
    const av = formatCoeff(a);
    if (av === 0) {
      setError("Коэффициент a не может быть равен нулю — это уже не квадратное уравнение.");
      setSolution(null);
      return;
    }
    const result = solve(av, formatCoeff(b), formatCoeff(c));
    setSolution(result);
    setSolvedKey((k) => k + 1);
  }

  function handleExample(ex: { a: string; b: string; c: string }) {
    setA(ex.a);
    setB(ex.b);
    setC(ex.c);
    setError("");
    const result = solve(formatCoeff(ex.a), formatCoeff(ex.b), formatCoeff(ex.c));
    setSolution(result);
    setSolvedKey((k) => k + 1);
  }

  function handleReset() {
    setA("");
    setB("");
    setC("");
    setSolution(null);
    setError("");
  }

  const rootColor =
    solution?.type === "two"
      ? "text-emerald-700"
      : solution?.type === "one"
      ? "text-amber-700"
      : "text-red-600";

  return (
    <div className="min-h-screen bg-[#FAFAF8] font-sans text-[#1a1a1a]">
      {/* Header */}
      <header className="border-b border-[#E8E8E4] px-6 py-5 flex items-center justify-between max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#888] tracking-widest uppercase">ax² + bx + c = 0</span>
        </div>
        <h1 className="text-sm font-medium text-[#444] tracking-wide">Квадратные уравнения</h1>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 animate-fade-in">
        {/* Hero */}
        <div className="mb-14">
          <h2 className="text-4xl font-light leading-tight text-[#111] mb-4 tracking-tight">
            Решите уравнение<br />
            <span className="font-semibold">с объяснением</span>
          </h2>
          <p className="text-[#777] text-base leading-relaxed max-w-md">
            Введите коэффициенты — получите пошаговое решение с разбором каждого действия.
          </p>
        </div>

        {/* Input Card */}
        <div className="bg-white border border-[#E8E8E4] rounded-2xl p-8 mb-6 shadow-sm">
          <p className="text-xs uppercase tracking-widest text-[#aaa] mb-6 font-medium">Коэффициенты уравнения</p>

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "a", value: a, set: setA, hint: "при x²" },
              { label: "b", value: b, set: setB, hint: "при x" },
              { label: "c", value: c, set: setC, hint: "свободный" },
            ].map(({ label, value, set, hint }) => (
              <div key={label}>
                <label className="block text-xs text-[#aaa] mb-1.5 font-medium">{hint}</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-[#bbb] select-none">
                    {label} =
                  </span>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSolve()}
                    placeholder="0"
                    className="w-full pl-10 pr-3 py-3 border border-[#E0E0DC] rounded-xl font-mono text-sm bg-[#FAFAF8] text-[#111] focus:outline-none focus:border-[#111] focus:bg-white transition-colors placeholder:text-[#ccc]"
                  />
                </div>
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 text-red-600 text-sm bg-red-50 rounded-xl px-4 py-3">
              <Icon name="AlertCircle" size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleSolve}
              className="flex-1 bg-[#111] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#333] transition-colors flex items-center justify-center gap-2"
            >
              <Icon name="Calculator" size={15} />
              Решить
            </button>
            {solution && (
              <button
                onClick={handleReset}
                className="px-5 py-3 border border-[#E0E0DC] rounded-xl text-sm text-[#888] hover:border-[#ccc] hover:text-[#444] transition-colors"
              >
                Сбросить
              </button>
            )}
          </div>
        </div>

        {/* Examples */}
        <div className="flex items-center gap-3 mb-12 flex-wrap">
          <span className="text-xs text-[#bbb] uppercase tracking-widest">Примеры:</span>
          {EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              onClick={() => handleExample(ex)}
              className="font-mono text-xs px-3 py-1.5 border border-[#E8E8E4] rounded-lg text-[#888] hover:border-[#111] hover:text-[#111] transition-colors bg-white"
            >
              {ex.label}
            </button>
          ))}
        </div>

        {/* Solution */}
        {solution && (
          <div key={solvedKey} className="animate-slide-up">
            {/* Result banner */}
            <div className={`rounded-2xl border p-6 mb-8 ${
              solution.type === "two" ? "bg-emerald-50 border-emerald-200" :
              solution.type === "one" ? "bg-amber-50 border-amber-200" :
              "bg-red-50 border-red-200"
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <Icon
                  name={solution.type === "none" ? "XCircle" : "CheckCircle2"}
                  size={18}
                  className={rootColor}
                />
                <span className={`text-sm font-medium ${rootColor}`}>
                  {solution.type === "two" && "Два корня"}
                  {solution.type === "one" && "Один корень"}
                  {solution.type === "none" && "Корней нет"}
                </span>
              </div>
              {solution.roots.length > 0 && (
                <div className="flex gap-6">
                  {solution.roots.map((r, i) => (
                    <div key={i}>
                      <span className="text-xs text-[#aaa] font-mono">x{solution.roots.length > 1 ? (i === 0 ? "₁" : "₂") : ""}</span>
                      <div className={`text-3xl font-light font-mono ${rootColor}`}>{r}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Steps */}
            <div>
              <p className="text-xs uppercase tracking-widest text-[#aaa] mb-5 font-medium">Пошаговое решение</p>
              <div className="space-y-4">
                {solution.steps.map((step, i) => (
                  <div
                    key={i}
                    className="border border-[#E8E8E4] rounded-xl p-5 bg-white animate-step-in"
                    style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}
                  >
                    <div className="flex items-start gap-4">
                      <span className="shrink-0 w-6 h-6 rounded-full bg-[#F0F0EC] text-[#888] text-xs font-mono flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#111] mb-1">{step.title}</p>
                        <p className="text-sm text-[#777] leading-relaxed mb-2">{step.content}</p>
                        {step.formula && (
                          <div className="mt-3 px-4 py-2.5 bg-[#F5F5F2] rounded-lg font-mono text-sm text-[#333] overflow-x-auto">
                            {step.formula}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-3xl mx-auto px-6 py-8 mt-8 border-t border-[#E8E8E4]">
        <p className="text-xs text-[#ccc] text-center">ax² + bx + c = 0</p>
      </footer>
    </div>
  );
}
