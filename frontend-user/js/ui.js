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

  /** 通用下载函数 */
  function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /** 导出为TXT格式 */
  function exportToText(data) {
    let text = '智能菜单生成器\n';
    text += '='.repeat(40) + '\n\n';
    
    const date = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    text += `生成时间: ${date}\n\n`;

    if (data.type === 'meal') {
      text += `【${data.menu.meal || '单餐菜单'}】\n`;
      text += '-'.repeat(30) + '\n';
      if (data.menu.dishes.length > 0) {
        text += '菜品:\n';
        data.menu.dishes.forEach(d => text += `  • ${d.name} (${d.cuisine})\n`);
      }
      if (data.menu.staples.length > 0) {
        text += '主食:\n';
        data.menu.staples.forEach(s => text += `  • ${s.name} (${s.cuisine})\n`);
      }
      if (data.menu.soups.length > 0) {
        text += '汤品:\n';
        data.menu.soups.forEach(s => text += `  • ${s.name} (${s.cuisine})\n`);
      }
    } else if (data.type === 'day') {
      text += '【全天菜单】\n';
      text += '-'.repeat(30) + '\n';
      data.menu.forEach(meal => {
        text += `\n${meal.meal}:\n`;
        if (meal.dishes.length > 0) {
          text += '  菜品: ' + meal.dishes.map(d => d.name).join('、') + '\n';
        }
        if (meal.staples.length > 0) {
          text += '  主食: ' + meal.staples.map(s => s.name).join('、') + '\n';
        }
        if (meal.soups.length > 0) {
          text += '  汤品: ' + meal.soups.map(s => s.name).join('、') + '\n';
        }
      });
    } else if (data.type === 'week') {
      text += '【一周菜单】\n';
      text += '-'.repeat(30) + '\n';
      data.menu.forEach(dayData => {
        text += `\n${dayData.day}:\n`;
        dayData.meals.forEach(meal => {
          text += `  ${meal.meal}: `;
          const items = [...meal.dishes, ...meal.staples, ...meal.soups].map(i => i.name);
          text += items.join('、') + '\n';
        });
      });
    }

    text += '\n' + '='.repeat(40) + '\n';
    text += 'Smart Menu Generator - 智能菜单生成器\n';

    downloadFile(text, `菜单_${date}.txt`, 'text/plain;charset=utf-8');
    showToast('TXT文件已导出', 'success');
  }

  /** 导出为Markdown格式 */
  function exportToMarkdown(data) {
    let md = '# 智能菜单生成器\n\n';
    
    const date = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    md += `> 生成时间: ${date}\n\n`;
    md += '---\n\n';

    if (data.type === 'meal') {
      md += `## ${data.menu.meal || '单餐菜单'}\n\n`;
      
      if (data.menu.dishes.length > 0) {
        md += '### 菜品\n\n';
        data.menu.dishes.forEach(d => md += `- ${d.name} (${d.cuisine})\n`);
        md += '\n';
      }
      if (data.menu.staples.length > 0) {
        md += '### 主食\n\n';
        data.menu.staples.forEach(s => md += `- ${s.name} (${s.cuisine})\n`);
        md += '\n';
      }
      if (data.menu.soups.length > 0) {
        md += '### 汤品\n\n';
        data.menu.soups.forEach(s => md += `- ${s.name} (${s.cuisine})\n`);
        md += '\n';
      }
    } else if (data.type === 'day') {
      md += '## 全天菜单\n\n';
      data.menu.forEach(meal => {
        md += `### ${meal.meal}\n\n`;
        const items = [
          ...meal.dishes.map(d => ({ type: '菜品', name: d.name, cuisine: d.cuisine })),
          ...meal.staples.map(s => ({ type: '主食', name: s.name, cuisine: s.cuisine })),
          ...meal.soups.map(s => ({ type: '汤品', name: s.name, cuisine: s.cuisine }))
        ];
        items.forEach(item => md += `- ${item.type}: ${item.name} (${item.cuisine})\n`);
        md += '\n';
      });
    } else if (data.type === 'week') {
      md += '## 一周菜单\n\n';
      data.menu.forEach(dayData => {
        md += `### ${dayData.day}\n\n`;
        dayData.meals.forEach(meal => {
          md += `#### ${meal.meal}\n\n`;
          const items = [...meal.dishes, ...meal.staples, ...meal.soups].map(i => i.name);
          md += `- ${items.join('、')}\n\n`;
        });
      });
    }

    md += '---\n';
    md += '> Smart Menu Generator - 智能菜单生成器\n';

    downloadFile(md, `菜单_${date}.md`, 'text/markdown;charset=utf-8');
    showToast('Markdown文件已导出', 'success');
  }

  /** 导出为JSON格式 */
  function exportToJSON(data) {
    const date = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
    const jsonData = {
      generator: 'Smart Menu Generator',
      generatedAt: new Date().toISOString(),
      type: data.type,
      menu: data.menu
    };
    const jsonString = JSON.stringify(jsonData, null, 2);
    downloadFile(jsonString, `菜单_${date}.json`, 'application/json;charset=utf-8');
    showToast('JSON文件已导出', 'success');
  }

  /** 导出菜单主函数 */
  function exportMenu(data, format) {
    if (!data || !data.menu) {
      showToast('请先生成菜单', 'error');
      return;
    }

    switch (format) {
      case 'txt':
        exportToText(data);
        break;
      case 'md':
        exportToMarkdown(data);
        break;
      case 'json':
        exportToJSON(data);
        break;
      default:
        showToast('不支持的导出格式', 'error');
    }
  }

  return {
    showToast,
    setButtonLoading,
    renderSingleMeal,
    renderDayMenu,
    renderWeekMenu,
    exportMenu,
  };
})();
