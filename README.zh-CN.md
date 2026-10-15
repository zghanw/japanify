# japanify

[English / 日本語](README.md) | **简体中文**

一个面向 AI 编程代理的技能（Agent Skill）：按照日本用户习惯的方式构建网站和 Web 应用，或把现有网站改造成日本风格。所有规则都来自对日本访问量最高的 10 个网站的实测数据，而不是对“日式风格”的想象。

| 改造前：典型的欧美 SaaS 页面 | 改造后：japanify |
|---|---|
| ![改造前的欧美 SaaS 落地页](docs/images/before-western-desktop.jpg) | ![使用 japanify 改造后的同一产品](docs/images/after-japanify-desktop.jpg) |

<sub>Flowdesk 是用于测试的虚构产品。</sub>

---

## 为什么需要它

让 AI 代理做一个“日本网站”，结果通常是两种之一：把欧美落地页直接翻译成日语，或者做成满是樱花和毛笔字的观光海报。这两种都不像日本人日常使用的网站。真正的日本网站是这样的：字号偏小、字间不加空隙（ベタ組み）、信息密集且链接很多、正文用深灰而不是纯黑、标题用色条或横线区分、价格标注“税込”（含税）、表单有“フリガナ”（假名读音）和根据邮编自动填写地址、页脚列满公司信息和法律声明。

japanify 把这些惯例以具体的数值、页面结构、组件 CSS、表单代码、检查工具和测量工具的形式交给代理。

## 作品示例

以下页面由代理仅使用本技能制作。公司、人物和数据均为虚构。

| 地区门户网站 | 牙科诊所 |
|---|---|
| ![地区门户网站首页](docs/images/qa-portal-desktop.jpg) | ![牙科诊所首页](docs/images/qa-clinic-desktop.jpg) |
| **日本茶网店** | **手机端** |
| ![日本茶网店首页](docs/images/qa-tea-shop-desktop.jpg) | <img src="docs/images/qa-portal-mobile.jpg" alt="iPhone 上的地区门户网站" width="49%"> <img src="docs/images/qa-clinic-mobile.jpg" alt="iPhone 上的牙科诊所" width="49%"> |

## 涵盖内容

| 领域 | 内容 |
|---|---|
| 排版 | 系统字体栈、三种排版模式（高密度界面、落地页、长文阅读）、`palt`、换行规则、竖排、注音（ルビ） |
| 布局 | 7 种页面类型（门户、电商、文章、数据工具、企业与 B2B 落地页、本地店铺、社区），包括宽度、信息密度目标、区块顺序和手机端页头 |
| 组件 | 公告列表（お知らせ）、新闻标题列表、标签页、排行榜、徽章、价格区块、按钮、信息表格、诊疗时间表、预约日历、步骤流程、问答、页脚 |
| 表单 | 不同用途应收集哪些字段、姓在前名在后、フリガナ、邮编自动填写地址、都道府县（按 JIS 顺序）、全角半角规范化、输入法确认时的回车处理、必填与选填标记、确认页面、预约表单 |
| 文案与本地化 | 敬体（です・ます）与名词结尾的用法、按钮常用词、标题字数、「」【】※ 等符号、日期、和历（令和）、含税价格、轻减税率、万与亿、页面标题写法 |
| 信任与法规 | 特定商取引法表示、隐私政策、外部发送规定、公司简介、景品表示法（虚假宣传）、医疗广告指南、药机法、支付方式、LINE、JIS X 8341-3 无障碍标准 |
| 工具 | `japanify.css`（可直接引入的样式变量与组件）、`japanify.js`（辅助函数）、`check.mjs`（静态检查）、`measure.mjs`（渲染后测量） |

## 安装

**Claude Code（插件）**：在 Claude Code 中运行

```text
/plugin marketplace add zghanw/japanify
/plugin install japanify@japanify
```

**任何支持 Agent Skills 的代理（skills CLI）**

```bash
npx skills add zghanw/japanify
```

**手动安装**

把 `skills/japanify` 文件夹复制到代理的技能目录：Claude Code 为 `~/.claude/skills/`（项目级为 `.claude/skills/`），Codex、Copilot CLI 和 Gemini CLI 为 `~/.agents/skills/`。

## 使用方法

当任务与日本用户相关时，技能会自动加载。示例提示词：

- 「静岡の日本茶の通販サイトのトップページを作って」（做一个静冈日本茶网店的首页）
- "Japanify this landing page for the Japanese market."（把这个落地页改造成面向日本市场的版本）
- 「このお問い合わせフォームを日本のユーザー向けに直して」（把这个联系表单改成适合日本用户的版本）
- 「歯科クリニックのサイトを作って。診療時間表とWEB予約も」（做一个牙科诊所网站，包含诊疗时间表和网上预约）

