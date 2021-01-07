Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  relations: {
    '../tabs/index': {
      type: 'parent',
      linked(target) {},
    },
  },
  properties: {
    index: String, // tab所在的位置下标
    title: String,
    height: {
      type: String,
      optionalTypes: [Number],
    },
    lineClamp: {
      type: Number,
      value: 1,
    },
    tabStyle: String,
  },
  externalClasses: ['tab-class', 'tab-active-class'],
  data: {
    active: false, // 是否为选中激活状态
    tabHeight: '', // tab标签高度
  },
  attached() {
    this.calculateTabHeight();
  },
  observers: {
    height(v) {
      this.calculateTabHeight();
    },
    lineClamp(v) {
      this.setData({ ...(this.data.lineClamp <= 0 && { lineClamp: 1 }) });
    },
  },
  methods: {
    calculateTabHeight() {
      const { result: tabHeight } = this.getLengthUnit(this.data.height, 'auto');
      this.setData({ tabHeight });
    },
    /**
     * @description 对组件长度类型的prop属性做处理,返回 { result: 长度单位字符串, value: 长度值, unit: 长度单位 }
     * @param {Number|String} propValue 组件接受的长度类型的prop值
     * @param {Number} defaultValue 组件prop属性默认的值
     */
    getLengthUnit(propValue, defaultValue) {
      let result = '';
      let value = '';
      let unit = '';
      const reg = /^([1-9]+(.\d)?\d*)(px|rpx)?$/;
      const re = reg.exec(propValue);
      if (!re) {
        if (isNaN(Number(defaultValue))) {
          result = defaultValue;
          value = defaultValue;
        } else {
          result = `${defaultValue}px`;
          value = defaultValue;
          unit = 'px';
        }
      } else if (re[3] === 'rpx') {
        result = `${re[1]}rpx`;
        value = re[1];
        unit = 'rpx';
      } else {
        result = `${re[1]}px`;
        value = re[1];
        unit = 'px';
      }
      return { result, value, unit };
    },
    onTap(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent('tabtap', { index }, { bubbles: true, composed: true });
    },
  },
});
