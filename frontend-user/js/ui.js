/**
 * UI 模块 - Toast提示、渲染、交互
 */
const UI = (() => {

  /** Toast 提示 */
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span class="toast-text">${message}</span>
    `;
    container.appendChild(toast);
    // 触发动画
    requestAnimationFrame(() => toast.classList.add('toast-show'));
    setTimeout(() => {
      toast.classList.remove('toast-show');
      toast.classList.add('toast-hide');
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  /** 设置按钮 loading 状态 */
  function setButtonLoading(btn, loading) {
    if (loading) {
      btn.dataset.originalText = btn.innerHTML;
      btn.innerHTML = '<span class="btn-spinner"></span>生成中...';
      btn.disabled = true;
      btn.classList.add('btn-loading');
    } else {
      btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
      btn.disabled = false;
      btn.classList.remove('btn-loading');
    }
  }

  /** 获取菜品类型的中文标签 */
  function getTypeLabel(type) {
    const map = { dish: '菜品', staple: '主食', soup: '汤品' };
    return map[type] || type;
  }

  /** 获取菜品类型的图标 */
  function getTypeIcon(type) {
    const map = { dish: '🍳', staple: '🍚', soup: '🍲' };
    return map[type] || '🍽️';
  }

  /** 渲染单个菜品卡片 */
  function renderFoodItem(item, allNames) {
    const card = document.createElement('div');
    card.className = 'food-item';
    card.innerHTML = `
      <div class="food-item-header">
        <span class="food-icon">${getTypeIcon(item.type)}</span>
        <span class="food-type-badge">${getTypeLabel(item.type)}</span>
      </div>
      <div class="food-name">${item.name}</div>
      <div class="food-meta">
        <span class="food-cuisine">${item.cuisine}</span>
        ${item.tags ? item.tags.map(t => `<span class="food-tag">${t}</span>`).join('') : ''}
      </div>
      <button class="btn-replace" title="换一道" data-type="${item.type}" data-name="${item.name}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M1 4v6h6M23 20v-6h-6"/>
          <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"/>
        </svg>
      </button>
    `;
    // 换菜按钮事件
    const replaceBtn = card.querySelector('.btn-replace');
    replaceBtn.addEventListener('click', () => {
      const newItem = MenuGenerator.replaceSingle(item.type, allNames);
      if (newItem) {
        allNames.delete(item.name);
        allNames.add(newItem.name);
        const parent = card.parentElement;
        const newCard = renderFoodItem(newItem, allNames);
        card.classList.add('food-item-exit');
        setTimeout(() => {
          parent.replaceChild(newCard, card);
          newCard.classList.add('food-item-enter');
          requestAnimationFrame(() => newCard.classList.remove('food-item-enter'));
        }, 200);
        showToast(`已换为「${newItem.name}」`, 'success');
      } else {
        showToast('没有更多可替换的菜品了', 'error');
      }
    });
    return card;
  }

  /** 渲染单餐 */
  function renderMeal(mealData, allNames) {
    const section = document.createElement('div');
    section.className = 'meal-section';
    section.innerHTML = `<h3 class="meal-title">${mealData.meal || '推荐菜单'}</h3>`;

    const grid = document.createElement('div');
    grid.className = 'food-grid';

    [...mealData.dishes, ...mealData.staples, ...mealData.soups].forEach(item => {
      grid.appendChild(renderFoodItem(item, allNames));
    });

    section.appendChild(grid);
    return section;
  }

  /** 触发结果区域淡入动画（支持重复触发） */
  function triggerFadeIn(container) {
    container.classList.remove('result-fade-in');
    // 强制 reflow 以重新触发动画
    void container.offsetWidth;
    container.classList.add('result-fade-in');
  }

  /** 渲染单餐模式结果 */
  function renderSingleMeal(mealData) {
    const container = document.getElementById('result-area');
    container.innerHTML = '';
    const allNames = new Set();
    [...mealData.dishes, ...mealData.staples, ...mealData.soups].forEach(i => allNames.add(i.name));
    container.appendChild(renderMeal(mealData, allNames));
    triggerFadeIn(container);
  }

  /** 渲染全天模式结果 */
  function renderDayMenu(dayMeals) {
    const container = document.getElementById('result-area');
    container.innerHTML = '';
    const allNames = new Set();
    dayMeals.forEach(meal => {
      [...meal.dishes, ...meal.staples, ...meal.soups].forEach(i => allNames.add(i.name));
    });
    dayMeals.forEach(meal => {
      container.appendChild(renderMeal(meal, allNames));
    });
    triggerFadeIn(container);
  }

  /** 渲染周菜单结果 */
  function renderWeekMenu(weekData) {
    const container = document.getElementById('result-area');
    container.innerHTML = '';
    const allNames = new Set();
    weekData.forEach(day => {
      day.meals.forEach(meal => {
        [...meal.dishes, ...meal.staples, ...meal.soups].forEach(i => allNames.add(i.name));
      });
    });

    weekData.forEach(dayData => {
      const daySection = document.createElement('div');
      daySection.className = 'day-section';
      daySection.innerHTML = `<h2 class="day-title">${dayData.day}</h2>`;

      dayData.meals.forEach(meal => {
        daySection.appendChild(renderMeal(meal, allNames));
      });

      container.appendChild(daySection);
    });
    triggerFadeIn(container);
  }

  return {
    showToast,
    setButtonLoading,
    renderSingleMeal,
    renderDayMenu,
    renderWeekMenu,
  };
})();
