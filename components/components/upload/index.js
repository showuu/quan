Component({
  properties: {
    max: {
      type: Number,
      value: 0,
    },
    count: {
      type: Number,
      value: 9,
    },
    fileType: String,
    showChooseFile: {
      type: Boolean,
      value: true,
    },
    files: Array,
    hasInput: {
      type: Boolean,
      value: false,
    },
  },
  data: {
    uploadText: '',
  },
  attached() {
    const fileType = this.data.fileType;
    let uploadText = '';
    if (fileType.toLowerCase() === 'image') {
      uploadText = '上传照片';
    } else if (fileType.toLowerCase() === 'video') {
      uploadText = '上传视频';
    } else {
      uploadText = '上传图片或视频';
    }
    this.setData({ uploadText });
  },
  methods: {
    chooseFile() {
      const { max, fileType, files } = this.data;
      const count = max ? Math.min(max - files.length, this.data.count) : this.data.count;
      if (fileType.toLowerCase() === 'image') {
        wx.chooseImage({
          count,
          success: res => {
            res.tempFiles.forEach(v => {
              v.fileType = 'image';
              v.url = v.path;
            });
            this.triggerEvent('choosesuccess', res);
            // this.setData({ files: files.concat(res.tempFiles) });
          },
          fail: err => {
            this.triggerEvent('choosefail', err);
          },
        });
      } else if (fileType.toLowerCase() === 'video') {
        wx.chooseVideo({
          success: res => {
            const tempFiles = [];
            res.fileType = 'video';
            res.url = res.tempFilePath;
            tempFiles.push(res);
            this.triggerEvent('choosesuccess', { errMsg: res.errMsg, tempFiles });
          },
          fail: err => {
            this.triggerEvent('choosefail', err);
          },
        });
      }
    },
    priviewFile(e) {
      const { index, url } = e.currentTarget.dataset;
      const { fileType, files } = this.data;
      if (fileType === 'image') {
        wx.previewImage({
          urls: files.map(v => v.url),
          current: url,
        });
      } else {
        wx.previewMedia({
          sources: files.map(v => {
            return {
              url: v.url,
              type: v.fileType,
            };
          }),
          current: index,
        });
      }
    },
    replaceFile(e) {
      const { fileType } = this.data;
      const { index } = e.currentTarget.dataset;
      if (fileType.toLowerCase() === 'image') {
        wx.chooseImage({
          count: 1,
          success: res => {
            res.tempFiles.forEach(v => {
              v.fileType = 'image';
              v.url = v.path;
            });
            this.triggerEvent('replace', { ...res, index });
          },
          fail: err => {
            this.triggerEvent('replacefail', err);
          },
        });
      } else if (fileType.toLowerCase() === 'video') {
        wx.chooseVideo({
          success: res => {
            const tempFiles = [];
            res.fileType = 'video';
            res.url = res.tempFilePath;
            tempFiles.push(res);
            this.triggerEvent('replace', { errMsg: res.errMsg, tempFiles, index });
          },
          fail: err => {
            this.triggerEvent('choosefail', err);
          },
        });
      }
    },
    deleteFile(e) {
      const { files } = this.data;
      const { index } = e.currentTarget.dataset;
      files.splice(index, 1);
      this.setData({ files });
      this.triggerEvent('delete', { files, index });
    },
    onInput(e) {
      const { index } = e.currentTarget.dataset;
      this.triggerEvent('input', { ...e.detail, index });
    },
  },
});
