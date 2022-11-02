# THEOplayer Web SDK と Vue.js v3/Vite フレームワークを使ったストリーミング プレーヤー アプリの実装例

このリポジトリでは、シンプルなストリーミング プレーヤー アプリの実装例として、THEOplayer Web SDK と Vue.js v3 フレームワークを統合する方法について公開しています。

THEOplayer は、THEO Technologies によって開発されたユニバーサル ビデオ プレーヤー ソリューションです。 THEOplayer は、複数のプラットフォーム (HTML5 (Web)、Apple iOS、Apple tvOS、Google Android、Google Android TV、Samsumg Tizen、LG webOS、Amazon FireTV、ROKU など) 用のプレーヤー SDK を提供し、HLS、MPEG-DASH、広告、DRM などを様々な機能をサポートします。

Vue は、ユーザー インターフェイスを構築するための進歩的な JavaScript フレームワークです。これは、標準の HTML/CSS/JavaScript の上に構築され、宣言型のコンポーネント ベースのプログラミング モデルを提供します。Vue エコシステムは、フロントエンド開発に必要な一般的な機能のほとんどをカバーしています。しかし、Web は非常に多様で、私たちが Web 上に構築するものは、形態や規模が大幅に異なる場合があります。 Vue は、こういった様々なシナリオに対して、柔軟で段階的に採用できるように設計されています。ユースケースに応じて、Vue はさまざまな方法で使用できます。このため、近年では人気の開発フレームワークになってきています。

* ビルドステップなしで静的 HTML を強化する
* 任意のページに Web コンポーネントとして埋め込む
* シングルページ アプリケーション (SPA)
* フルスタック / サーバーサイド レンダリング (SSR)
* Jamstack / 静的サイト生成 (SSG)
* デスクトップ、モバイル、WebGL などの様々なプラットフォームをターゲットとする

このプレーヤーの実装例では、Vue CLI ツールによって提供されるスターター テンプレートを使って用意され、Vue3/Vite およびコンポジション API を使用して、プレイヤーを統合しています。

