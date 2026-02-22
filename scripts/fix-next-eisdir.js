/**
 * 修復 EISDIR: illegal operation on a directory, readlink '_app.js'
 * 使用 require.resolve 取得實際的 next 安裝路徑後修復。
 */
const fs = require('fs');
const path = require('path');

let appJsPath;
try {
  const nextPkg = require.resolve('next/package.json', { paths: [process.cwd()] });
  appJsPath = path.join(path.dirname(nextPkg), 'dist', 'pages', '_app.js');
} catch (_) {
  appJsPath = path.resolve(process.cwd(), 'node_modules', 'next', 'dist', 'pages', '_app.js');
}

const APP_JS_CONTENT = `"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return App;
    }
});
const _interop_require_default = require("@swc/helpers/_/_interop_require_default");
const _jsxruntime = require("react/jsx-runtime");
const _react = /*#__PURE__*/ _interop_require_default._(require("react"));
const _utils = require("../shared/lib/utils");
async function appGetInitialProps(param) {
    let { Component, ctx } = param;
    const pageProps = await (0, _utils.loadGetInitialProps)(Component, ctx);
    return {
        pageProps
    };
}
class App extends _react.default.Component {
    render() {
        const { Component, pageProps } = this.props;
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(Component, {
            ...pageProps
        });
    }
}
App.origGetInitialProps = appGetInitialProps;
App.getInitialProps = appGetInitialProps;

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  Object.assign(exports.default, exports);
  module.exports = exports.default;
}
`;

function fix() {
  if (!fs.existsSync(appJsPath)) {
    console.log('[fix-next-eisdir] 路徑不存在，跳過:', appJsPath);
    return;
  }
  let stat;
  try {
    stat = fs.statSync(appJsPath);
  } catch (err) {
    console.log('[fix-next-eisdir] stat 失敗:', err.message);
    return;
  }
  if (stat.isDirectory()) {
    try {
      fs.rmSync(appJsPath, { recursive: true, force: true });
      fs.writeFileSync(appJsPath, APP_JS_CONTENT, 'utf8');
      console.log('[fix-next-eisdir] 已修復: _app.js 原為目錄，已改為檔案');
    } catch (err) {
      console.error('[fix-next-eisdir] 修復失敗:', err.message);
      process.exit(1);
    }
    return;
  }

  if (stat.isFile() && stat.size < 100) {
    try {
      fs.writeFileSync(appJsPath, APP_JS_CONTENT, 'utf8');
      console.log('[fix-next-eisdir] 已修復: _app.js 內容過短，已覆寫');
    } catch (err) {
      console.error('[fix-next-eisdir] 修復失敗:', err.message);
      process.exit(1);
    }
  }
}

fix();
