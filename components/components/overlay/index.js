Component({
  properties: {
    show: Boolean,
    zIndex: {
      type: Number,
      optionalTypes: [String],
      value: 999,
    },
    bgColor: {
      type: String,
      value: 'rgba(0, 0, 0, 0.7)',
    },
    duration: {
      type: Number,
      optionalTypes: [String],
      value: 0.3,
    },
    style: {
      type: String,
    },
  },
});
