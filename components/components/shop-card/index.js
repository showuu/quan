Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    shopId: Number,
    shopName: String,
    shopDesc: String,
    shopImg: String,
    tag: {
      type: String,
      optionalTypes: [Number],
      value: '',
    },
    followNum: {
      type: Number,
      value: 0,
    },
    btnText: {
      type: String,
      value: '进入',
    },
    btnBackgroundColor: {
      type: String,
      value: 'linear-gradient(to right, #f1d0a5, #d5ab79)',
    },
    goods: Array,
    disableHeaderTap: Boolean,
  },
  data: {
    tagMap: {
      0: {
        name: '工匠',
        style: 'background: linear-gradient(to right, #C2A07A, #A8865A)',
      },
      1: {
        name: '官方',
        style: 'background: linear-gradient(to right, #F1D0A5, #D5AB79)',
      },
      2: {
        name: '大师',
        style: 'background: linear-gradient(to right, #363644, #2B2B38)',
      },
    },
  },
  methods: {
    onBtnTap() {
      this.triggerEvent('btntap', this.data);
    },
    navigateToGoods(e) {
      const { goodsId } = e.currentTarget.dataset;
      wx.navigateTo({ url: `/pages/goods-detail/index?goodsId=${goodsId}` });
    },
    navigateToShop() {
      if (this.data.disableHeaderTap) {
        return;
      }
      const shopId = this.data.shopId;
      wx.navigateTo({ url: `/pages/shop/index?shopId=${shopId}` });
    },
  },
});
