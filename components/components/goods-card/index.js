Component({
  properties: {
    goodsId: Number,
    goodsImg: String,
    goodsName: String,
    shopPrice: String,
    area: String,
    tag: {
      type: String,
      optionalTypes: [Number],
      value: '',
    },
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
