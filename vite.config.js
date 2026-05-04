import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Mock 流式 API —— 返回 SSE 演示数据
function mockChatAPI() {
  const DEMO_TEXT = `你好！感谢你的提问 👋

我是这个博客站点集成的 AI 助手。以下是对你问题的回答：

首先，这个聊天组件使用了 LlamaIndex 官方提供的 @llamaindex/chat-ui 组件库，它基于 shadcn/ui 和 Tailwind CSS 构建，提供了开箱即用的高质量聊天界面。

其次，聊天采用了 Vercel AI SDK 的 useChat Hook 来管理消息状态和流式响应。你在界面上看到的每一段文字，都是通过 SSE（Server-Sent Events）协议从后端逐字传输过来的，实现了 LLM 实时流式输出的体验。

关于你提出的问题，以下是一个清晰的回复框架：

📌 核心要点
- 组件基于 React 19 + Vite 6 构建，支持现代浏览器
- 使用 @llamaindex/chat-ui 的 ChatSection 一站式组件
- 流式响应基于 AI SDK 的 useChat + SSE 协议
- 演示模式下使用 Vite 插件模拟后端 API

🔧 技术栈
- React 19 + Vite 6（构建工具）
- Tailwind CSS 3（样式框架）
- @llamaindex/chat-ui（聊天 UI 组件库）
- @ai-sdk/react（AI SDK React 集成）
- Vite Plugin（Mock API 中间件）

🎨 设计风格
- 简约清新的配色方案
- 统一的文字间距和行距
- 清晰的段落分隔
- 响应式布局适配

如需接入真实后端，只需修改 vite.config.js 中的 API 代理配置，或将 useChat 指向真实的后端 API 地址即可。

还有其他问题吗？我随时为你解答！`;

  return {
    name: 'mock-chat-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/chat' && req.method === 'POST') {
          // 读取请求体
          const chunks = [];
          for await (const chunk of req) {
            chunks.push(chunk);
          }
          const body = JSON.parse(Buffer.concat(chunks).toString());
          const userMessage = body.messages?.at(-1)?.content || '';

          // 根据用户输入长度选择响应
          const responseText = userMessage.length < 20 ? DEMO_TEXT : DEMO_TEXT.split('\n\n').slice(0, 3).join('\n\n');

          // 设置 SSE 响应头
          res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
          });

          // 模拟流式输出 —— 逐 chunk 发送
          const chars = [...responseText];
          let i = 0;

          const sendChunk = () => {
            if (i >= chars.length) {
              res.write('data: [DONE]\n\n');
              res.end();
              return;
            }
            // 每次发送 1-4 个字符
            const size = Math.floor(Math.random() * 3) + 1;
            const chunk = chars.slice(i, i + size).join('');
            i += size;

            res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);

            const jitter = (Math.random() - 0.5) * 16;
            setTimeout(sendChunk, 28 + jitter);
          };

          // 初始延迟，模拟思考时间
          setTimeout(sendChunk, 600);
          return;
        }

        // CORS 预检
        if (req.url === '/api/chat' && req.method === 'OPTIONS') {
          res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
          });
          res.end();
          return;
        }

        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), mockChatAPI()],
});
