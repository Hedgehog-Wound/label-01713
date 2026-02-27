/**
 * 命令行单元测试 - 可通过 node tests/run-tests.js 执行
 * 也可集成到 CI pipeline
 */

// 模拟浏览器环境中的全局变量
const fs = require('fs');
const path = require('path');

// 加载模块 - 用 Function 构造器在当前作用域执行
const dataCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'data.js'), 'utf-8');
const genCode = fs.readFileSync(path.join(__dirname, '..', 'js', 'generator.js'), 'utf-8');

// IIFE 中 const 不会泄漏到外层，改用 var 包装
Function(dataCode.replace('const MenuDatabase', 'globalThis.MenuDatabase'))();
Function(genCode.replace('const MenuGenerator', 'globalThis.MenuGenerator'))();
const MenuDatabase = globalThis.MenuDatabase;
const MenuGenerator = globalThis.MenuGenerator;

let passed = 0;
let failed = 0;

function section(name) {
  console.log(`\n\x1b[34m${name}\x1b[0m`);
}

function assert(desc, condition) {
  if (condition) {
    passed++;
    console.log(`  \x1b[32m✓\x1b[0m ${desc}`);
  } else {
    failed++;
    console.log(`  \x1b[31m✕\x1b[0m ${desc}`);
  }
}

// ========== 1. 份量映射 ==========
section('1. getPortionByPeople');

const p1n = MenuGenerator.getPortionByPeople(1, 'normal');
assert('1人正常: 1菜1主食1汤', p1n.dishCount === 1 && p1n.stapleCount === 1 && p1n.soupCount === 1);

const p2n = MenuGenerator.getPortionByPeople(2, 'normal');
assert('2人正常: 2菜1主食1汤', p2n.dishCount === 2 && p2n.stapleCount === 1 && p2n.soupCount === 1);

const p4n = MenuGenerator.getPortionByPeople(4, 'normal');
assert('4人正常: 4菜2主食1汤', p4n.dishCount === 4 && p4n.stapleCount === 2 && p4n.soupCount === 1);

// ========== 2. 食量差异 ==========
section('2. 食量差异');

const p2s = MenuGenerator.getPortionByPeople(2, 'small');
assert(`2人少食菜数(${p2s.dishCount}) < 正常(${p2n.dishCount})`, p2s.dishCount < p2n.dishCount);

const p4s = MenuGenerator.getPortionByPeople(4, 'small');
assert(`4人少食菜数(${p4s.dishCount}) < 正常(${p4n.dishCount})`, p4s.dishCount < p4n.dishCount);

const p2l = MenuGenerator.getPortionByPeople(2, 'large');
assert(`2人大食量菜数(${p2l.dishCount}) > 正常(${p2n.dishCount})`, p2l.dishCount > p2n.dishCount);

// 保底检查
let allMinOk = true;
[1,2,3,4].forEach(p => {
  ['small','normal','large'].forEach(a => {
    const r = MenuGenerator.getPortionByPeople(p, a);
    if (r.dishCount < 1 || r.stapleCount < 1 || r.soupCount < 1) allMinOk = false;
  });
});
assert('全组合均满足 >=1菜+1主食+1汤', allMinOk);

// ========== 3. 数据库 ==========
section('3. 数据库完整性');

const allDishes = MenuDatabase.getAllByType('dish');
const allStaples = MenuDatabase.getAllByType('staple');
const allSoups = MenuDatabase.getAllByType('soup');

assert(`菜品 >= 105 (${allDishes.length})`, allDishes.length >= 105);
assert(`主食 >= 30 (${allStaples.length})`, allStaples.length >= 30);
assert(`汤品 >= 21 (${allSoups.length})`, allSoups.length >= 21);

const cuisines = new Set(allDishes.map(d => d.cuisine));
assert(`八大菜系 (${cuisines.size})`, cuisines.size >= 8);

const allNames = [...allDishes, ...allStaples, ...allSoups].map(i => i.name);
const uniqueNames = new Set(allNames);
assert(`无重名 (${allNames.length}/${uniqueNames.size})`, allNames.length === uniqueNames.size);

// ========== 4. 去重 ==========
section('4. 去重逻辑');

const exclude = new Set(['麻婆豆腐', '宫保鸡丁']);
const filtered = MenuGenerator.pickRandom(allDishes, 5, exclude);
assert('排除生效', !filtered.map(d=>d.name).includes('麻婆豆腐'));
assert('返回5项', filtered.length === 5);

// ========== 5. 全天 ==========
section('5. 全天去重');

const dayMeals = MenuGenerator.generateDay(2, new Set(), 'normal');
assert('3餐', dayMeals.length === 3);
const dayNames = [];
dayMeals.forEach(m => [...m.dishes,...m.staples,...m.soups].forEach(i => dayNames.push(i.name)));
assert(`全天无重复 (${dayNames.length}/${new Set(dayNames).size})`, dayNames.length === new Set(dayNames).size);

// ========== 6. 周菜单 dish 严格不重复 ==========
section('6. 周菜单 dish 严格不重复');

const week4n = MenuGenerator.generateWeek(4, 'normal');
const w4nDishes = [];
week4n.menu.forEach(d => d.meals.forEach(m => m.dishes.forEach(x => w4nDishes.push(x.name))));
assert(`4人正常 dish 不重复 (${w4nDishes.length}/${new Set(w4nDishes).size})`,
  w4nDishes.length === new Set(w4nDishes).size);

const week4l = MenuGenerator.generateWeek(4, 'large');
const w4lDishes = [];
week4l.menu.forEach(d => d.meals.forEach(m => m.dishes.forEach(x => w4lDishes.push(x.name))));
assert(`4人大食量 dish 不重复 (${w4lDishes.length}/${new Set(w4lDishes).size})`,
  w4lDishes.length === new Set(w4lDishes).size);
assert('4人大食量 dishReduced=false（数据充足）', week4l.dishReduced === false);

// 每餐保底
let minOk = true;
week4l.menu.forEach(d => d.meals.forEach(m => {
  if (m.dishes.length < 1 || m.staples.length < 1 || m.soups.length < 1) minOk = false;
}));
assert('极端场景每餐 >=1菜+1主食+1汤', minOk);

// ========== 汇总 ==========
const total = passed + failed;
console.log(`\n${'='.repeat(40)}`);
if (failed === 0) {
  console.log(`\x1b[32m全部通过: ${total}/${total}\x1b[0m`);
  process.exit(0);
} else {
  console.log(`\x1b[31m失败: ${failed}/${total}\x1b[0m`);
  process.exit(1);
}
