Component({
  properties: {
    length: {
      type: Number,
      optionalTypes: [String],
      value: 6,
    },
    width: {
      type: Number,
      optionalTypes: [String],
      value: 2,
    },
    rotate: {
      type: Number,
      value: 45,
    },
    color: {
      type: String,
      value: '#999',
    },
  },
  data: {
    arrowLength: '',
    borderWidth: '',
  },
  attached() {
    this.normalizeProps();
  },
  methods: {
    normalizeProps() {
      const { result: arrowLength } = this.getLengthUnit(this.data.length, 6);
      const { result: borderWidth } = this.getLengthUnit(this.data.width, 2);
      this.setData({ arrowLength, borderWidth });
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
  },
});
