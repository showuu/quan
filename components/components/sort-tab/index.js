Component({
  options: {
    pureDataPattern: /^_/,
  },
  properties: {
    tabList: {
      type: Array,
      value: [],
    },
    border: {
      type: Boolean,
    },
    borderColor: {
      type: String,
      value: '#F5F5F9',
    },
    removeSideBorder: {
      type: String,
      value: '',
    },
    activeTextBold: {
      type: Boolean,
      value: false,
    },
    textColor: {
      type: String,
      value: '',
    },
    activeTextColor: {
      type: 'String',
    },
    iconWidth: {
      type: Number,
      optionalTypes: [String],
      value: 5,
    },
    iconColor: {
      type: String,
      value: '#d7d7d7',
    },
    activeIconColor: {
      type: String,
      value: 'red',
    },
    gap: {
      type: Number,
      optionalTypes: [String],
      value: 4,
    },
    initial: {
      type: String,
      value: 'desc',
    },
  },
  data: {
    sortList: [],
    firstBorderStyle: '',
    lastBorderStyle: '',
    borderStyle: '',
    _initial: [],
  },
  attached() {
    if (!['asc', 'desc', 'ascending', 'descending'].includes(this.data.initial.toLowerCase())) {
      this.data._initial = 'desc';
    } else {
      this.data._initial = this.data.initial.toLowerCase();
    }
    if (!this.data.activeTextColor) {
      this.data.activeTextColor = this.data.textColor;
    }
    if (this.data.border) {
      const sides = this.data.removeSideBorder.split(',').map((v) => v.trim());
      const borderColor = this.data.borderColor;
      let firstBorderStyle = `border: 1px solid ${borderColor}; border-right: none;`;
      let lastBorderStyle = `border: 1px solid ${borderColor}; border-left: none;`;
      let borderStyle = `border: 1px solid ${borderColor};`;
      if (sides.includes('l') || sides.includes('left')) {
        firstBorderStyle += 'border-left: none;';
      }
      if (sides.includes('r') || sides.includes('right')) {
        lastBorderStyle += 'border-right: none;';
      }
      if (sides.includes('t') || sides.includes('top')) {
        firstBorderStyle += 'border-top: none;';
        lastBorderStyle += 'border-top: none;';
        borderStyle += 'border-top: none;';
      }
      if (sides.includes('b') || sides.includes('bottom')) {
        firstBorderStyle += 'border-bottom: none;';
        lastBorderStyle += 'border-bottom: none;';
        borderStyle += 'border-bottom: none;';
      }
      this.setData({
        firstBorderStyle,
        lastBorderStyle,
        borderStyle,
      });
    }
    this.setData({ sortList: this.data.tabList });
  },
  observers: {},
  methods: {
    toggleSortTab(e) {
      const { name } = e.currentTarget.dataset;
      const sortList = this.data.sortList;
      for (let i = 0; i < sortList.length; i++) {
        if (sortList[i].name === name) {
          const order = sortList[i].order === this.data._initial ? this.reverseOrder() : this.data._initial;
          this.setData({ [`sortList[${i}].order`]: order });
          this.selectComponent(`#sort-${name}`).setData({ order });
          this.triggerEvent('change', { order, ...sortList[i] });
        } else if (sortList[i].order) {
          this.setData({ [`sortList[${i}].order`]: '' });
          this.selectComponent(`#sort-${sortList[i].name}`).setData({ order: '' });
        }
      }
    },
    reverseOrder() {
      return this.data._initial === 'desc' ? 'asc' : 'desc';
    },
  },
});
