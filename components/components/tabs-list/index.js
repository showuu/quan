Component({
  properties: {
    tabList: Array,
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
      optionalTypes: [String],
      value: 0,
    },
    swipeThreshold: {
      type: Number,
      optionalTypes: [String],
      value: 5,
    },
    duration: {
      type: Number,
      optionalTypes: [String],
      value: 0.3,
    },
    lineClamp: {
      type: Number,
      optionalTypes: [String],
      value: 1,
    },
    height: {
      type: String,
      optionalTypes: [Number],
    },
    lineWidth: {
      type: String,
      optionalTypes: [Number],
    },
    lineHeight: {
      type: String,
      optionalTypes: [Number],
      value: '4rpx',
    },
    lineColor: {
      type: String,
      value: '#FF0033',
    },
    tabsContainerStyle: String,
  },
  externalClasses: ['tabs-container-class', 'tab-class', 'tab-active-class'],
  data: {
    scrollLeft: 0, // scrollView横向滚动条位置
    windowWidth: 0, // 可用窗口宽度
    tabStyle: '', // tab标签样式
    tabHeightValue: 0, // tab标签高度数值
    tabHeightUnit: '', // tab标签高度单位
    lineWidthValue: 0, // 线条宽度数值
    lineWidthUnit: '', // 线条宽度单位
    lineHeightValue: 0, // 线条高度数值
    lineHeightUnit: '', // 线条高度单位
    _tabWidth: 0, // 单个tab卡的宽度
    _pxToRpxRatio: 0, // px换算为rpx的比例
    _lineWidthpx: 0, // 线条宽度(单位px)
    _lineWidthrpx: 0, //线条宽度(单位rpx)
  },
  attached() {
    this.normalizeProps();
    wx.nextTick(() => {
      this.calculateTabWidth('attached');
    });
  },
  observers: {
    current(v) {
      this.setLineTransform();
      this.setScrollLeft();
    },
    tabList(v) {
      this.calculateTabWidth();
    },
  },
  methods: {
    normalizeProps() {
      if (isNaN(parseInt(this.data.current)) || parseInt(this.data.current) < 0) {
        this.setData({ current: 0 });
      }
      if (isNaN(parseInt(this.data.swipeThreshold)) || parseInt(this.data.swipeThreshold) <= 0) {
        this.setData({ swipeThreshold: 5 });
      }
      if (isNaN(parseInt(this.data.lineClamp))) {
        this.setData({ lineClamp: 1 });
      }
      if(!this.data.lineColor) {
        this.setData({lineColor: '#FF0033'})
      }
    },
    calculateTabWidth() {
      if (!this.data.tabList.length) {
        return;
      }
      const height = this.data.height;
      const lineWidth = this.data.lineWidth;
      const lineHeight = this.data.lineHeight;
      const reg = /^(\d+(.\d)?\d*)(px|rpx)?$/;
      const tabHResult = reg.exec(height);
      const wResult = reg.exec(lineWidth);
      const hResult = reg.exec(lineHeight);
      if (this.data.tabList.length <= this.data.swipeThreshold) {
        this.setData({ tabStyle: `flex: 1` });
      } else {
        this.setData({ tabStyle: `flex: 0 0 ${100 / this.data.swipeThreshold + 2}%` });
      }
      const { windowWidth } = wx.getSystemInfoSync();
      const _pxToRpxRatio = 750 / windowWidth;
      this.createSelectorQuery()
        .select('.tab')
        .boundingClientRect((res) => {
          if (!res) {
            return;
          }
          let _lineWidthpx = 0;
          let _lineWidthrpx = 0;
          let lineWidthUnit = '';
          if (!wResult) {
            // 若组件调用方传入的lineWidth格式不正确, 则线条宽度默认为单个tab卡的宽度
            _lineWidthpx = res.width;
            _lineWidthrpx = res.width * _pxToRpxRatio;
            lineWidthUnit = 'px';
          } else if (wResult[3] === 'rpx') {
            // 组件调用方传入的lineWidth单位为rpx
            _lineWidthpx = wResult[1] / _pxToRpxRatio;
            _lineWidthrpx = wResult[1];
            lineWidthUnit = 'rpx';
          } else {
            // 组件调用放传入的lineWidth单位为px, 或只传了数值(此时长度单位默认为px)
            _lineWidthpx = wResult[1];
            _lineWidthrpx = wResult[1] * _pxToRpxRatio;
            lineWidthUnit = 'px';
          }
          let lineHeightValue = 0;
          let lineHeightUnit = '';
          if (!hResult) {
            lineHeightValue = 4;
            lineHeightUnit = 'rpx';
          } else if (hResult[3] === 'rpx') {
            lineHeightValue = hResult[1];
            lineHeightUnit = 'rpx';
          } else {
            lineHeightValue = hResult[1];
            lineHeightUnit = 'px';
          }
          let tabHeightValue = 0;
          let tabHeightUnit = '';
          if (!tabHResult) {
            tabHeightValue = 'auto';
            tabHeightUnit = '';
          } else if (tabHResult[3] === 'rpx') {
            tabHeightValue = tabHResult[1];
            tabHeightUnit = 'rpx';
          } else {
            tabHeightValue = tabHResult[1];
            tabHeightUnit = 'px';
          }
          this.setData({ windowWidth, tabHeightValue, tabHeightUnit, lineWidthUnit, lineHeightValue, lineHeightUnit, _tabWidth: res.width, _pxToRpxRatio, _lineWidthpx, _lineWidthrpx });
          this.setLineTransform(true);
        })
        .exec();
    },
    toggleTabCard(e) {
      const { index } = e.currentTarget.dataset;
      const current = this.data.current;
      const tabList = this.data.tabList;
      if (index === current) {
        return;
      }
      this.setData({ current: index });
      this.triggerEvent('change', { current: index, ...tabList[index] });
    },
    setLineTransform(noTransition) {
      const moveX = this.data.current * this.data._tabWidth + (this.data._tabWidth - this.data._lineWidthpx) / 2;
      if (noTransition) {
        this.setData({ lineStyle: `background:${this.data.lineColor};transform:translateX(${moveX}px)` });
        wx.nextTick((e) => {
          this.setData({ lineWidthValue: this.data.lineWidthUnit === 'px' ? this.data._lineWidthpx : this.data._lineWidthrpx });
        });
      } else {
        this.setData({
          lineStyle: `background:${this.data.lineColor};transform:translateX(${moveX}px);transition-duration:${this.data.duration}s`,
        });
      }
    },
    setScrollLeft() {
      if (this.data.tabList.length <= this.data.fixedNum) {
        return;
      }
      const scrollLeft = this.data._tabWidth * (this.data.current + 1) - this.data.windowWidth / 2 - this.data._tabWidth / 2;
      this.setData({ scrollLeft });
    },
  },
});
