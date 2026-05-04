import { useState, useCallback } from 'react';
import { useChat } from '@ai-sdk/react';
import { ChatSection } from '@llamaindex/chat-ui';

const BLOG_POST = {
  title: '我的技术博客',
  subtitle: 'AI 聊天组件集成演示',
  body: [
    '这是一个使用 @llamaindex/chat-ui 和 Vercel AI SDK 构建的智能聊天组件。点击右下角的按钮即可打开 AI 助手对话窗口。',
    '该组件基于 React 19 + Vite 6 构建，采用 LlamaIndex 官方提供的 ChatSection 一站式聊天 UI 组件，配合 AI SDK 的 useChat Hook 实现流式对话体验。',
  ],
  features: [
    'LlamaIndex ChatSection 官方 UI 组件',
    'Vercel AI SDK useChat 流式响应',
    'SSE 服务端推送模拟',
    '开箱即用的演示模式',
    '简约清新的 UI 设计',
    '可嵌入任何 React 页面',
  ],
};

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  const handler = useChat({
    api: '/api/chat',
    onError: (err) => console.error('Chat error:', err),
  });

  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ============================================ */}
      {/*              博客内容                         */}
      {/* ============================================ */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">{BLOG_POST.title}</h1>
        <p className="text-slate-400 mb-8">{BLOG_POST.subtitle}</p>

        <article className="space-y-4 text-slate-600 leading-relaxed">
          {BLOG_POST.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          <div className="bg-white rounded-lg p-5 shadow-sm border border-slate-200 mt-6">
            <h3 className="font-semibold text-slate-700 mb-2">核心特性</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-500 text-sm">
              {BLOG_POST.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>

          <p className="text-slate-400 text-sm !mt-8">
            点击右下角的按钮，和 AI 助手聊聊天吧。
          </p>
        </article>
      </div>

      {/* ============================================ */}
      {/*            浮动触发按钮                       */}
      {/* ============================================ */}
      <button
        onClick={toggle}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-indigo-500
                   text-white flex items-center justify-center z-50
                   shadow-lg shadow-indigo-500/25
                   hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-500/30
                   active:scale-95 transition-all duration-200"
        aria-label={isOpen ? '关闭聊天' : '打开聊天'}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
          </svg>
        )}
      </button>

      {/* ============================================ */}
      {/*            聊天面板（始终挂载，保持状态）      */}
      {/* ============================================ */}
      <div
        className={`fixed bottom-24 right-8 w-[440px] h-[640px] z-40
                    transition-all duration-300 ease-out
                    ${isOpen
                      ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
                      : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
                    }`}
      >
        <div className="w-full h-full bg-white rounded-2xl overflow-hidden
                        border border-slate-200 shadow-xl shadow-slate-200/50 flex flex-col">
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 2a7 7 0 017 7c0 2.9-1.8 5.4-4.3 6.5L12 22l-2.7-6.5A7 7 0 015 9a7 7 0 017-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-slate-800 text-sm">AI 助手</h3>
                <p className="text-xs text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  在线
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center
                         text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="关闭"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* ChatSection —— @llamaindex/chat-ui 官方组件 */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <ChatSection handler={handler} />
          </div>
        </div>
      </div>
    </div>
  );
}
