# 智能菜单生成器 Smart Menu Generator

## How to Run

1. 直接打开：用浏览器打开 `frontend-user/index.html` 即可使用
2. Docker 启动：

```bash
docker-compose up --build -d
```

访问 http://localhost:8080

## Services

| 服务 | 说明 | 端口 | 技术栈 |
|------|------|------|--------|
| frontend-user | 用户端（菜单生成器） | 8080 | HTML / CSS / JS + Nginx |

## 测试账号

本项目为纯前端应用，无需登录，无测试账号。

## 题目内容

我需要一个每顿饭或每天或每周的自动生成菜单的HTML程序，通过这个程序，我可以选择每顿饭的推荐菜，也可以选择一整天的推荐菜，还可以输出每周的不重复的推荐菜，还要有1人、2人、3人、4人的人数选择，可选择的菜要包括国内各大菜系，每顿饭都要有至少1个菜+1份主食+1份汤，根据人数和大概食量来推荐菜的数量

---

## 功能特性

- 三种生成模式：单餐 / 全天 / 整周
- 人数选择：1~4 人，菜品数量随人数动态调整
- 食量选择：少食 / 正常 / 大食量，影响每餐菜品数量
- 菜品库覆盖川、粤、鲁、苏、浙、闽、湘、徽八大菜系
- 每餐保证至少 1 菜 + 1 主食 + 1 汤
- 周菜单保证 7 天不重复
- 一键换菜 / 重新生成

## 数据说明

- 所有菜品数据为内置静态清单（108 道菜品 + 45 种主食 + 31 种汤品），非接口获取
- 周不重复约束范围：菜品(dish)在整周内严格不重复；主食(staple)和汤品(soup)尽量不重复，当库存不足时会自动重置并给出提示

## 单元测试

两种运行方式：

1. 浏览器：打开 `frontend-user/tests/test.html`
2. 命令行（CI 友好）：`node frontend-user/tests/run-tests.js`

覆盖：
- `getPortionByPeople` 人数×食量份量映射（含少食/大食量差异验证）
- 数据库完整性（数量、八大菜系覆盖、无重名）
- 去重逻辑（排除集合、单餐/全天/周不重复）
- 周菜单 dish 严格不重复 + dishReduced 标记
- replaceSingle 换菜

## 项目结构

```
├── frontend-user/
│   ├── index.html
│   ├── css/
│   ├── js/
│   │   ├── data.js         # 菜品数据库
│   │   ├── generator.js    # 生成核心逻辑
│   │   ├── ui.js           # UI渲染/Toast
│   │   └── app.js          # 主入口
│   ├── tests/
│   │   ├── test.html       # 浏览器端单元测试
│   │   └── run-tests.js    # CLI 单元测试（Node.js）
│   └── Dockerfile
├── docker-compose.yml
├── README.md
└── .gitignore
```
