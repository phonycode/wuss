/**
 * @param {string} type icon类型
 * @param {string} message 提示内容
 * @param {number} duration 自动关闭的延时，单位毫秒
 * @param {string} position 弹出位置,可选值:  default  top  middle  bottom
 * @param {boolean} mask 是否显示透明蒙层，防止触摸穿透
 */
const DEFAULTS_OPTS = {
  type: '',
  duration: 1500,
  mask: true,
  message: '',
  size: 50,
  position: 'default',
};

const DEFAULT_TOAST = {
  hide: null, // 隐藏hide方法
  time: null, // 定时器
};
const DURATION = 100;
let wussToast = { ...DEFAULT_TOAST };
const toast_Animation = wx.createAnimation({ duration: DURATION });

Component({
  /**
   * 继承父组件的class
   */
  externalClasses: ['wuss-class'],

  /**
   * 组件的初始数据
   * @param {boolean} visible 组件是否可见
   */
  data: {
    visible: false,
    animationData: {},
  },

  /**
   * 组件方法列表
   */
  methods: {
    show({ position = 'default', ...opts }) {
      const p = new Promise(resolve => {
        if (wussToast.time) {
          wussToast.hide(true);
          wussToast = { ...DEFAULT_TOAST };
        }

        wussToast.hide = isHide => {
          this.hide.call(this, position, isHide);
          resolve(true);
        };
        this.setData(
          {
            ...DEFAULTS_OPTS,
            ...opts,
            position,
            visible: true,
          },
          () => {
            setTimeout(() => {
              this._move(position, wussToast);
            }, 20);
          }
        );
      });
      wussToast.then = (resolve, reject) => {
        return p.then(resolve, reject);
      };
      return wussToast;
    },
    _move(position, wussToast) {
      switch (position) {
        case 'top':
          toast_Animation.top('170rpx');
          break;
        case 'bottom':
          toast_Animation.bottom('170rpx');
          break;
      }
      this.setData(
        {
          animationData: toast_Animation
            .opacity(1)
            .step()
            .export(),
        },
        () => {
          this.data.duration &&
            (wussToast.time = setTimeout(
              wussToast.hide,
              this.data.duration + DURATION
            ));
        }
      );
    },
    hide(position, isHide) {
      clearTimeout(wussToast.time);
      wussToast = { ...DEFAULT_TOAST };
      switch (position) {
        case 'top':
          toast_Animation.top('0');
          break;
        case 'bottom':
          toast_Animation.bottom('0');
          break;
      }

      this.setData(
        {
          animationData: toast_Animation
            .opacity(0)
            .step()
            .export(),
        },
        () => {
          !isHide &&
            setTimeout(() => {
              this.setData({ position: '', visible: false });
            }, DURATION);
        }
      );
    },
    toastClick() {},
  },
});
