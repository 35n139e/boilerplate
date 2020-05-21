# noname service Style Guide

## Grunt 設定
ディレクトリは下記settingファイルで変更出来る。

`grunt/settings.yml`


### 画像配置ディレクトリ
- html側で読み込む画像（imgタグを使用して読み込ませる画像）  
`src/images/`
- css側で読み込む画像（背景画像として読み込ませる画像）  
`src/img`


またCSSの背景画像パスは、相対パスで記述すること。

例）
`background-image:url('img/XXX.png');`


## スタイルガイドについて

当スタイルガイドは`kss-node`で作成されている。
詳細は[こちら](https://github.com/hughsk/kss-node)を参照してほしい。


### ビルド方法
root配下で以下を入力。
```
kss src/sass/contents styleguide --builder ./node_modules/michelangelo/kss_styleguide/custom-template/ --css /resources/styles/style.css
```

## テンプレート
- [userテンプレート](/template/user.html)