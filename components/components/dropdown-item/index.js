Component({
  options: {
    pureDataPattern: /^_/,
  },
  properties: {
    options: {
      type: Array,
      value: [],
    },
    value: {
      type:String,
      optionalTypes:[Number],
      value:''
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
    activeTextColor: {
      type: 'String',
      value: 'red',
    },
    markerWidth: {
      type: Number,
      optionalTypes: [String],
      value: 5,
    },
    markerColor: {
      type: String,
      value: '#d7d7d7',
    },
    activeMarkerColor: {
      type: String,
    },
  },
  data: {
    currentTitle: '',
    currentValue: '',
    markerStyle: '',
    showOptions: true,
    borderStyle: '',
  },
  attached() {
    if (!this.data.activeMarkerColor) {
      this.setData({ activeMarkerColor: this.data.activeTextColor });
    }
    if (this.data.border) {
      const sides = this.data.removeSideBorder.split(',').map((v) => v.trim());
      const borderColor = this.data.borderColor;
      let borderStyle = `border: 1px solid ${borderColor};`;
      if (sides.includes('l') || sides.includes('left')) {
        borderStyle += 'border-left: none;';
      }
      if (sides.includes('r') || sides.includes('right')) {
        borderStyle += 'border-right: none;';
      }
      if (sides.includes('t') || sides.includes('top')) {
        borderStyle += 'border-top: none;';
      }
      if (sides.includes('b') || sides.includes('bottom')) {
        borderStyle += 'border-bottom: none;';
      }
      this.setData({ borderStyle });
    }
    const currentValue = this.data.value;
    const markerWidth = this.data.markerWidth;
    const markerColor = this.data.markerColor;
    this.setData({
      currentValue,
      markerStyle: `border-width: ${markerWidth}px ${markerWidth}px 0 ${markerWidth}px;
                    border-color: ${markerColor} transparent transparent transparent`,
    });
  },
  observers: {
    currentValue(v) {
      const markerWidth = this.data.markerWidth;
      const markerColor = this.data.markerColor;
      const markerStyle = `border-width: ${markerWidth}px ${markerWidth}px 0 ${markerWidth}px;
                           border-color: ${markerColor} transparent transparent transparent`;
      const currentItem = this.data.options.find((v) => String(v.value) === String(this.data.currentValue));
      this.setData({ ...(currentItem && { currentTitle: currentItem.title, markerStyle, showOptions: false }) });
    },
  },
  methods: {
    toggleShowOptions() {
      const markerWidth = this.data.markerWidth;
      const markerColor = this.data.markerColor;
      const activeMarkerColor = this.data.activeMarkerColor;
      const showOptions = this.data.showOptions;
      const markerStyle = showOptions
        ? `border-width: ${markerWidth}px ${markerWidth}px 0 ${markerWidth}px;
           border-color: ${markerColor} transparent transparent transparent`
        : `border-width: 0 ${markerWidth}px ${markerWidth}px ${markerWidth}px;
           border-color: transparent transparent ${activeMarkerColor} transparent`;
      this.setData({ markerStyle, showOptions: !showOptions });
    },
    toggleCurrentValue(e) {
      const { value } = e.currentTarget.dataset;
      this.setData({ currentValue: value });
      this.triggerEvent('change', { value });
    },
  },
});
