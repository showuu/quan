Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    label: String,
    itemOptions: {
      type: Array,
      value: [],
    },
    hidden: Boolean,
  },
  data: {
    selectedItem: {},
  },
  observers: {
    itemOptions() {
      this.setData({ ...(this.data.itemOptions.length && { selectedItem: this.data.itemOptions[0] }) });
    },
  },
  methods: {
    onTap() {
      const itemOptions = this.data.itemOptions;
      const itemList = itemOptions.map((v) => v.name);
      wx.showActionSheet({
        itemList,
        success: ({ tapIndex }) => {
          this.setData({
            selectedItem: itemOptions[tapIndex],
          });
          this.triggerEvent('change', itemOptions[tapIndex]);
        },
      });
    },
  },
});
