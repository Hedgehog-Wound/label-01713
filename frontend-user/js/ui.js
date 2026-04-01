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

  /** 绑定导出按钮事件 */
  function bindExportEvents(container, menuData, mode) {
    const exportBtns = container.querySelectorAll('.btn-export');
    exportBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const format = btn.dataset.format;
        exportMenu(menuData, mode, format);
      });
    });
  }

  /** 渲染单餐模式结果 */
  function renderSingleMeal(mealData) {
    const container = document.getElementById('result-area');
    container.innerHTML = '';
    const allNames = new Set();
    [...mealData.dishes, ...mealData.staples, ...mealData.soups].forEach(i => allNames.add(i.name));
    renderExportButtons(container);
    container.appendChild(renderMeal(mealData, allNames));
    bindExportEvents(container, mealData, 'meal');
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
    renderExportButtons(container);
    dayMeals.forEach(meal => {
      container.appendChild(renderMeal(meal, allNames));
    });
    bindExportEvents(container, dayMeals, 'day');
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

    renderExportButtons(container);

    weekData.forEach(dayData => {
      const daySection = document.createElement('div');
      daySection.className = 'day-section';
      daySection.innerHTML = `<h2 class="day-title">${dayData.day}</h2>`;

      dayData.meals.forEach(meal => {
        daySection.appendChild(renderMeal(meal, allNames));
      });

      container.appendChild(daySection);
    });
    bindExportEvents(container, weekData, 'week');
    triggerFadeIn(container);
  }

  /** 触发文件下载 */
  function downloadFile(content, filename, mimeType) {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return true;
    } catch (e) {
      console.error('导出失败:', e);
      return false;
    }
  }

  /** 格式化为纯文本 TXT */
  function formatToText(menuData, mode) {
    let lines = [];
    const now = new Date().toLocaleString('zh-CN');
    lines.push('=' .repeat(50));
    lines.push('           🍽️ 智能菜单生成器');
    lines.push('=' .repeat(50));
    lines.push(`生成时间: ${now}`);
    lines.push(`生成模式: ${mode === 'meal' ? '单餐' : mode === 'day' ? '全天' : '一周'}`);
    lines.push('');

    if (mode === 'meal') {
      lines.push(`【${menuData.meal}】`);
      lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      ['dishes', 'staples', 'soups'].forEach(type => {
        const label = type === 'dishes' ? '菜品' : type === 'staples' ? '主食' : '汤品';
        const icon = type === 'dishes' ? '🍳' : type === 'staples' ? '🍚' : '🍲';
        menuData[type].forEach(item => {
          lines.push(`  ${icon} ${label}: ${item.name} (${item.cuisine})`);
        });
      });
    } else if (mode === 'day') {
      menuData.forEach(meal => {
        lines.push(`【${meal.meal}】`);
        lines.push('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        ['dishes', 'staples', 'soups'].forEach(type => {
          const label = type === 'dishes' ? '菜品' : type === 'staples' ? '主食' : '汤品';
          const icon = type === 'dishes' ? '🍳' : type === 'staples' ? '🍚' : '🍲';
          meal[type].forEach(item => {
            lines.push(`  ${icon} ${label}: ${item.name} (${item.cuisine})`);
          });
        });
        lines.push('');
      });
    } else if (mode === 'week') {
      menuData.forEach(day => {
        lines.push('');
        lines.push('◆' .repeat(50));
        lines.push(`                    ${day.day}`);
        lines.push('◆' .repeat(50));
        day.meals.forEach(meal => {
          lines.push('');
          lines.push(`  【${meal.meal}】`);
          ['dishes', 'staples', 'soups'].forEach(type => {
            const label = type === 'dishes' ? '菜品' : type === 'staples' ? '主食' : '汤品';
            meal[type].forEach(item => {
              lines.push(`    • ${label}: ${item.name} (${item.cuisine})`);
            });
          });
        });
        lines.push('');
      });
    }

    lines.push('');
    lines.push('=' .repeat(50));
    lines.push('  覆盖川粤鲁苏浙闽湘徽八大菜系 · 智能搭配');
    lines.push('=' .repeat(50));

    return lines.join('\r\n');
  }

  /** 格式化为 Markdown */
  function formatToMarkdown(menuData, mode) {
    let lines = [];
    const now = new Date().toLocaleString('zh-CN');
    lines.push('# 🍽️ 智能菜单');
    lines.push('');
    lines.push(`> 生成时间: ${now}`);
    lines.push('');

    if (mode === 'meal') {
      lines.push(`## ${menuData.meal}`);
      lines.push('');
      ['dishes', 'staples', 'soups'].forEach(type => {
        const label = type === 'dishes' ? '菜品' : type === 'staples' ? '主食' : '汤品';
        if (menuData[type].length > 0) {
          lines.push(`### ${label}`);
          menuData[type].forEach(item => {
            const tags = item.tags ? item.tags.map(t => `\`${t}\``).join(' ') : '';
            lines.push(`- **${item.name}** - ${item.cuisine} ${tags}`);
          });
          lines.push('');
        }
      });
    } else if (mode === 'day') {
      menuData.forEach(meal => {
        lines.push(`## ${meal.meal}`);
        lines.push('');
        ['dishes', 'staples', 'soups'].forEach(type => {
          const label = type === 'dishes' ? '菜品' : type === 'staples' ? '主食' : '汤品';
          if (meal[type].length > 0) {
            lines.push(`### ${label}`);
            meal[type].forEach(item => {
              const tags = item.tags ? item.tags.map(t => `\`${t}\``).join(' ') : '';
              lines.push(`- **${item.name}** - ${item.cuisine} ${tags}`);
            });
            lines.push('');
          }
        });
      });
    } else if (mode === 'week') {
      menuData.forEach(day => {
        lines.push(`## 📅 ${day.day}`);
        lines.push('');
        day.meals.forEach(meal => {
          lines.push(`### ${meal.meal}`);
          ['dishes', 'staples', 'soups'].forEach(type => {
            meal[type].forEach(item => {
              const tags = item.tags ? item.tags.map(t => `\`${t}\``).join(' ') : '';
              lines.push(`- **${item.name}** - ${item.cuisine} ${tags}`);
            });
          });
          lines.push('');
        });
      });
    }

    return lines.join('\r\n');
  }

  /** 格式化为 JSON */
  function formatToJSON(menuData, mode) {
    const exportData = {
      version: '1.0',
      exportTime: new Date().toISOString(),
      mode: mode,
      menu: menuData
    };
    return JSON.stringify(exportData, null, 2);
  }

  /** 执行导出 */
  function exportMenu(menuData, mode, format) {
    const now = new Date();
    const dateStr = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') + '_' +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0');

    let content, filename, mimeType;

    switch (format) {
      case 'txt':
        content = formatToText(menuData, mode);
        filename = `菜单_${dateStr}.txt`;
        mimeType = 'text/plain;charset=utf-8';
        break;
      case 'md':
        content = formatToMarkdown(menuData, mode);
        filename = `菜单_${dateStr}.md`;
        mimeType = 'text/markdown;charset=utf-8';
        break;
      case 'json':
        content = formatToJSON(menuData, mode);
        filename = `菜单_${dateStr}.json`;
        mimeType = 'application/json;charset=utf-8';
        break;
      default:
        showToast('不支持的导出格式', 'error');
        return;
    }

    const success = downloadFile(content, filename, mimeType);
    if (success) {
      showToast(`已导出: ${filename}`, 'success');
    } else {
      showToast('导出失败，请重试', 'error');
    }
  }

  /** 渲染导出按钮 */
  function renderExportButtons(container) {
    const exportBar = document.createElement('div');
    exportBar.className = 'export-bar';
    exportBar.innerHTML = `
      <span class="export-label">📤 导出菜单:</span>
      <button class="btn-export" data-format="txt" title="导出为纯文本文件">
        📄 TXT
      </button>
      <button class="btn-export" data-format="md" title="导出为Markdown格式">
        📝 MD
      </button>
      <button class="btn-export" data-format="json" title="导出为JSON数据">
        💾 JSON
      </button>
    `;
    container.insertBefore(exportBar, container.firstChild);
  }

  return {
    showToast,
    setButtonLoading,
    renderSingleMeal,
    renderDayMenu,
    renderWeekMenu,
    exportMenu,
    renderExportButtons,
  };
})();
