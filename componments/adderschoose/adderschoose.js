/* region-picker.js */
// import area from '本地 json 数据';
let  areaclean = []
Component({
  properties: {
    showRegion: {
      type: Boolean,
      observer: function (newVal, oldVal) {
        this.setData({
          dialog: newVal,
        });
      },
    },
    areaPlace: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        areaclean = newVal
        this.setData({
          area: newVal,
          region: {
            tabs: [
              {
                name: '请选择',
                id: '',
              },
              {
                name: '请选择',
                id: '',
              },
              {
                name: '请选择',
                id: '',
              },
            ],
            select: 0,
          }
        });
      },
    },
    regionValue: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        // console.log(newVal)
        if (newVal.length > 0) {
          let select = -1;
          for (let i = newVal.length - 1; i >= 0; i--) {
            if (newVal[i].id !== '') {
              select = i;
              break;
            }
          }
          // 除最低级别区（select = 2）以外，需要获取当前级别下一级的数据
          this.setData({
            ['region.tabs']: newVal,
            ['region.select']: select < 2 ? select + 1 : select,
          }, () => {
            this.setData({
              area: this.getChildArea(select < 2 ? select + 1 : select),
            });
          });
        } 
      },
    },
  },
  data: {
    dialog: false,
    area: [],
    region: {
      tabs: [
        {
          name: '请选择',
          id: '',
        },
        {
          name: '请选择',
          id: '',
        },
        {
          name: '请选择',
          id: '',
        },
      ],
      select: 0,
    },
  },
  methods: {
    close() {
      // wx.showToast({
      //   title: '未选择所在地',
      //   icon: 'none',
      //   duration: 2000,
      // });
      this.setData({
        dialog: false,
      });
      let myEventDetail = {}; // detail对象，提供给事件监听函数
      let myEventOption = {}; // 触发事件的选项
      myEventDetail = {
        showRegion: this.data.dialog,
      };
      this.triggerEvent('close', myEventDetail, myEventOption);
    },
    // 关闭 picker 触发的方法
    emitHideRegion: function () {
      let myEventDetail = {}; // detail对象，提供给事件监听函数
      let myEventOption = {}; // 触发事件的选项
      this.setData({
        dialog: false,
      });
      myEventDetail = {
        showRegion: this.data.dialog,
        regionValue: this.data.region.tabs,
      };
      this.triggerEvent('myevent', myEventDetail, myEventOption);
    },
    bindRegionChange: function (e) {
      // 获取当前选中项的name和id并赋值给data中的数据
      let id = 'region.tabs[' + this.data.region.select + '].id';
      // console.log(id, e.target.dataset.id)
      let name = 'region.tabs[' + this.data.region.select + '].name';
      // console.log(name, e.target.dataset.name)
      // console.log(this.data.region.select)
      this.setData({
        [id]: e.target.dataset.id,
        [name]: e.target.dataset.name,
      });
      // 除了三级以外的需要获取对应子选项
      if (this.data.region.select < 2) {
        this.setData({
          ['region.select']: ++this.data.region.select,
        }, () => {
          // 获取子选项
          this.setData({
            area: this.getChildArea(this.data.region.select),
          });
        });
      } else {
        // 三级选项选择完毕关闭省市区选择器
        this.emitHideRegion();
      }
    },
    getChildArea: function (level) {
      let _id = '';
      // 默认取完整的数据
      let _area = this.data.area;
      // 根据层级取当前层级下的数据
      for (let i = 0; i < level; i++) {
        _id = this.data.region.tabs[i].name;
        for (let j = 0; j < _area.length; j++) {
          if (_area[j].name === _id) {
            _area = _area[j]._child;
            break;
          }
        }
      }
      return _area;
    },
    // 省市区tab切换
    changeRegionLevel: function (e) {
      let level = e.target.dataset.level;
      // console.log(level)
      // 三级选项的tab点击无效果
      if (level === 2) return false;
      // 当前选中tab和级别小于当前选中tab的状态都置为初始化状态
      for (let i = level; i < 3; i++) {
        let string = 'region.tabs[' + i + ']';
        this.setData({
          [string]: {
            name: '请选择',
            id: '',
          },
        });
      }
      this.setData({
        ['region.select']: level,
      });
      this.setData({
        area: areaclean,
        region: {
            tabs: [
              {
                name: '请选择',
                id: '',
              },
              {
                name: '请选择',
                id: '',
              },
              {
                name: '请选择',
                id: '',
              },
            ],
            select: 0,
          }
      });
    },
  },
});