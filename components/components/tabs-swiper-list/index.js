Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    tabList: Array,
    hideTab: {
      type: Boolean,
      value: false,
    },
    current: {
      type: String,
      optionalTypes: [Number],
      value: 0,
    },
    lineWidth: {
      type: String,
      optionalTypes: [Number],
    },
    lineHeight: {
      type: String,
      optionalTypes: [Number],
    },
    lineColor: {
      type: String,
    },
    swiperHeight: String,
  },
  data: {},
  attached() {
    wx.nextTick(() => {
      const { windowWidth, windowHeight } = wx.getSystemInfoSync();
      if (!this.data.swiperHeight) {
        const hideTab = this.data.hideTab;
        this.setData({ swiperHeight: `${windowHeight - (hideTab ? 0 : (windowWidth / 750) * 100)}px` });
      }
    });
  },
  methods: {
    onTabChange(e) {
      const { current } = e.detail;
      this.setData({ current });
    },
    onSwiperChange(e) {
      const tabList = this.data.tabList;
      const { current } = e.detail;
      this.setData({ current });
      this.triggerEvent('change', { ...e.detail, ...tabList[current] });
    },
  },
});
