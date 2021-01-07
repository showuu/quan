Component({
  properties: {
    goodsId: String,
    goodsImg: String,
    goodsName: String,
    goodsPrice: String,
    memberPrice:String,
    goodsSpec: Array,
    points: String,
    cartNum: Number,
    type: String,
  },
  data: {
    selectedItem: {},
  },
  observers: {
    itemOptions() {
      this.setData({ selectedItem: this.data.itemOptions[0] });
    },
  },
  attached() {
    console.log(this.data.memberPrice)
  },
  methods: {
    navigateToTGoods() {
      const type = this.data.type;
      const goodsId = this.data.goodsId;
      if (type === 'pintuan') {
        wx.navigateTo({ url: `/addons/package/pages/pintuan/goods/detail?id=${goodsId}` });
      } else if (type === 'integral') {
        wx.navigateTo({ url: `/addons/package/pages/integral/goods/detail?id=${goodsId}` });
      } else if (type === 'groupon') {
        wx.navigateTo({ url: `/addons/package/pages/groupon/goods/detail?id=${goodsId}` });
      } else {
        wx.navigateTo({ url: `/pages/goods-detail/index?goodsId=${goodsId}` });
      }
    },
  },
});
