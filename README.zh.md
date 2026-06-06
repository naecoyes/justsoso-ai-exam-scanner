# AI 拍照答题

<img src="public/icons/app-icon.svg" width="80" height="80" alt="Logo">

### 项目简介

一款现代化的 AI 拍照答题工具，专为移动端浏览器设计。拍照或上传题目图片，即可获得由小米 MiMo API 提供的即时答案和解析。

### 功能特点

- **相机扫描**：实时相机访问，支持自动扫描定时器
- **题库导入**：导入自定义题库（支持 JSON、CSV、TXT、MD 格式）
- **中英双语**：支持中英文界面切换
- **历史记录**：记录扫描历史，支持缩略图预览
- **模型设置**：配置 API Key、Base URL 和模型名称
- **现代 UI**：简洁极简设计，毛玻璃效果

### 界面截图

<p align="center">
  <img src="public/screenshots/mobile_main.jpg" width="250" alt="手机主界面">
  &nbsp;&nbsp;
  <img src="public/screenshots/mobile_scanning.jpg" width="250" alt="手机扫描界面">
</p>

### 快速开始

#### 本地开发

```bash
npm install
npm run dev
```

访问 `http://localhost:3000`。移动端相机需要 HTTPS。

#### Docker 部署

```bash
# 复制环境配置文件
cp .env.example .env.local

# 编辑 .env.local，填入你的 API Key
# MIMO_API_KEY=your_api_key_here

# 构建并运行
docker compose up -d --build
```

访问 `https://localhost:8443`

### 环境变量

复制 `.env.example` 到 `.env.local`：

```bash
MIMO_API_KEY=你的API密钥
MIMO_BASE_URL=https://token-plan-sgp.xiaomimimo.com/v1
MIMO_MODEL=mimo-v2.5
```

### 题库格式

支持多种格式：

#### JSON
```json
[
  {
    "question": "1+1等于多少？",
    "answer": "2",
    "explanation": "基础算术"
  }
]
```

#### CSV
```csv
question,answer,explanation
"1+1等于多少？","2","基础算术"
```

#### TXT/MD
```
1. 1+1等于多少？
A. 1
B. 2
C. 3
D. 4
答案：B
解析：基础算术
```

### HTTPS 证书

本地 HTTPS 开发：

```bash
npm run dev:https
```

手机浏览器访问时会提示证书不受信任，点击「高级」或「继续访问」即可，无需安装任何描述文件。

### 技术栈

- React 18
- Vite
- Tailwind CSS
- Lucide Icons
- Node.js

## 许可证

MIT