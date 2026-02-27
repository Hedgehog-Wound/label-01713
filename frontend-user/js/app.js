/**
 * 主入口 - 事件绑定与控制
 */
document.addEventListener('DOMContentLoaded', () => {

  // 状态
  let currentMode = 'meal';
  let currentPeople = 2;
  let currentAppetite = 'normal';
  let currentMealType = '午餐';

  // DOM
  const modeBtns = document.querySelectorAll('.mode-btn');
  const peopleBtns = document.querySelectorAll('.people-btn');
  const appetiteBtns = document.querySelectorAll('.appetite-btn');
  const mealTypeBtns = document.querySelectorAll('.meal-type-btn');
  const mealTypeGroup = document.getElementById('meal-type-group');
  const generateBtn = document.getElementById('btn-generate');

  // 通用切换逻辑
  function setupToggleGroup(btns, callback) {
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
        callback(btn);
      });
    });
  }

  setupToggleGroup(modeBtns, btn => {
    currentMode = btn.dataset.mode;
    mealTypeGroup.style.display = currentMode === 'meal' ? '' : 'none';
  });
  setupToggleGroup(peopleBtns, btn => { currentPeople = parseInt(btn.dataset.people, 10); });
  setupToggleGroup(appetiteBtns, btn => { currentAppetite = btn.dataset.appetite; });
  setupToggleGroup(mealTypeBtns, btn => { currentMealType = btn.dataset.mealType; });

  // 生成按钮
  generateBtn.addEventListener('click', () => {
    UI.setButtonLoading(generateBtn, true);

    setTimeout(() => {
      try {
        if (currentMode === 'meal') {
          const meal = MenuGenerator.generateMeal(currentPeople, new Set(), currentMealType, currentAppetite);
          UI.renderSingleMeal(meal);
          const portion = MenuGenerator.getPortionByPeople(currentPeople, currentAppetite);
          const mealWarnings = [];
          if (meal.dishes.length < portion.dishCount) mealWarnings.push('菜品库存有限，菜品数已缩减');
          if (meal.staples.length < portion.stapleCount) mealWarnings.push('主食库存有限，主食数已缩减');
          if (meal.soups.length < portion.soupCount) mealWarnings.push('汤品库存有限，汤品数已缩减');
          if (mealWarnings.length > 0) {
            UI.showToast(mealWarnings.join('；'), 'info');
          } else {
            UI.showToast(currentMealType + '菜单已生成', 'success');
          }
        } else if (currentMode === 'day') {
          const dayMeals = MenuGenerator.generateDay(currentPeople, new Set(), currentAppetite);
          UI.renderDayMenu(dayMeals);
          const portion = MenuGenerator.getPortionByPeople(currentPeople, currentAppetite);
          const dayWarnings = [];
          const hasReducedDish = dayMeals.some(m => m.dishes.length < portion.dishCount);
          const hasReducedStaple = dayMeals.some(m => m.staples.length < portion.stapleCount);
          const hasReducedSoup = dayMeals.some(m => m.soups.length < portion.soupCount);
          if (hasReducedDish) dayWarnings.push('菜品库存有限，部分餐次菜品数已缩减');
          if (hasReducedStaple) dayWarnings.push('主食库存有限，部分餐次主食数已缩减');
          if (hasReducedSoup) dayWarnings.push('汤品库存有限，部分餐次汤品数已缩减');
          if (dayWarnings.length > 0) {
            UI.showToast(dayWarnings.join('；'), 'info');
          } else {
            UI.showToast('全天菜单已生成', 'success');
          }
        } else if (currentMode === 'week') {
          const result = MenuGenerator.generateWeek(currentPeople, currentAppetite);
          UI.renderWeekMenu(result.menu);
          const warnings = [];
          if (result.dishReduced) warnings.push('后几天菜品数已自动缩减以保证不重复');
          if (result.dishReset) warnings.push('菜品库存有限部分天可能重复');
          if (result.stapleReset) warnings.push('主食库存有限部分天可能重复');
          if (result.soupReset) warnings.push('汤品库存有限部分天可能重复');
          if (warnings.length > 0) {
            UI.showToast(warnings.join('；'), 'info');
          } else {
            UI.showToast('一周菜单已生成，全部不重复', 'success');
          }
        }
      } catch (e) {
        UI.showToast('生成失败，请重试', 'error');
        console.error(e);
      } finally {
        UI.setButtonLoading(generateBtn, false);
      }
    }, 400);
  });

  // 默认选中
  function setDefault(selector, attr) {
    const el = document.querySelector(selector);
    el.classList.add('active');
    el.setAttribute('aria-checked', 'true');
  }
  setDefault('.mode-btn[data-mode="meal"]');
  setDefault('.people-btn[data-people="2"]');
  setDefault('.appetite-btn[data-appetite="normal"]');
  setDefault('.meal-type-btn[data-meal-type="午餐"]');
  mealTypeGroup.style.display = '';
});
