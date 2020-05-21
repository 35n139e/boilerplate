module.exports = {
  src: 'src/img/icon/*.png',
  destImage: 'src/img/icon.png',
  destCss: 'src/sass/contents/component/sprite/_icon.scss',
  imgPath: 'img/icon.png',
  algorithm: 'top-down',
  algorithm: 'top-down',
  cssTemplate: '<%= settings.config %>spritesmith.txt',
  cssVarMap: function (sprite) {
    var prefix = 'sprite-icon-';
    sprite.name = prefix + sprite.name;
  },
  cssOpts: {
    prefix: 'sprite-icon',
    extendImage: '<%= sprite.icon.imgPath %>'
  },
};