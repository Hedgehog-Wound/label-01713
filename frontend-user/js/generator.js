/**
 * 菜单生成器核心逻辑
 * 根据人数、食量、模式生成菜单，保证不重复、营养均衡
 */
const MenuGenerator = (() => {

  /**
   * 食量系数映射
   * small: 少食（减少菜品）  normal: 正常  large: 大食量（增加菜品）
   */
  const appetiteMultiplier = {
    small: { dishMul: -1, stapleMul: 0, soupMul: 0 },
    normal: { dishMul: 0, stapleMul: 0, soupMul: 0 },
    large: { dishMul: 1, stapleMul: 1, soupMul: 0 },
  };

  /**
   * 根据人数计算基础每餐菜品数量
   * @param {number} people - 用餐人数 1~4
   * @returns {{ dishCount, stapleCount, soupCount }}
   */
  function getBasePortion(people) {
    const config = {
      1: { dishCount: 1, stapleCount: 1, soupCount: 1 },
      2: { dishCount: 2, stapleCount: 1, soupCount: 1 },
      3: { dishCount: 3, stapleCount: 2, soupCount: 1 },
      4: { dishCount: 4, stapleCount: 2, soupCount: 1 },
    };
    return config[people] || config[2];
  }

  /**
   * 根据人数和食量计算最终每餐菜品数量
   * @param {number} people
   * @param {string} appetite - small | normal | large
   * @returns {{ dishCount, stapleCount, soupCount }}
   */
  function getPortionByPeople(people, appetite = 'normal') {
    const base = getBasePortion(people);
    const mul = appetiteMultiplier[appetite] || appetiteMultiplier.normal;
    return {
      dishCount: Math.max(1, base.dishCount + mul.dishMul),
      stapleCount: Math.max(1, base.stapleCount + mul.stapleMul),
      soupCount: Math.max(1, base.soupCount + mul.soupMul),
    };
  }

  /**
   * 从数组中随机取 n 个不重复元素
   */
  function pickRandom(arr, n, excludeNames = new Set()) {
    const available = arr.filter(item => !excludeNames.has(item.name));
    const result = [];
    const pool = [...available];
    const count = Math.min(n, pool.length);
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      result.push(pool[idx]);
      pool.splice(idx, 1);
    }
    return result;
  }

  /**
   * 生成单餐菜单
   */
  function generateMeal(people, excludeNames = new Set(), mealLabel = '', appetite = 'normal') {
    const portion = getPortionByPeople(people, appetite);
    const allDishes = MenuDatabase.getAllByType('dish');
    const allStaples = MenuDatabase.getAllByType('staple');
    const allSoups = MenuDatabase.getAllByType('soup');

    return {
      meal: mealLabel,
      dishes: pickRandom(allDishes, portion.dishCount, excludeNames),
      staples: pickRandom(allStaples, portion.stapleCount, excludeNames),
      soups: pickRandom(allSoups, portion.soupCount, excludeNames),
    };
  }

  /**
   * 生成一天菜单（早/午/晚三餐）
   */
  function generateDay(people, excludeNames = new Set(), appetite = 'normal') {
    const meals = [];
    const dayExclude = new Set(excludeNames);

    MenuDatabase.mealTypes.forEach(mealType => {
      const meal = generateMeal(people, dayExclude, mealType, appetite);
      [...meal.dishes, ...meal.staples, ...meal.soups].forEach(item => {
        dayExclude.add(item.name);
      });
      meals.push(meal);
    });

    return meals;
  }

  /**
   * 生成一周菜单（7天）
   * 周不重复约束：
   *   - 菜品(dish)：尽量不重复，池不足时先缩减每餐菜品数（保证每餐≥1），池彻底耗尽时重置并标记。
   *   - 主食(staple)/汤(soup)：尽量不重复，池不足时重置并标记。
   */
  function generateWeek(people, appetite = 'normal') {
    const weekMenu = [];
    const dayNames = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

    const portion = getPortionByPeople(people, appetite);
    const dailyStapleNeed = portion.stapleCount * 3;
    const dailySoupNeed = portion.soupCount * 3;
    const totalDishes = MenuDatabase.getAllByType('dish').length;
    const totalStaples = MenuDatabase.getAllByType('staple').length;
    const totalSoups = MenuDatabase.getAllByType('soup').length;

    const usedDishes = new Set();
    const usedStaples = new Set();
    const usedSoups = new Set();
    let stapleReset = false;
    let soupReset = false;
    let dishReduced = false;
    let dishReset = false;

    for (let i = 0; i < 7; i++) {
      // 主食/汤池不够时重置（非严格约束）
      if (totalStaples - usedStaples.size < dailyStapleNeed) {
        usedStaples.clear();
        if (i > 0) stapleReset = true;
      }
      if (totalSoups - usedSoups.size < dailySoupNeed) {
        usedSoups.clear();
        if (i > 0) soupReset = true;
      }

      // 菜品(dish)池不够每餐最低1道时重置（保证"每餐至少1菜"硬性约束）
      let remainingDishes = totalDishes - usedDishes.size;
      if (remainingDishes < 3) {
        usedDishes.clear();
        remainingDishes = totalDishes;
        if (i > 0) dishReset = true;
      }

      const idealDailyDish = portion.dishCount * 3;

      // 如果剩余不够理想数量，按餐分配剩余（每餐至少1道）
      let dishPerMealArr = [portion.dishCount, portion.dishCount, portion.dishCount];
      if (remainingDishes < idealDailyDish) {
        dishReduced = true;
        const perMeal = Math.max(1, Math.floor(remainingDishes / 3));
        let leftover = remainingDishes - perMeal * 3;
        dishPerMealArr = [perMeal, perMeal, perMeal];
        for (let r = 0; r < Math.max(0, leftover); r++) {
          dishPerMealArr[r]++;
        }
      }

      // 生成本天三餐（使用调整后的菜品数）
      const meals = [];
      const dayExclude = new Set([...usedDishes, ...usedStaples, ...usedSoups]);
      let mealIdx = 0;

      MenuDatabase.mealTypes.forEach(mealType => {
        const allDishes = MenuDatabase.getAllByType('dish');
        const allStaples = MenuDatabase.getAllByType('staple');
        const allSoups = MenuDatabase.getAllByType('soup');

        const mealData = {
          meal: mealType,
          dishes: pickRandom(allDishes, dishPerMealArr[mealIdx], dayExclude),
          staples: pickRandom(allStaples, portion.stapleCount, dayExclude),
          soups: pickRandom(allSoups, portion.soupCount, dayExclude),
        };

        [...mealData.dishes, ...mealData.staples, ...mealData.soups].forEach(item => {
          dayExclude.add(item.name);
        });
        meals.push(mealData);
        mealIdx++;
      });

      // 收集到对应排除集
      meals.forEach(meal => {
        meal.dishes.forEach(item => usedDishes.add(item.name));
        meal.staples.forEach(item => usedStaples.add(item.name));
        meal.soups.forEach(item => usedSoups.add(item.name));
      });

      weekMenu.push({ day: dayNames[i], meals });
    }

    return { menu: weekMenu, stapleReset, soupReset, dishReduced, dishReset };
  }

  /**
   * 替换单个菜品（换一道菜）
   */
  function replaceSingle(type, excludeNames = new Set()) {
    const all = MenuDatabase.getAllByType(type);
    const picked = pickRandom(all, 1, excludeNames);
    return picked.length > 0 ? picked[0] : null;
  }

  return {
    getPortionByPeople,
    getBasePortion,
    generateMeal,
    generateDay,
    generateWeek,
    replaceSingle,
    pickRandom,
  };
})();
