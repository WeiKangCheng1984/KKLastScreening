/**
 * 修復 EISDIR: illegal operation on a directory, readlink '_app.js'
 * 發生於 Windows 非 C 槽或無 symlink 權限時，npm 會把 next 內的 _app.js 解成目錄。
 * 若 _app.js 是目錄則刪除並寫入正確內容。
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const appJsPath = path.join(root, 'node_modules', 'next', 'dist', 'pages', '_app.js');

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
  if (!fs.existsSync(appJsPath)) return;
  const stat = fs.statSync(appJsPath);
  if (!stat.isDirectory()) return;

  fs.rmSync(appJsPath, { recursive: true, force: true });
  fs.writeFileSync(appJsPath, APP_JS_CONTENT, 'utf8');
  console.log('已修復: next/dist/pages/_app.js (原為目錄，已改為檔案)');
}

fix();
