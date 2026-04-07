import { useState, useMemo, useCallback } from "react";
import type { InputVariable, Locale } from "../types";

interface Props {
  systemPrompt: string;
  userTemplate: string;
  variables: InputVariable[];
  locale: Locale;
}

const L = {
  en: {
    oneClick: "Copy Full Prompt",
    oneClickSub: "Paste into any AI chat — works with ChatGPT, Claude, Gemini, etc.",
    copied: "Copied!",
    fillVars: "Fill in your details (optional — copy first, fill later is fine too)",
    required: "required",
    optional: "optional",
    preview: "Preview",
    previewHint: "This is what will be copied to your clipboard",
    advanced: "Advanced: separate system prompt & user template",
    copySystem: "Copy System Prompt",
    copyUser: "Copy User Template",
    systemLabel: "System Prompt",
    userLabel: "User Prompt Template",
    advancedHint: "For Custom GPTs, API calls, or tools that support separate system prompts.",
  },
  zh: {
    oneClick: "一键复制完整提示词",
    oneClickSub: "粘贴到任意 AI 对话框即可使用 — 支持 ChatGPT、Claude、Gemini 等",
    copied: "已复制！",
    fillVars: "填写您的信息（可选 — 也可以先复制再填写）",
    required: "必填",
    optional: "选填",
    preview: "预览",
    previewHint: "以下内容将被复制到剪贴板",
    advanced: "进阶：分别复制系统提示词和用户模板",
    copySystem: "复制系统提示词",
    copyUser: "复制用户提示词模板",
    systemLabel: "系统提示词",
    userLabel: "用户提示词模板",
    advancedHint: "适用于 Custom GPTs、API 调用或支持单独设置系统提示词的工具。",
  },
} as const;

function buildMergedPrompt(systemPrompt: string, userTemplate: string, values: Record<string, string>, locale: Locale) {
  let user = userTemplate;
  for (const [k, v] of Object.entries(values)) {
    if (v.trim()) {
      user = user.replaceAll(`{{${k}}}`, v);
      const defaultRe = new RegExp(`\\{\\{${k}\\s*\\|\\s*default:\\s*"[^"]*"\\}\\}`, "g");
      user = user.replace(defaultRe, v);
    }
  }

  if (!userTemplate) return systemPrompt;

  const divider = locale === "zh"
    ? "\n\n---\n\n请根据以上角色设定，完成以下任务：\n\n"
    : "\n\n---\n\nBased on the above role and instructions, please complete the following task:\n\n";

  return systemPrompt + divider + user;
}

export default function PromptComposer({ systemPrompt, userTemplate, variables, locale }: Props) {
  const l = L[locale];
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const v of variables) init[v.name] = "";
    return init;
  });
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedSys, setCopiedSys] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const merged = useMemo(
    () => buildMergedPrompt(systemPrompt, userTemplate, values, locale),
    [systemPrompt, userTemplate, values, locale],
  );

  const copyText = useCallback((text: string, setter: (v: boolean) => void) => {
    navigator.clipboard.writeText(text).then(() => {
      setter(true);
      setTimeout(() => setter(false), 1500);
    });
  }, []);

  return (
    <div className="space-y-5">
      {/* ── Primary CTA ── */}
      <div className="rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-5 dark:border-blue-900 dark:from-blue-950/50 dark:to-indigo-950/50">
        <button
          onClick={() => copyText(merged, setCopiedMain)}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-md transition hover:bg-blue-700 active:scale-[0.98] dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {copiedMain ? (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {l.copied}
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x={9} y={9} width={13} height={13} rx={2} strokeWidth={2} />
                <path strokeWidth={2} d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              {l.oneClick}
            </>
          )}
        </button>
        <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">{l.oneClickSub}</p>
      </div>

      {/* ── Variable form ── */}
      {variables.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-400">{l.fillVars}</h3>
          <div className="space-y-3">
            {variables.map((v) => (
              <div key={v.name}>
                <div className="mb-1 flex items-center gap-2">
                  <label className="text-sm font-medium" htmlFor={`var-${v.name}`}>
                    {v.description || v.name}
                  </label>
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${v.required ? "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400" : "bg-gray-100 text-gray-500 dark:bg-gray-800"}`}>
                    {v.required ? l.required : l.optional}
                  </span>
                </div>
                <textarea
                  id={`var-${v.name}`}
                  rows={2}
                  placeholder={v.example || `{{${v.name}}}`}
                  value={values[v.name] || ""}
                  onChange={(e) => setValues((prev) => ({ ...prev, [v.name]: e.target.value }))}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-800 dark:focus:border-blue-500 dark:focus:ring-blue-900"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Preview toggle ── */}
      <div className="rounded-xl border border-gray-200 dark:border-gray-800">
        <button
          onClick={() => setPreviewOpen((o) => !o)}
          className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50"
        >
          <svg className={`h-4 w-4 transition-transform ${previewOpen ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeWidth={2} d="m9 5 7 7-7 7" />
          </svg>
          {l.preview}
          <span className="ml-1 text-xs text-gray-400">— {l.previewHint}</span>
        </button>
        {previewOpen && (
          <pre className="max-h-80 overflow-auto border-t border-gray-200 bg-gray-50 p-4 text-xs leading-relaxed dark:border-gray-800 dark:bg-gray-900">
            {merged}
          </pre>
        )}
      </div>

      {/* ── Advanced: split copy ── */}
      <div className="rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
        <button
          onClick={() => setAdvancedOpen((o) => !o)}
          className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-gray-500 transition hover:bg-gray-50 dark:text-gray-500 dark:hover:bg-gray-800/50"
        >
          <svg className={`h-4 w-4 transition-transform ${advancedOpen ? "rotate-90" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeWidth={2} d="m9 5 7 7-7 7" />
          </svg>
          {l.advanced}
        </button>
        {advancedOpen && (
          <div className="space-y-4 border-t border-dashed border-gray-300 p-4 dark:border-gray-700">
            <p className="text-xs text-gray-400">{l.advancedHint}</p>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">{l.systemLabel}</span>
                <button
                  onClick={() => copyText(systemPrompt, setCopiedSys)}
                  className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium transition hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                  {copiedSys ? l.copied : l.copySystem}
                </button>
              </div>
              <pre className="max-h-48 overflow-auto rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs leading-relaxed dark:border-gray-800 dark:bg-gray-900">
                {systemPrompt}
              </pre>
            </div>
            {userTemplate && (
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-semibold">{l.userLabel}</span>
                  <button
                    onClick={() => copyText(userTemplate, setCopiedUser)}
                    className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium transition hover:bg-gray-50 active:scale-95 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    {copiedUser ? l.copied : l.copyUser}
                  </button>
                </div>
                <pre className="max-h-48 overflow-auto rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs leading-relaxed dark:border-blue-900 dark:bg-blue-950">
                  {userTemplate}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