### 工具

```bash
node skills/japanify/scripts/check.mjs src/
```

`check.mjs` 无需任何依赖。文案类规则只检查页面上可见的文字，因此注释和类名不会造成误报。错误级别：缺少 `lang="ja"`、回车处理没有考虑输入法、自造的 autocomplete 值。警告级别：姓名顺序、缺少フリガナ、邮编没有自动填写地址、价格没有含税说明、付费服务缺少特商法链接、超过 40px 的标题、小于 16px 的输入框、在 Windows 上显示过细的字体、都道府县顺序不符合 JIS 等。

```bash
node skills/japanify/scripts/measure.mjs page.html lp --shots out/
```

`measure.mjs` 使用 Playwright 以桌面 1280px 和 iPhone 390px 渲染页面，并把字号、行高、字间距和首屏链接数与所选页面类型（`portal`、`ec`、`article`、`data`、`lp`、`local`、`community`）的实测范围进行比较。

## 基准数据

以 Semrush 和 Similarweb 的日本国内排名（2026 年 9 月）平均值对日本本土、面向大众的网站排序，并于 2026 年 10 月 14 日使用无头 Chromium 在桌面 1280px 和 iPhone 视口下实测。

| # | 网站 | 正文字号中位数 | 行高 | 特点 |
|---|---|---|---|---|
| 1 | Yahoo! JAPAN | 14px | 1.4 | 固定宽度 990px，首屏 85 个链接 |
| 2 | 楽天市場 | 12 至 13px | 1.3 至 1.5 | 价格和按钮统一使用红色 #bf0000 |
| 3 | pixiv | 14px | 1.4 至 1.6 | 固定宽度 1,016px，胶囊形按钮，扁平卡片 |
| 4 | note | 16px（文章 18px） | 1.5（文章 2.0） | 620px 阅读栏，只有标题使用 palt |
| 5 | docomo | 14px | 1.3 至 1.5 | 品牌红色用于结构，重要通知置顶 |
| 6 | tenki.jp | 14px | 1.4 | 固定宽度 1,048px，色条标题，最高气温红色、最低气温蓝色 |
| 7 | ウェザーニュース | 13px | 1.5 | 数字使用 Arial，统一圆角和阴影 |
| 8 | Ameba | 12 至 16px | 1.4 至 1.6 | 绿色胶囊按钮，博客侧栏顺序 |
| 9 | livedoor | 13 至 14px | 1.2 至 1.5 | 15 字标题，首屏 110 个链接 |
| 10 | TRILL | 14px（文章 16px） | 1.5（文章 1.8） | 界面为灰阶，色彩来自照片 |
| + | 食べログ | 12 至 13px | 1.4 | 评分、点评、预约日历 |

完整数据见 [`skills/japanify/references/benchmarks.md`](skills/japanify/references/benchmarks.md)。

## 测试方法

我们把同一个需求（日本茶网店首页）分别交给未使用本技能和使用本技能的代理，再用 `measure.mjs` 与真实的楽天市場首页对比。随后两个独立的 QA 代理使用本技能制作了 4 个页面（日本茶网店、牙科诊所、SaaS 日本化改造、地区门户网站），并报告了发现的所有问题，这些问题在发布前均已修复。

| 测量项 | 未使用技能 | 使用 japanify | 楽天市場（真实网站） |
|---|---|---|---|
| 正文字号中位数 | 13px | 12px | 12px |
| 行高中位数 | 1.8 | 1.5 | 1.3 |
| 加了字间距的文字比例 | 97% | 9% | 0% |
| 日文 Web 字体 | Noto Sans JP | 无 | 无 |
| 首屏链接数 | 23 | 46 | 29 |

使用本技能制作的地区门户网站测得：正文 13px，94% 的文字不超过 14px，行高 1.4，首屏 77 个链接；Yahoo! JAPAN 分别为 14px、100%、1.4 和 85 个。

## 目录结构

```
skills/japanify/
  SKILL.md                         入口文件
  references/
    benchmarks.md                  前 10 名网站实测数据
    typography.md
    layout-and-components.md
    forms.md
    copy-and-locale.md
    trust-and-legal.md
  assets/
    japanify.css                   样式变量与组件
    japanify.js                    辅助函数（输入法、邮编、日期、日元）
  scripts/
    check.mjs                      日本化静态检查，无依赖
    measure.mjs                    渲染后测量（Playwright）
docs/images/                       README 截图
.claude-plugin/                    Claude Code 插件清单
```

## 许可证

MIT