このプレーヤーの実装例の Git リポジトリを GitHub で公開しています: [https://github.com/liveinstantly/theoplayer-web-vue3-example](https://github.com/liveinstantly/theoplayer-web-vue3-example)

詳細は、リポジトリの内容を参照してください。

## THEOplayer Web SDK を統合するためのステップバイステップ

### 前提条件

このガイドでは、次の開発ツールが使用されています。

| 開発ツール | バージョン |
| ----- | -------: |
| npm   | 8.19.2   |
| yarn  | 1.22.5   |
| node  | v16.18.0 |

### 1. Vue3 アプリ テンプレートを作成する

次のコマンドを実行して、新規の Vue3 アプリケーション テンプレートを作成します。

```shell
yarn create vite theoplayer-web-vue-example --template vue-ts
```

コマンド出力は次のようになります。

```text
yarn create v1.22.5
[1/4] Resolving packages...
[2/4] Fetching packages...
[3/4] Linking dependencies...
[4/4] Building fresh packages...
success Installed "create-vite@3.1.0" with binaries:
      - create-vite
      - cva

Scaffolding project in C:\srcs\THEOplayer\theoplayer-web-vue-example...

Done. Now run:

  cd theoplayer-web-vue-example
  yarn
  yarn dev

Done in 14.52s.
```

### 2. 必要なコンポーネントをインストールする

次のコマンドを実行して、Vue フレームワーク パッケージの依存関係をインストールします。

```shell
yarn install
```

> yarn コマンド出力の `esbuild` モジュールに関する情報メッセージは無視できます。

### 3.THEOplayer を統合する

#### 3.1 モジュール宣言の追加 (THEOplayer.d.ts)

次のコマンドを実行して、THEOplayer Web SDK の型定義モジュールを含む theoplayer NPM パッケージをインストールします。

```shell
yarn add theoplayer
```

#### 3.2 THEOplayer Web SDK の `Player.vue` を追加

次のコードを `src/components` フォルダに `Player.vue` として追加します。
このコードは Vue3 Composition API に基づいており、上位の（親の）コンポーネントから指定された `source` 配列変数を引数として使って、プレイヤーが動作します。

```typescript
<script setup lang="ts">
import { ref, onMounted } from "vue";

const theoplayer = ref<HTMLElement | null>(null);
const props = defineProps<{ source: Array<any> }>();

function playerInit() {
  if (theoplayer.value != null) {
    const player = new window.THEOplayer.Player(theoplayer.value, {
      fluid: true,
      libraryLocation: "//cdn.theoplayer.com/dash/theoplayer/",
    });
    player.source = {
      sources: props.source,
    };
  }
}

onMounted(() => {
  playerInit();
});
</script>

<template>
  <div
    class="theoplayer-container video-js theoplayer-skin vjs-16-9 theoplayer"
    ref="theoplayer"
  ></div>
</template>

<style scoped>
.theoplayer-container {
  margin: 0 auto;
  padding-top: 56.24%;
  width: 100%;
}
</style>
```

#### 3.3 `Player.vue` コンポーネントを `App.vue` に追加する

`src/App.vue` の `<script setup>` セクション (`HelloWorld` コンポーネントをインポートする命令行の後) に、次のスクリプト コードを追加します。

```typescript
import Player from "./components/Player.vue";
import { ref } from "vue";
const source = ref([
  {
    type: "application/x-mpegurl",
    src: "//cdn.theoplayer.com/video/elephants-dream/playlist.m3u8",
  },
]);
```

最初の `<div>` ブロックの直後の `src/App.vue` の `<template>` セクションに次の行を追加します。

```html
    <Player :source="source" v-if="source" />
```

#### 3.4 `main.ts` に THEOplayer の型宣言の読み込みを追加する

`src/main.ts` の `createApp` 関数呼び出しの行の前に、次のスクリプト コードを追加します。

```typescript
// Import types for THEOplayer
import theoplayer from "theoplayer";

declare global {
    interface Window {
        THEOplayer: typeof theoplayer;
    }
}
```

#### 3.5 `index.html` に THEOplayer JavaScript/CSS モジュールを追加する

次の行を `index.html` の `<head>` セクション (`</head>` 行の直前) に追加して、THEOplayer CSS をインポートします。

```html
    <link
      rel="stylesheet"
      type="text/css"
      href="//cdn.theoplayer.com/dash/theoplayer/ui.css"
    />
```

次の行を `index.html` の `<body>` セクション (`</body>` 行の直前) に追加して、THEOplayer JavaScript コードを読み込みます。

```html
    <script
      type="text/javascript"
      src="//cdn.theoplayer.com/dash/theoplayer/THEOplayer.js"
    ></script>
```

### 4. このサンプル アプリケーション コードを実行し、ブラウザで開きます

次のコマンドを実行して、コードをコンパイルし、ローカル サーバーを実行して、サンプル アプリケーションをホストします。

```shell
yarn dev
```

コマンド出力は次のようになります。

```text
yarn run v1.22.5
$ vite

  VITE v3.2.0  ready in 750 ms

  ➜  Local:   http://127.0.0.1:5174/
  ➜  Network: use --host to expose

```

`localhost` のホスト名と指定されたポートでアプリケーションを参照して、Vue3 Web アプリケーションの動作を確認できます。

このアプリケーション実装例では、一般に公開されているビルトイン ライセンス付きの THEOplayer プレーヤー SDK を使用しているため、明示的なライセンスなしで THEOplayer の再生機能を有効にすることができますが、ビルトイン ライセンスでは ホワイトリストに登録されたホスト名として `localhost` での動作のみが許可されます。 これは、`localhost` 以外でこのアプリケーションを実行すると、エラー メッセージ ("_The given license is invalid!_") が表示されることを意味します。

> `127.0.0.1` でブラウザアクセスを行った場合、ホワイトリストに登録された文字列の `localhost` と一致しないため、THEOplayer SDK のプレイヤーは動作しないことに注意してください。

スクリーンショットは次のとおりです:

![Screenshot of THEOplayer Vue3 application example](./screenshot-vue3-theoplayer-example.png)

## ローカルの THEOplayer Web SDK を使用する

独自の THEOplayer Web SDK を使用する場合は、(カスタマイズされた) Web SDK をホストする URL を参照するように変更するか、Web SDK を Vue3 ソース ツリーの `public` フォルダーに配置する必要があります。

次に、以下のファイルを変更して、THEOplayer SDK (JS/CSS とライブラリ) の場所を適切に指定する必要があります。

また、Player クラスの引数に、THEOplayer のポータルで取得したライセンスを設定する必要があります。

* index.html
* src/components/Player.vue

例えば、SDK ファイルを public/js/theoplayer フォルダーに配置すると、index.html と src/components/Player.vue は次のようになります:

`index.html`:

```html
  <head>
    :
    <link
      rel="stylesheet"
      type="text/css"
      href="/js/theoplayer/ui.css"
    />
  </head>
```

`index.html`:

```html
  <body>
    :
    <script
      type="text/javascript"
      src="/js/theoplayer/THEOplayer.js"
    ></script>
  </body>
```

`src/components/Player.vue`:

```typescript
    const player = new window.THEOplayer.Player(theoplayer.value, {
      fluid: true,
      libraryLocation: "/js/theoplayer/",
      license: "ライセンス文字列"
    });
```

## 最後に

シンプルなプレーヤー アプリの実装例として、THEOplayer Web SDK と Vue.js v3 フレームワークを統合する方法についてこのリポジトリで公開しています。詳細は、このリポジトリ内のサンプル アプリのソースコードを参照してください。

ご不明な点がございましたら、お気軽にお問い合わせください。
