const http = require('../../utils/request.js');
const app = getApp();

Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    actionList: {
      type: Array,
      value: [],
    },
    goodsId: String,
    shopId: String,
    shopName: String,
    shopTel: String,
    favGood: Number,
  },
  data: {
    favGoodId: '',
  },
  observers: {
    favGood(v) {
      this.setData({ favGoodId: v });
    },
  },
  methods: {
    navigateToIndex() {
      wx.switchTab({ url: '/pages/home/index' });
    },
    navigateToKefu() {
      if (!app.globalData.isOpenIm) {
        wx.makePhoneCall({ phoneNumber: this.data.shopTel });
        return;
      }
      if (wx.getStorageSync('tokenId')) {
        const shopId = this.data.shopId;
        if (app.globalData.userData.shopId == shopId) {
          // 客服身份无法进入自己所属店铺，防止自己与自己聊天
          wx.showToast({
            title: '无法进入该店铺',
            icon: 'none',
            duration: 2000,
          });
          return;
        }
        const goodsId = this.data.goodsId;
        const shopName = this.data.shopName;
        const shopImg = this.data.shopImg;
        wx.navigateTo({ url: `/addons/package/pages/wstim/index?goodsId=${goodsId}&shopId=${shopId}&shopName=${shopName}&shopImg=${shopImg}` });
      } else {
        wx.navigateTo({ url: '/pages/login/index' });
      }
    },
    // 收藏和取消收藏
    toggleFavStatus() {
      const favGoodId = this.data.favGoodId;
      const goodsId = this.data.goodsId;
      const action = favGoodId ? 'cancel' : 'add';
      const id = favGoodId || goodsId;
      http.post(`/weapp/favorites/${action}`, { type: 0, id }, (res) => {
        if (res.status === 1) {
          wx.showToast({ title: res.msg });
          action === 'add' && this.setData({ favGoodId: res.data.fId });
          action === 'cancel' && this.setData({ favGoodId: 0 });
        } else {
          wx.showModal({ title: '提示', content: res.msg });
        }
      });
    },
    onCartBtnTap() {
      this.triggerEvent('addToCart', {});
    },
    onBuyBtnTap() {
      this.triggerEvent('buy', {});
    },
  },
});
