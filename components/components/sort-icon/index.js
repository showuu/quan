Component({
  options: {
    pureDataPattern: /^order$/,
  },
  properties: {
    width: {
      type: Number,
      optionalTypes: [String],
      value: 5,
    },
    color: {
      type: String,
      value: '#797b7d',
    },
    activeColor: {
      type: String,
      value: 'red',
    },
    gap: {
      type: Number,
      optionalTypes: [String],
      value: 4,
    },
  },
  data: {
    upIconColor: '',
    downIconColor: '',
    order: '',
  },
  attached() {
    this.setData({
      upIconColor: `transparent transparent ${this.data.color} transparent`,
      downIconColor: `${this.data.color} transparent transparent transparent`,
    });
  },
  observers: {
    order() {
      this.setStyle();
    },
  },
  methods: {
    setStyle() {
      if (this.data.order === 'asc') {
        this.setData({
          upIconColor: `transparent transparent ${this.data.activeColor} transparent`,
          downIconColor: `${this.data.color} transparent transparent transparent`,
        });
      } else if (this.data.order === 'desc') {
        this.setData({
          upIconColor: `transparent transparent ${this.data.color} transparent`,
          downIconColor: `${this.data.activeColor} transparent transparent transparent`,
        });
      } else {
        this.setData({
          upIconColor: `transparent transparent ${this.data.color} transparent`,
          downIconColor: `${this.data.color} transparent transparent transparent`,
        });
      }
    },
  },
});
