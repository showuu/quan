let INSTANCES = [];
const THRESHOLD = 0.3;
Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    leftWidth: {
      type: Number,
      value: 0,
    },
    rightWidth: {
      type: Number,
      value: 0,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    asyncClose: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    // catchMove: false,
  },
  created() {
    this.offset = 0;
    INSTANCES.push(this);
  },
  detached() {
    INSTANCES = INSTANCES.filter((item) => item !== this);
  },
  observers: {
    leftWidth(leftWidth) {
      if (leftWidth === void 0) {
        leftWidth = 0;
      }
      if (this.offset > 0) {
        this.swipeMove(leftWidth);
      }
    },
    rightWidth(rightWidth) {
      if (rightWidth === void 0) {
        rightWidth = 0;
      }
      if (this.offset < 0) {
        this.swipeMove(-rightWidth);
      }
    },
  },
  methods: {
    open(position) {
      const leftWidth = this.data.leftWidth;
      const rightWidth = this.data.rightWidth;
      const offset = position === 'left' ? leftWidth : -rightWidth;
      this.swipeMove(offset);
      this.triggerEvent('open', {
        position,
        // name: this.data.name,
      });
    },
    close() {
      this.swipeMove(0);
    },
    swipeMove(offset) {
      if (offset === void 0) {
        offset = 0;
      }
      this.offset = Math.min(Math.max(offset, -this.data.rightWidth), this.data.leftWidth);
      const transform = 'translate3d(' + this.offset + 'px, 0, 0)';
      const transition = this.dragging ? 'none' : 'transform .6s cubic-bezier(0.18, 0.89, 0.32, 1)';
      this.setData({
        wrapperStyle: `-webkit-transform:${transform};
                      -webkit-transition:${transition};
                      transform:${transform};
                      transition:${transition}`,
      });
    },
    swipeLeaveTransition() {
      const leftWidth = this.data.leftWidth;
      const rightWidth = this.data.rightWidth;
      const offset = this.offset;
      if (rightWidth > 0 && -offset > rightWidth * THRESHOLD) {
        this.open('right');
      } else if (leftWidth > 0 && offset > leftWidth * THRESHOLD) {
        this.open('left');
      } else {
        this.swipeMove(0);
      }
      // this.setData({ catchMove: false });
    },
    resetTouchStatus() {
      this.direction = '';
      this.deltaX = 0;
      this.deltaY = 0;
      this.offsetX = 0;
      this.offsetY = 0;
    },
    touchStart(event) {
      this.resetTouchStatus();
      const touch = event.touches[0];
      this.startX = touch.clientX;
      this.startY = touch.clientY;
    },
    touchMove(event) {
      const touch = event.touches[0];
      this.deltaX = touch.clientX - this.startX;
      this.deltaY = touch.clientY - this.startY;
      this.offsetX = Math.abs(this.deltaX);
      this.offsetY = Math.abs(this.deltaY);
      // this.direction =
      //   this.direction || getDirection(this.offsetX, this.offsetY);
    },
    onDrag(e) {
      if (this.data.disabled) {
        return;
      }
      this.touchMove(e);
      // if (this.direction !== 'horizontal') {
      //   return;
      // }
      this.dragging = true;
      // INSTANCES.filter((item) => item !== this).forEach((item) => item.close());
      // this.setData({ catchMove: true });
      this.swipeMove(this.startOffset + this.deltaX);
    },
    startDrag(e) {
      if (this.data.disabled) {
        return;
      }
      INSTANCES.filter((item) => item !== this).forEach((item) => item.close());
      this.startOffset = this.offset;
      this.touchStart(e);
    },
    endDrag() {
      if (this.data.disabled) {
        return;
      }
      this.dragging = false;
      this.swipeLeaveTransition();
    },
    onClick(e) {
      const { key } = e.currentTarget.dataset;
      const position = key === void 0 ? 'outside' : key;
      this.triggerEvent('click', { position, instance: this });
      if (!this.offset) {
        return;
      }
      if (this.data.asyncClose) {
        this.triggerEvent('close', {
          position,
          instance: this,
          // name: this.data.name,
        });
      } else {
        this.swipeMove(0);
      }
    },

    onTouchMove(e) {
      // console.log('touchmove:', e)
    },
  },
});
