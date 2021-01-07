Component({
  options: {
    pureDataPattern: /^_/,
  },
  relations: {
    '../tab/index': {
      type: 'child',
      linked(target) {
        // 每次有custom-li被插入时执行，target是该节点实例对象，触发在该节点attached生命周期之后
        this.data._ready && this.getAllTab();
      },
      linkChanged(target) {
        // 每次有custom-li被移动后执行，target是该节点实例对象，触发在该节点moved生命周期之后
        this.getAllTab();
      },
      unlinked(target) {
        // 每次有custom-li被移除时执行，target是该节点实例对象，触发在该节点detached生命周期之后
        this.getAllTab();
      },
    },
  },
  properties: {
    hidden: {
      type: Boolean,
      value: false,
    },
    line: {
      type: Boolean,
      value: true,
    },
    current: {
      type: Number,
    },
    swipeThreshold: {
      type: Number,
      value: 5,
    },
    duration: {
      type: Number,
      value: 0.3,
    },
    lineWidth: {
      type: String,
      optionalTypes: [Number],
    },
    lineHeight: {
      type: String,
      optionalTypes: [Number],
      value: 2,
    },
    lineColor: {
      type: String,
      value: '#FF0033',
    },
    tabsContainerStyle: String,
  },
  externalClasses: ['tabs-container-class'],
  data: {
    scrollLeft: 0, // scrollView横向滚动条位置
    _ready: false,
    _tabList: [], // tab组成的数组
    _tabsContainerWidthpx: 0, // tab选项卡容器宽度px
    _tabWidthpx: 0, // 单个tab卡的宽度px
    _lineWidthValue: 0, // 线条宽度数值
    _lineWidthUnit: '', // 线条宽度单位
    _pxToRpxRatio: 0, // px换算为rpx的比例
  },
  attached() {
    this.normalizeProps();
  },
  ready() {
    this.getAllTab();
  },
  observers: {
    current(v) {
      this.toggleTabCard();
    },
    _tabList(v) {
      wx.nextTick(() => {
        this.calculateTabWidth();
      });
    },
  },
  methods: {
    getAllTab() {
      const _tabList = this.getRelationNodes('../tab/index');
      this.setData({ _tabList });
    },
    normalizeProps() {
      this.setData({
        ...(this.data.current < 0 && { current: 0 }),
        ...(this.data.swipeThreshold <= 0 && { swipeThreshold: 5 }),
        ...(this.data.duration <= 0 && { duration: 0.3 }),
        ...(!this.data.lineColor && { lineColor: '#FF0033' }),
      });
    },
    calculateTabWidth() {
      const { current, swipeThreshold, _tabList } = this.data;
      if (!_tabList.length) {
        return;
      }
      const { windowWidth } = wx.getSystemInfoSync();
      const _pxToRpxRatio = 750 / windowWidth;
      this.createSelectorQuery()
        .select('.tabs-container')
        .boundingClientRect(res => {
          console.log(res);
          let _tabWidthpx = 0;
          if (_tabList.length <= swipeThreshold) {
            _tabWidthpx = res.width / _tabList.length;
          } else {
            _tabWidthpx = (res.width / this.data.swipeThreshold) * 1.1;
          }
          _tabList.forEach((v, i) => {
            v.setData({ tabStyle: `width: ${_tabWidthpx}px`, index: i, active: current == i ? true : false });
          });
          const { result: lineWidth, value: _lineWidthValue, unit: _lineWidthUnit } = this.getLengthUnit(this.data.lineWidth, _tabWidthpx);
          const { result: lineHeight } = this.getLengthUnit(this.data.lineHeight, 2);
          this.setData({ lineWidth, _lineWidthValue, _lineWidthUnit, lineHeight, _tabsContainerWidthpx: res.width, _tabWidthpx, _pxToRpxRatio, _ready: true });
          this.setLineTransform(true);
          this.setScrollLeft();
        })
        .exec();
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
    onTabTap(e) {
      const { index } = e.detail;
      const { current } = this.data;
      if (parseInt(index) !== current) {
        this.setData({ current: parseInt(index) });
        this.triggerEvent('change', { current: parseInt(index) });
      }
    },
    toggleTabCard() {
      const { current, _tabList } = this.data;
      _tabList.forEach((v, i) => {
        v.setData({ active: i == current ? true : false });
      });
      this.setLineTransform();
      this.setScrollLeft();
    },
    setLineTransform(noTransition) {
      const { current, _tabWidthpx, lineColor, duration, _lineWidthValue, _lineWidthUnit, _pxToRpxRatio } = this.data;
      const lineWidthpx = _lineWidthUnit === 'px' ? _lineWidthValue : _lineWidthValue / _pxToRpxRatio;
      const moveX = current * _tabWidthpx + (_tabWidthpx - lineWidthpx) / 2;
      if (noTransition) {
        this.setData({ lineStyle: `background:${lineColor};transform:translateX(${moveX}px)` });
      } else {
        this.setData({
          lineStyle: `background:${lineColor};transform:translateX(${moveX}px);transition-duration:${duration}s`,
        });
      }
    },
    setScrollLeft() {
      const { current, swipeThreshold, _tabList, _tabsContainerWidthpx, _tabWidthpx } = this.data;
      if (_tabList.length <= swipeThreshold) {
        return;
      }
      const scrollLeft = _tabWidthpx * (current + 1) - _tabsContainerWidthpx / 2 - _tabWidthpx / 2;
      this.setData({ scrollLeft });
    },
  },
});
