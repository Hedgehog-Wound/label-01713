/**
 * 主入口 - 事件绑定与控制
 */
document.addEventListener('DOMContentLoaded', () => {

  // 状态
  let currentMode = 'meal';
  let currentPeople = 2;
  let currentAppetite = 'normal';

  // DOM
  const modeBtns = document.querySelectorAll('.mode-btn');
  const peopleBtns = document.querySelectorAll('.people-btn');
  const appetiteBtns = document.querySelectorAll('.appetite-btn');
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

  setupToggleGroup(modeBtns, btn => { currentMode = btn.dataset.mode; });
  setupToggleGroup(peopleBtns, btn => { currentPeople = parseInt(btn.dataset.people, 10); });
  setupToggleGroup(appetiteBtns, btn => { currentAppetite = btn.dataset.appetite; });

  // 生成按钮
  generateBtn.addEventListener('click', () => {
    UI.setButtonLoading(generateBtn, true);

    setTimeout(() => {
      try {
        if (currentMode === 'meal') {
          const meal = MenuGenerator.generateMeal(currentPeople, new Set(), '推荐菜单', currentAppetite);
          UI.renderSingleMeal(meal);
          UI.showToast('单餐菜单已生成', 'success');
        } else if (currentMode === 'day') {
          const dayMeals = MenuGenerator.generateDay(currentPeople, new Set(), currentAppetite);
          UI.renderDayMenu(dayMeals);
          UI.showToast('全天菜单已生成', 'success');
        } else if (currentMode === 'week') {
          const result = MenuGenerator.generateWeek(currentPeople, currentAppetite);
          UI.renderWeekMenu(result.menu);
          const warnings = [];
          if (result.dishReduced) warnings.push('后几天菜品数已自动缩减以保证不重复');
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
});
