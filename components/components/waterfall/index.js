Component({
  properties: {
    column: {
      type: Number,
      value: 2,
    },
    data: Array,
  },
  data: {
    _dataList: [],
    columnList: [],
    _heightList: [],
  },
  observers: {
    data() {
      this.distributeData();
    },
  },
  attached() {
    const { column, columnList, _heightList } = this.data;
    for (let i = 0; i < column; i++) {
      columnList.push([]);
      _heightList.push(0);
    }
    this.setData({ columnList });
    wx.nextTick(() => {
      this.distributeData();
    });
  },
  methods: {
    onCardTap(e) {
      const { articleId } = e.currentTarget.dataset;
      const detail = this.data.data.find((v) => v.articleId === articleId);
      this.triggerEvent('cardtap', detail);
    },
    async distributeData() {
      const { columnList, data, _heightList } = this.data;
      let { _dataList } = this.data;
      if (!columnList.length) {
        return;
      }
      if (!data.length) {
        for (let i = 0; i < columnList.length; i++) {
          columnList[i] = [];
          _heightList[i] = 0;
        }
        this.setData({ columnList, _dataList: [], _heightList });
        return;
      }
      for (let i = 0; i < data.length; i++) {
        if (_dataList[i] && data[i].src === _dataList[i].src) {
          continue;
        } else if (_dataList[i]) {
          const { columnIndex, positionIndex } = _dataList[i];
          console.log(columnIndex, positionIndex);
          for (let j = 0; j < columnList.length; j++) {
            if (j >= columnIndex) {
              columnList[j] = columnList[j].slice(0, positionIndex);
            } else {
              columnList[j] = columnList[j].slice(0, positionIndex + 1);
            }
          }
          _dataList = _dataList.slice(0, i);
          this.setData({ columnList });
        }
        await this.getColumnHeight();
        const index = _heightList.indexOf(Math.min(..._heightList));
        _dataList[i] = data[i];
        _dataList[i].columnIndex = index;
        _dataList[i].positionIndex = columnList[index].length;
        columnList[index].push(_dataList[i]);
        this.setData({ columnList });
      }
      this.setData({ _dataList });
    },
    getColumnHeight() {
      const { _heightList } = this.data;
      return new Promise((resolve, reject) => {
        const query = wx.createSelectorQuery().in(this);
        query
          .selectAll('.column_view')
          .fields({ size: true })
          .exec((res) => {
            // console.log('高度:', res[0]);
            for (let i = 0; i < res[0].length; i++) {
              _heightList[i] = res[0][i].height;
            }
            // console.log(_heightList);
            resolve();
          });
      });
    },
  },
});
