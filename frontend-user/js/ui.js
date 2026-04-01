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

  /**
   * 从DOM中提取当前菜单数据
   */
  function extractMenuData() {
    const resultArea = document.getElementById('result-area');
    const menuData = {
      title: '智能菜单',
      generatedAt: new Date().toLocaleString('zh-CN'),
      days: []
    };

    const daySections = resultArea.querySelectorAll('.day-section');
    if (daySections.length > 0) {
      daySections.forEach(daySection => {
        const dayTitle = daySection.querySelector('.day-title')?.textContent || '';
        const dayData = { day: dayTitle, meals: [] };
        const mealSections = daySection.querySelectorAll('.meal-section');
        mealSections.forEach(mealSection => {
          const mealTitle = mealSection.querySelector('.meal-title')?.textContent || '';
          const foodItems = mealSection.querySelectorAll('.food-name');
          const mealData = { meal: mealTitle, items: [] };
          foodItems.forEach(item => {
            mealData.items.push(item.textContent);
          });
          dayData.meals.push(mealData);
        });
        menuData.days.push(dayData);
      });
    } else {
      const mealSections = resultArea.querySelectorAll('.meal-section');
      const dayData = { day: '', meals: [] };
      mealSections.forEach(mealSection => {
        const mealTitle = mealSection.querySelector('.meal-title')?.textContent || '';
        const foodItems = mealSection.querySelectorAll('.food-name');
        const mealData = { meal: mealTitle, items: [] };
        foodItems.forEach(item => {
          mealData.items.push(item.textContent);
        });
        dayData.meals.push(mealData);
      });
      menuData.days.push(dayData);
    }

    return menuData;
  }

  /**
   * 导出为TXT文本格式
   */
  function exportAsTxt() {
    const menuData = extractMenuData();
    let content = `═══════════════════════════════════\n`;
    content += `           🍽️ 智能菜单\n`;
    content += `      生成时间：${menuData.generatedAt}\n`;
    content += `═══════════════════════════════════\n\n`;

    menuData.days.forEach(day => {
      if (day.day) {
        content += `【${day.day}】\n`;
        content += `───────────────────────────────────\n`;
      }
      day.meals.forEach(meal => {
        if (meal.meal) {
          content += `\n  ◆ ${meal.meal}\n`;
        }
        meal.items.forEach((item, idx) => {
          content += `     ${idx + 1}. ${item}\n`;
        });
      });
      if (day.day) {
        content += `\n───────────────────────────────────\n\n`;
      }
    });

    content += `\n═══════════════════════════════════\n`;
    content += `  覆盖八大菜系 · 智能推荐不重复\n`;
    content += `═══════════════════════════════════\n`;

    downloadFile(content, '菜单.txt', 'text/plain;charset=utf-8');
    showToast('菜单已导出为TXT文件', 'success');
  }

  /**
   * 导出为Markdown格式
   */
  function exportAsMarkdown() {
    const menuData = extractMenuData();
    let content = `# 🍽️ 智能菜单\n\n`;
    content += `> 生成时间：${menuData.generatedAt}\n\n`;
    content += `---\n\n`;

    menuData.days.forEach(day => {
      if (day.day) {
        content += `## ${day.day}\n\n`;
      }
      day.meals.forEach(meal => {
        if (meal.meal) {
          content += `### ${meal.meal}\n\n`;
        }
        meal.items.forEach(item => {
          content += `- ${item}\n`;
        });
        content += `\n`;
      });
      content += `---\n\n`;
    });

    content += `\n*覆盖川粤鲁苏浙闽湘徽八大菜系*`;

    downloadFile(content, '菜单.md', 'text/markdown;charset=utf-8');
    showToast('菜单已导出为Markdown文件', 'success');
  }

  /**
   * 打印菜单
   */
  function printMenu() {
    const menuData = extractMenuData();
    const printWindow = window.open('', '_blank');
    
    let htmlContent = `
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <title>智能菜单</title>
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
          padding: 30px;
          background: #ffffff;
        }
        .print-header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #059669;
        }
        .print-title {
          font-size: 28px;
          font-weight: 700;
          color: #059669;
          margin-bottom: 10px;
        }
        .print-time {
          font-size: 14px;
          color: #64748b;
        }
        .day-section {
          margin-bottom: 25px;
        }
        .day-title {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          padding: 12px 18px;
          background: #f0fdf4;
          border-radius: 8px;
          margin-bottom: 15px;
          border-left: 4px solid #059669;
        }
        .meal-section {
          margin-bottom: 15px;
        }
        .meal-title {
          font-size: 15px;
          font-weight: 600;
          color: #334155;
          margin-bottom: 10px;
          padding-bottom: 8px;
          border-bottom: 1px solid #e2e8f0;
        }
        .items-list {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .item {
          padding: 8px 12px;
          background: #f8fafc;
          border-radius: 6px;
          font-size: 14px;
          color: #334155;
        }
        .print-footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
        }
        @media print {
          body {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-header">
        <div class="print-title">🍽️ 智能菜单</div>
        <div class="print-time">生成时间：${menuData.generatedAt}</div>
      </div>
    `;

    menuData.days.forEach(day => {
      if (day.day) {
        htmlContent += `<div class="day-section">`;
        htmlContent += `<div class="day-title">${day.day}</div>`;
      }
      
      day.meals.forEach(meal => {
        htmlContent += `<div class="meal-section">`;
        if (meal.meal) {
          htmlContent += `<div class="meal-title">${meal.meal}</div>`;
        }
        htmlContent += `<div class="items-list">`;
        meal.items.forEach(item => {
          htmlContent += `<div class="item">${item}</div>`;
        });
        htmlContent += `</div></div>`;
      });
      
      if (day.day) {
        htmlContent += `</div>`;
      }
    });

    htmlContent += `
      <div class="print-footer">
        覆盖川粤鲁苏浙闽湘徽八大菜系 · 智能推荐不重复
      </div>
    </body>
    </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      printWindow.print();
    };

    showToast('打印对话框已打开', 'success');
  }

  /**
   * 通用文件下载函数
   */
  function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return {
    showToast,
    setButtonLoading,
    renderSingleMeal,
    renderDayMenu,
    renderWeekMenu,
    exportAsTxt,
    exportAsMarkdown,
    printMenu,
  };
})();
