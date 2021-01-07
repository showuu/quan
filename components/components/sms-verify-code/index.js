Component({
  options: {},
  properties: {
    value: String,
    length: {
      type: Number,
      value: 4,
    },
    height: {
      type: Number,
      optionalTypes: [String],
      value: 30,
    },
    gutter: {
      type: Number,
      optionalTypes: [String],
      value: 10,
    },
    type: {
      type: String,
      value: 'underline',
    },
    color: {
      type: String,
      value: '#ccc',
    },
    activeColor: {
      type: String,
      value: '#f00',
    },
  },
  data: {
    testV: '',
    cursor: -1,
    focus: false,
    _height: '',
    _gutter: '',
  },
  attached() {
    this.normalizeProps();
  },
  methods: {
    normalizeProps() {
      const { result: _height } = this.getLengthUnit(this.data.height, 30);
      const { result: _gutter } = this.getLengthUnit(this.data.gutter, 10);
      this.setData({
        ...(this.data.length <= 0 && { length: 4 }),
        _height,
        _gutter,
      });
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
    onTap() {
      const { value, length } = this.data;
      this.setData({
        cursor: Math.min(length - 1, value.length),
        focus: true,
      });
    },
    onShadowinput(e) {
      const { length } = this.data;
      const { value, cursor } = e.detail;
      this.setData({
        value,
        cursor,
        ...(cursor === length && { focus: false }),
      });
      this.triggerEvent('input', { value });
    },
    onShadowBlur(e) {
      this.setData({ cursor: -1 });
    },
  },
});
