const app = getApp();
const { setObserver } = require('q-weapp-observer');
Page({
  data: {
    a: {
      age: 18,
    },
    tabsList: [
      { title: '123', id: 1 },
      { title: '456', id: 2 },
      { title: '789', id: 3 },
    ],
  },
  watch: {
    a(newV, oldV) {
      console.log('a', newV, oldV);
    },
    'a.age'(newV, oldV) {
      console.log('a.age', newV, oldV);
    },
  },
  onLoad: function() {
    setObserver(this);
    this.data.a = { name: 'tq' };
    this.data.a.age = 27;
    // this.setData({ 'a.age': '27' });
    // this.setData({a: {name:'tq'}})
  },
  onShow() {
    this.setData({ tabList: this.data.tabsList.concat([{ title: 'abc', id: 2 }]) });
  },
});
