/**
 * 菜品数据库 - 覆盖国内八大菜系
 * 分类：dish(菜), staple(主食), soup(汤)
 */
const MenuDatabase = (() => {
  const cuisines = [
    '川菜', '粤菜', '鲁菜', '苏菜', '浙菜', '闽菜', '湘菜', '徽菜'
  ];

  const dishes = [
    // 川菜
    { name: '麻婆豆腐', cuisine: '川菜', type: 'dish', tags: ['经典', '下饭'] },
    { name: '宫保鸡丁', cuisine: '川菜', type: 'dish', tags: ['经典', '下饭'] },
    { name: '水煮牛肉', cuisine: '川菜', type: 'dish', tags: ['硬菜', '辣'] },
    { name: '回锅肉', cuisine: '川菜', type: 'dish', tags: ['经典', '下饭'] },
    { name: '鱼香肉丝', cuisine: '川菜', type: 'dish', tags: ['经典', '下饭'] },
    { name: '辣子鸡', cuisine: '川菜', type: 'dish', tags: ['硬菜', '辣'] },
    { name: '夫妻肺片', cuisine: '川菜', type: 'dish', tags: ['凉菜'] },
    { name: '蒜泥白肉', cuisine: '川菜', type: 'dish', tags: ['凉菜'] },
    { name: '干煸四季豆', cuisine: '川菜', type: 'dish', tags: ['素菜'] },
    { name: '酸菜鱼', cuisine: '川菜', type: 'dish', tags: ['硬菜', '酸辣'] },
    { name: '毛血旺', cuisine: '川菜', type: 'dish', tags: ['硬菜', '辣'] },
    { name: '口水鸡', cuisine: '川菜', type: 'dish', tags: ['凉菜', '辣'] },
    { name: '棒棒鸡', cuisine: '川菜', type: 'dish', tags: ['凉菜'] },
    { name: '水煮鱼', cuisine: '川菜', type: 'dish', tags: ['硬菜', '辣'] },
    { name: '泡椒凤爪', cuisine: '川菜', type: 'dish', tags: ['凉菜', '酸辣'] },

    // 粤菜
    { name: '白切鸡', cuisine: '粤菜', type: 'dish', tags: ['经典', '清淡'] },
    { name: '烧鹅', cuisine: '粤菜', type: 'dish', tags: ['硬菜'] },
    { name: '蜜汁叉烧', cuisine: '粤菜', type: 'dish', tags: ['经典'] },
    { name: '清蒸鲈鱼', cuisine: '粤菜', type: 'dish', tags: ['清淡', '鱼'] },
    { name: '菠萝咕噜肉', cuisine: '粤菜', type: 'dish', tags: ['经典', '酸甜'] },
    { name: '豉汁蒸排骨', cuisine: '粤菜', type: 'dish', tags: ['蒸菜'] },
    { name: '蚝油生菜', cuisine: '粤菜', type: 'dish', tags: ['素菜', '清淡'] },
    { name: '虾饺', cuisine: '粤菜', type: 'dish', tags: ['点心'] },
    { name: '干炒牛河', cuisine: '粤菜', type: 'dish', tags: ['经典'] },
    { name: '盐焗鸡', cuisine: '粤菜', type: 'dish', tags: ['经典'] },
    { name: '脆皮烧肉', cuisine: '粤菜', type: 'dish', tags: ['硬菜'] },
    { name: '白灼虾', cuisine: '粤菜', type: 'dish', tags: ['清淡', '海鲜'] },
    { name: '煲仔饭', cuisine: '粤菜', type: 'dish', tags: ['经典'] },
    { name: '豉油鸡', cuisine: '粤菜', type: 'dish', tags: ['经典', '清淡'] },
    { name: '梅菜扣肉', cuisine: '粤菜', type: 'dish', tags: ['硬菜'] },

    // 鲁菜
    { name: '糖醋鲤鱼', cuisine: '鲁菜', type: 'dish', tags: ['经典', '酸甜'] },
    { name: '九转大肠', cuisine: '鲁菜', type: 'dish', tags: ['硬菜'] },
    { name: '葱烧海参', cuisine: '鲁菜', type: 'dish', tags: ['硬菜', '海鲜'] },
    { name: '油焖大虾', cuisine: '鲁菜', type: 'dish', tags: ['硬菜', '海鲜'] },
    { name: '爆炒腰花', cuisine: '鲁菜', type: 'dish', tags: ['经典'] },
    { name: '拔丝地瓜', cuisine: '鲁菜', type: 'dish', tags: ['甜品'] },
    { name: '德州扒鸡', cuisine: '鲁菜', type: 'dish', tags: ['经典'] },
    { name: '锅塌豆腐', cuisine: '鲁菜', type: 'dish', tags: ['素菜'] },
    { name: '醋溜白菜', cuisine: '鲁菜', type: 'dish', tags: ['素菜', '清淡'] },
    { name: '红烧肘子', cuisine: '鲁菜', type: 'dish', tags: ['硬菜'] },
    { name: '四喜丸子', cuisine: '鲁菜', type: 'dish', tags: ['硬菜', '经典'] },
    { name: '奶汤蒲菜', cuisine: '鲁菜', type: 'dish', tags: ['清淡'] },
    { name: '芫爆鱿鱼卷', cuisine: '鲁菜', type: 'dish', tags: ['经典'] },

    // 苏菜
    { name: '松鼠桂鱼', cuisine: '苏菜', type: 'dish', tags: ['硬菜', '酸甜'] },
    { name: '清炖蟹粉狮子头', cuisine: '苏菜', type: 'dish', tags: ['硬菜'] },
    { name: '盐水鸭', cuisine: '苏菜', type: 'dish', tags: ['经典', '凉菜'] },
    { name: '无锡排骨', cuisine: '苏菜', type: 'dish', tags: ['经典', '甜'] },
    { name: '大煮干丝', cuisine: '苏菜', type: 'dish', tags: ['经典'] },
    { name: '水晶肴肉', cuisine: '苏菜', type: 'dish', tags: ['凉菜'] },
    { name: '响油鳝糊', cuisine: '苏菜', type: 'dish', tags: ['经典'] },
    { name: '文思豆腐', cuisine: '苏菜', type: 'dish', tags: ['素菜', '清淡'] },
    { name: '红烧划水', cuisine: '苏菜', type: 'dish', tags: ['硬菜', '鱼'] },
    { name: '叫花鸡', cuisine: '苏菜', type: 'dish', tags: ['硬菜'] },
    { name: '蟹黄汤包', cuisine: '苏菜', type: 'dish', tags: ['点心'] },
    { name: '樱桃肉', cuisine: '苏菜', type: 'dish', tags: ['经典', '甜'] },
    { name: '三套鸭', cuisine: '苏菜', type: 'dish', tags: ['硬菜'] },

    // 浙菜
    { name: '西湖醋鱼', cuisine: '浙菜', type: 'dish', tags: ['经典', '酸甜'] },
    { name: '东坡肉', cuisine: '浙菜', type: 'dish', tags: ['硬菜', '经典'] },
    { name: '龙井虾仁', cuisine: '浙菜', type: 'dish', tags: ['清淡', '海鲜'] },
    { name: '叫化童鸡', cuisine: '浙菜', type: 'dish', tags: ['硬菜'] },
    { name: '宋嫂鱼羹', cuisine: '浙菜', type: 'dish', tags: ['经典'] },
    { name: '干炸响铃', cuisine: '浙菜', type: 'dish', tags: ['经典'] },
    { name: '油焖春笋', cuisine: '浙菜', type: 'dish', tags: ['素菜'] },
    { name: '荷叶粉蒸肉', cuisine: '浙菜', type: 'dish', tags: ['硬菜'] },
    { name: '糖醋排骨', cuisine: '浙菜', type: 'dish', tags: ['经典', '酸甜'] },
    { name: '清汤鱼圆', cuisine: '浙菜', type: 'dish', tags: ['清淡'] },
    { name: '蜜汁火方', cuisine: '浙菜', type: 'dish', tags: ['经典', '甜'] },
    { name: '西湖莼菜汤', cuisine: '浙菜', type: 'dish', tags: ['清淡'] },
    { name: '奉化芋艿', cuisine: '浙菜', type: 'dish', tags: ['素菜'] },

    // 闽菜
    { name: '佛跳墙', cuisine: '闽菜', type: 'dish', tags: ['硬菜', '经典'] },
    { name: '荔枝肉', cuisine: '闽菜', type: 'dish', tags: ['经典', '酸甜'] },
    { name: '醉排骨', cuisine: '闽菜', type: 'dish', tags: ['经典'] },
    { name: '红糟鸡', cuisine: '闽菜', type: 'dish', tags: ['经典'] },
    { name: '沙茶牛肉', cuisine: '闽菜', type: 'dish', tags: ['经典'] },
    { name: '太极芋泥', cuisine: '闽菜', type: 'dish', tags: ['甜品'] },
    { name: '海蛎煎', cuisine: '闽菜', type: 'dish', tags: ['经典', '海鲜'] },
    { name: '姜母鸭', cuisine: '闽菜', type: 'dish', tags: ['硬菜'] },
    { name: '白斩河田鸡', cuisine: '闽菜', type: 'dish', tags: ['经典'] },
    { name: '爆炒双脆', cuisine: '闽菜', type: 'dish', tags: ['经典'] },
    { name: '七星鱼丸', cuisine: '闽菜', type: 'dish', tags: ['经典'] },
    { name: '鸡汤氽海蚌', cuisine: '闽菜', type: 'dish', tags: ['清淡', '海鲜'] },
    { name: '淡糟香螺片', cuisine: '闽菜', type: 'dish', tags: ['经典'] },

    // 湘菜
    { name: '剁椒鱼头', cuisine: '湘菜', type: 'dish', tags: ['硬菜', '辣'] },
    { name: '小炒黄牛肉', cuisine: '湘菜', type: 'dish', tags: ['经典', '辣'] },
    { name: '辣椒炒肉', cuisine: '湘菜', type: 'dish', tags: ['经典', '下饭'] },
    { name: '毛氏红烧肉', cuisine: '湘菜', type: 'dish', tags: ['硬菜'] },
    { name: '腊味合蒸', cuisine: '湘菜', type: 'dish', tags: ['经典'] },
    { name: '口味虾', cuisine: '湘菜', type: 'dish', tags: ['硬菜', '辣'] },
    { name: '酸辣鸡杂', cuisine: '湘菜', type: 'dish', tags: ['经典', '酸辣'] },
    { name: '外婆菜', cuisine: '湘菜', type: 'dish', tags: ['下饭'] },
    { name: '农家小炒肉', cuisine: '湘菜', type: 'dish', tags: ['经典', '下饭'] },
    { name: '干锅花菜', cuisine: '湘菜', type: 'dish', tags: ['素菜'] },
    { name: '东安鸡', cuisine: '湘菜', type: 'dish', tags: ['经典'] },
    { name: '永州血鸭', cuisine: '湘菜', type: 'dish', tags: ['硬菜'] },
    { name: '湘西外婆菜炒蛋', cuisine: '湘菜', type: 'dish', tags: ['下饭'] },

    // 徽菜
    { name: '臭鳜鱼', cuisine: '徽菜', type: 'dish', tags: ['硬菜', '经典'] },
    { name: '毛豆腐', cuisine: '徽菜', type: 'dish', tags: ['经典'] },
    { name: '火腿炖甲鱼', cuisine: '徽菜', type: 'dish', tags: ['硬菜'] },
    { name: '黄山炖鸽', cuisine: '徽菜', type: 'dish', tags: ['硬菜'] },
    { name: '笋衣烧肉', cuisine: '徽菜', type: 'dish', tags: ['经典'] },
    { name: '李鸿章杂烩', cuisine: '徽菜', type: 'dish', tags: ['经典'] },
    { name: '问政山笋', cuisine: '徽菜', type: 'dish', tags: ['素菜', '清淡'] },
    { name: '虎皮毛豆腐', cuisine: '徽菜', type: 'dish', tags: ['经典'] },
    { name: '符离集烧鸡', cuisine: '徽菜', type: 'dish', tags: ['经典'] },
    { name: '中和汤', cuisine: '徽菜', type: 'dish', tags: ['清淡'] },
    { name: '一品锅', cuisine: '徽菜', type: 'dish', tags: ['硬菜'] },
    { name: '石耳炖鸡', cuisine: '徽菜', type: 'dish', tags: ['滋补'] },
    { name: '清蒸石鸡', cuisine: '徽菜', type: 'dish', tags: ['清淡'] },
  ];

  const staples = [
    { name: '白米饭', cuisine: '通用', type: 'staple', tags: ['米饭'] },
    { name: '杂粮饭', cuisine: '通用', type: 'staple', tags: ['米饭', '健康'] },
    { name: '蛋炒饭', cuisine: '通用', type: 'staple', tags: ['米饭', '经典'] },
    { name: '扬州炒饭', cuisine: '苏菜', type: 'staple', tags: ['米饭', '经典'] },
    { name: '馒头', cuisine: '鲁菜', type: 'staple', tags: ['面食'] },
    { name: '花卷', cuisine: '通用', type: 'staple', tags: ['面食'] },
    { name: '葱油拌面', cuisine: '苏菜', type: 'staple', tags: ['面食'] },
    { name: '担担面', cuisine: '川菜', type: 'staple', tags: ['面食', '辣'] },
    { name: '热干面', cuisine: '通用', type: 'staple', tags: ['面食'] },
    { name: '刀削面', cuisine: '通用', type: 'staple', tags: ['面食'] },
    { name: '兰州拉面', cuisine: '通用', type: 'staple', tags: ['面食'] },
    { name: '葱油饼', cuisine: '通用', type: 'staple', tags: ['面食', '饼'] },
    { name: '手抓饼', cuisine: '通用', type: 'staple', tags: ['面食', '饼'] },
    { name: '烙饼', cuisine: '鲁菜', type: 'staple', tags: ['面食', '饼'] },
    { name: '小米粥', cuisine: '通用', type: 'staple', tags: ['粥'] },
    { name: '皮蛋瘦肉粥', cuisine: '粤菜', type: 'staple', tags: ['粥'] },
    { name: '红薯饭', cuisine: '通用', type: 'staple', tags: ['米饭', '健康'] },
    { name: '煎饺', cuisine: '通用', type: 'staple', tags: ['饺子'] },
    { name: '水饺', cuisine: '通用', type: 'staple', tags: ['饺子'] },
    { name: '小笼包', cuisine: '苏菜', type: 'staple', tags: ['包子'] },
    { name: '肉包子', cuisine: '通用', type: 'staple', tags: ['包子'] },
    { name: '炒米粉', cuisine: '粤菜', type: 'staple', tags: ['米粉'] },
    { name: '桂林米粉', cuisine: '通用', type: 'staple', tags: ['米粉'] },
    { name: '酸辣粉', cuisine: '川菜', type: 'staple', tags: ['粉', '辣'] },
    { name: '油泼面', cuisine: '通用', type: 'staple', tags: ['面食'] },
    { name: '炸酱面', cuisine: '鲁菜', type: 'staple', tags: ['面食', '经典'] },
    { name: '阳春面', cuisine: '苏菜', type: 'staple', tags: ['面食', '清淡'] },
    { name: '重庆小面', cuisine: '川菜', type: 'staple', tags: ['面食', '辣'] },
    { name: '糯米饭', cuisine: '通用', type: 'staple', tags: ['米饭'] },
    { name: '菜饭', cuisine: '苏菜', type: 'staple', tags: ['米饭'] },
    { name: '豆沙包', cuisine: '通用', type: 'staple', tags: ['包子', '甜'] },
    { name: '韭菜盒子', cuisine: '鲁菜', type: 'staple', tags: ['面食'] },
    { name: '锅贴', cuisine: '通用', type: 'staple', tags: ['饺子'] },
    { name: '窝窝头', cuisine: '鲁菜', type: 'staple', tags: ['面食', '粗粮'] },
    { name: '八宝粥', cuisine: '通用', type: 'staple', tags: ['粥', '甜'] },
    { name: '南瓜粥', cuisine: '通用', type: 'staple', tags: ['粥', '健康'] },
    { name: '生煎包', cuisine: '苏菜', type: 'staple', tags: ['包子'] },
    { name: '烧麦', cuisine: '粤菜', type: 'staple', tags: ['点心'] },
    { name: '肠粉', cuisine: '粤菜', type: 'staple', tags: ['米粉', '经典'] },
    { name: '凉皮', cuisine: '通用', type: 'staple', tags: ['面食', '凉'] },
    { name: '螺蛳粉', cuisine: '通用', type: 'staple', tags: ['粉'] },
    { name: '炒河粉', cuisine: '粤菜', type: 'staple', tags: ['米粉'] },
    { name: '叉烧包', cuisine: '粤菜', type: 'staple', tags: ['包子'] },
    { name: '糍粑', cuisine: '湘菜', type: 'staple', tags: ['糕点'] },
    { name: '红豆饭', cuisine: '通用', type: 'staple', tags: ['米饭', '健康'] },
  ];

  const soups = [
    { name: '番茄蛋花汤', cuisine: '通用', type: 'soup', tags: ['经典', '清淡'] },
    { name: '紫菜蛋汤', cuisine: '通用', type: 'soup', tags: ['经典', '快手'] },
    { name: '酸辣汤', cuisine: '川菜', type: 'soup', tags: ['酸辣'] },
    { name: '冬瓜排骨汤', cuisine: '通用', type: 'soup', tags: ['清淡', '滋补'] },
    { name: '玉米排骨汤', cuisine: '通用', type: 'soup', tags: ['清淡', '滋补'] },
    { name: '莲藕排骨汤', cuisine: '湘菜', type: 'soup', tags: ['滋补'] },
    { name: '老鸭汤', cuisine: '通用', type: 'soup', tags: ['滋补'] },
    { name: '鲫鱼豆腐汤', cuisine: '通用', type: 'soup', tags: ['滋补', '鱼'] },
    { name: '西湖牛肉羹', cuisine: '浙菜', type: 'soup', tags: ['经典'] },
    { name: '三鲜汤', cuisine: '通用', type: 'soup', tags: ['经典'] },
    { name: '豆腐菌菇汤', cuisine: '通用', type: 'soup', tags: ['素汤', '清淡'] },
    { name: '山药排骨汤', cuisine: '通用', type: 'soup', tags: ['滋补'] },
    { name: '花生猪脚汤', cuisine: '粤菜', type: 'soup', tags: ['滋补'] },
    { name: '胡辣汤', cuisine: '通用', type: 'soup', tags: ['经典'] },
    { name: '竹荪鸡汤', cuisine: '通用', type: 'soup', tags: ['滋补'] },
    { name: '海带排骨汤', cuisine: '通用', type: 'soup', tags: ['清淡'] },
    { name: '蛤蜊汤', cuisine: '闽菜', type: 'soup', tags: ['海鲜', '清淡'] },
    { name: '萝卜牛腩汤', cuisine: '粤菜', type: 'soup', tags: ['滋补'] },
    { name: '银耳莲子汤', cuisine: '通用', type: 'soup', tags: ['甜汤', '滋补'] },
    { name: '丝瓜蛋汤', cuisine: '通用', type: 'soup', tags: ['清淡', '快手'] },
    { name: '猪肚鸡汤', cuisine: '粤菜', type: 'soup', tags: ['滋补'] },
    { name: '羊肉汤', cuisine: '通用', type: 'soup', tags: ['滋补'] },
    { name: '乌鸡汤', cuisine: '通用', type: 'soup', tags: ['滋补'] },
    { name: '南瓜浓汤', cuisine: '通用', type: 'soup', tags: ['素汤', '清淡'] },
    { name: '白菜豆腐汤', cuisine: '通用', type: 'soup', tags: ['素汤', '清淡'] },
    { name: '黄豆猪蹄汤', cuisine: '通用', type: 'soup', tags: ['滋补'] },
    { name: '香菇鸡汤', cuisine: '通用', type: 'soup', tags: ['滋补'] },
    { name: '鱼头豆腐汤', cuisine: '浙菜', type: 'soup', tags: ['滋补', '鱼'] },
    { name: '排骨莲子汤', cuisine: '通用', type: 'soup', tags: ['滋补'] },
    { name: '牛尾汤', cuisine: '通用', type: 'soup', tags: ['滋补'] },
    { name: '枸杞叶猪肝汤', cuisine: '粤菜', type: 'soup', tags: ['滋补'] },
  ];

  // 餐次定义
  const mealTypes = ['早餐', '午餐', '晚餐'];

  return {
    cuisines,
    dishes,
    staples,
    soups,
    mealTypes,
    getAllByType(type) {
      if (type === 'dish') return [...dishes];
      if (type === 'staple') return [...staples];
      if (type === 'soup') return [...soups];
      return [];
    },
    getByCuisine(cuisine) {
      return {
        dishes: dishes.filter(d => d.cuisine === cuisine),
        staples: staples.filter(s => s.cuisine === cuisine || s.cuisine === '通用'),
        soups: soups.filter(s => s.cuisine === cuisine || s.cuisine === '通用'),
      };
    }
  };
})();
