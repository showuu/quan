Component({
  properties: {
    value: String,
    focus: {
      type: Boolean,
      value: false,
    },
    disabled: {
      type: Boolean,
      value: false,
    },
    hideBtn: {
      type: Boolean,
      value: false,
    },
    placeholder: {
      type: String
    }
  },
  methods: {
    onInput(e) {
      this.setData({ value: e.detail.value });
      this.triggerEvent('input', e.detail.value);
    },
    onConfirm(e) {
      this.triggerEvent('search', { value: e.detail.value });
    },
    onSearch(e) {
      this.triggerEvent('search', { value: this.data.value });
    },
  },
});
