/******/ (() => { // webpackBootstrap
/******/ 	// runtime can't be in strict mode because a global variable is assign and maybe created.
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) {
        ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
      }
    }
    return n;
  }, _extends.apply(null, arguments);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _inheritsLoose)
/* harmony export */ });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inheritsLoose(t, o) {
  t.prototype = Object.create(o.prototype), t.prototype.constructor = t, (0,_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(t, o);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _setPrototypeOf)
/* harmony export */ });
function _setPrototypeOf(t, e) {
  return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) {
    return t.__proto__ = e, t;
  }, _setPrototypeOf(t, e);
}


/***/ }),

/***/ "./src/forum/components/SignupPage.js":
/*!********************************************!*\
  !*** ./src/forum/components/SignupPage.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SignupPage)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Component */ "flarum/common/Component");
/* harmony import */ var flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Component__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/utils/Stream */ "flarum/common/utils/Stream");
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3__);




var SignupPage = /*#__PURE__*/function (_Component) {
  (0,_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(SignupPage, _Component);
  function SignupPage() {
    return _Component.apply(this, arguments) || this;
  }
  var _proto = SignupPage.prototype;
  _proto.oninit = function oninit(vnode) {
    _Component.prototype.oninit.call(this, vnode);
    this.username = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()('');
    this.nickname = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()('');
    this.email = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()('');
    this.password = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_3___default()('');
    this.loading = false;
    this.error = null;
  };
  _proto.view = function view() {
    var _this = this;
    return m("div", {
      className: "LoginPage"
    }, m("div", {
      className: "LoginPage-container"
    }, m("h2", null, "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F"), this.error && m("div", {
      className: "Alert Alert--error"
    }, m("span", null, this.error)), m("form", {
      onsubmit: function onsubmit(e) {
        e.preventDefault();
        _this.onsubmit();
      }
    }, m("div", {
      className: "Form-group"
    }, m("input", {
      className: "FormControl",
      type: "text",
      placeholder: "\u041F\u043E\u0442\u0440\u0435\u0431\u0438\u0442\u0435\u043B\u0441\u043A\u043E \u0438\u043C\u0435",
      oninput: function oninput(e) {
        return _this.username(e.target.value);
      },
      disabled: this.loading
    })), m("div", {
      className: "Form-group"
    }, m("input", {
      className: "FormControl",
      type: "text",
      placeholder: "\u0414\u0438\u0441\u043F\u043B\u0435\u0439 \u0438\u043C\u0435",
      oninput: function oninput(e) {
        return _this.nickname(e.target.value);
      },
      disabled: this.loading
    })), m("div", {
      className: "Form-group"
    }, m("input", {
      className: "FormControl",
      type: "email",
      placeholder: "E-mail",
      oninput: function oninput(e) {
        return _this.email(e.target.value);
      },
      disabled: this.loading
    })), m("div", {
      className: "Form-group"
    }, m("input", {
      className: "FormControl",
      name: "password",
      type: "password",
      autocomplete: "new-password",
      placeholder: "\u041F\u0430\u0440\u043E\u043B\u0430",
      oninput: function oninput(e) {
        return _this.password(e.target.value);
      },
      disabled: this.loading
    })), m((flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default()), {
      className: "Button Button--primary Button--block",
      loading: this.loading,
      type: "submit"
    }, "\u0420\u0435\u0433\u0438\u0441\u0442\u0440\u0430\u0446\u0438\u044F"))));
  };
  _proto.onsubmit = function onsubmit() {
    var _this2 = this;
    this.loading = true;
    this.error = null;
    m.redraw();
    app.request({
      method: 'POST',
      url: app.forum.attribute('apiUrl') + '/users',
      body: {
        data: {
          type: 'users',
          attributes: {
            username: this.username(),
            nickname: this.nickname() ? this.nickname : this.username,
            email: this.email(),
            password: this.password()
          }
        }
      }
    }).then(function () {
      m.route.set(app.route('index'));
    })["catch"](function (e) {
      var _e$response, _e$response$errors, _e$response$errors$;
      _this2.loading = false;
      _this2.error = ((_e$response = e.response) == null ? void 0 : (_e$response$errors = _e$response.errors) == null ? void 0 : (_e$response$errors$ = _e$response$errors[0]) == null ? void 0 : _e$response$errors$.detail) || 'Sign up failed.';
      m.redraw();
    });
  };
  return SignupPage;
}((flarum_common_Component__WEBPACK_IMPORTED_MODULE_1___default()));


/***/ }),

/***/ "./src/forum/components/TagsPage.js":
/*!******************************************!*\
  !*** ./src/forum/components/TagsPage.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TagsPage)
/* harmony export */ });
/* harmony import */ var flarum_components_IndexPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/components/IndexPage */ "flarum/components/IndexPage");
/* harmony import */ var flarum_components_IndexPage__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_components_IndexPage__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_components_Link__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/Link */ "flarum/components/Link");
/* harmony import */ var flarum_components_Link__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Link__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/LoadingIndicator */ "flarum/components/LoadingIndicator");
/* harmony import */ var flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_helpers_listItems__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/helpers/listItems */ "flarum/helpers/listItems");
/* harmony import */ var flarum_helpers_listItems__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_helpers_listItems__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_helpers_humanTime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/helpers/humanTime */ "flarum/helpers/humanTime");
/* harmony import */ var flarum_helpers_humanTime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_helpers_humanTime__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_tags_common_helpers_tagIcon__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/tags/common/helpers/tagIcon */ "flarum/tags/common/helpers/tagIcon");
/* harmony import */ var flarum_tags_common_helpers_tagIcon__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_tags_common_helpers_tagIcon__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_tags_common_helpers_tagLabel__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/tags/common/helpers/tagLabel */ "flarum/tags/common/helpers/tagLabel");
/* harmony import */ var flarum_tags_common_helpers_tagLabel__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_tags_common_helpers_tagLabel__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_tags_common_utils_sortTags__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/tags/common/utils/sortTags */ "flarum/tags/common/utils/sortTags");
/* harmony import */ var flarum_tags_common_utils_sortTags__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_tags_common_utils_sortTags__WEBPACK_IMPORTED_MODULE_7__);








var TagsPage = /*#__PURE__*/function () {
  function TagsPage() {}
  var _proto = TagsPage.prototype;
  _proto.oninit = function oninit() {
    var _this = this;
    this.loading = true;
    app.store.find('tags', {
      include: 'lastPostedDiscussion,lastPostedDiscussion.lastPostedUser'
    }).then(function (tags) {
      _this.tags = tags;
      _this.loading = false;
      m.redraw();
    });
  };
  _proto.view = function view() {
    if (this.loading) {
      return m((flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2___default()), null);
    }
    var pinned = this.tags.filter(function (tag) {
      return tag.position() !== null;
    }).sort(function (a, b) {
      return a.position() - b.position();
    });
    var cloud = this.tags.filter(function (tag) {
      return tag.position() === null;
    });
    console.log(pinned);
    return m("div", {
      className: "Asirem-TagsPage"
    }, flarum_components_IndexPage__WEBPACK_IMPORTED_MODULE_0___default().prototype.hero(), " ", m("div", {
      className: "sideNavContainer container"
    }, m("nav", {
      className: "TagsPage-nav IndexPage-nav sideNav"
    }, m("ul", null, flarum_helpers_listItems__WEBPACK_IMPORTED_MODULE_3___default()(flarum_components_IndexPage__WEBPACK_IMPORTED_MODULE_0___default().prototype.sidebarItems().toArray()))), m("div", {
      className: "TagsPage-content sideNavOffset"
    }, m("ul", {
      className: "Asirem-TagTiles"
    }, pinned.map(function (tag) {
      var _user$displayName, _user$displayName$;
      var lastPostedDiscussion = tag.lastPostedDiscussion();
      var children = flarum_tags_common_utils_sortTags__WEBPACK_IMPORTED_MODULE_7___default()(tag.children() || []);
      var tagIconNode = flarum_tags_common_helpers_tagIcon__WEBPACK_IMPORTED_MODULE_5___default()(tag, {}, {
        useColor: false
      });
      var lastPostNum = lastPostedDiscussion.lastPostNumber();
      var discussionId = lastPostedDiscussion.id();
      var tagSlug = tag.slug();
      var unread = tag.attribute('unreadCount');
      console.log(tag.slug() + ": " + unread);
      var user = tag.lastPostedDiscussion().lastPostedUser();
      if (tagIconNode.attrs.style && tagIconNode.attrs.style.backgroundColor) {
        delete tagIconNode.attrs.style.backgroundColor;
      }
      return m("li", {
        className: 'Asirem-TagTile ' + (tag.color() ? 'colored' : ''),
        style: {
          '--tag-bg': tag.color()
        }
      }, m("div", {
        className: "Asirem-TagTile-badge"
      }, unread > 0 && m("span", {
        className: "Asirem-TagTile-dot"
      }), unread > 0 && (unread >= 20 ? '20+' : unread)), m((flarum_components_Link__WEBPACK_IMPORTED_MODULE_1___default()), {
        className: "Asirem-TagTile-info",
        href: app.route.tag(tag)
      }, m("div", {
        className: "Asirem-TagTile-icon"
      }, tagIconNode), m("div", {
        className: "Asirem-TagTile-content"
      }, m("h3", {
        className: "Asirem-TagTile-name"
      }, tag.name()), m("p", {
        className: "Asirem-TagTile-description"
      }, tag.description()), children && children.length ? m("div", {
        className: "Asirem-TagTile-children"
      }, children.map(function (child) {
        return [m((flarum_components_Link__WEBPACK_IMPORTED_MODULE_1___default()), {
          href: app.route.tag(child),
          className: "TagLabel"
        }, child.name()), ' '];
      })) : '', lastPostedDiscussion ? m("div", {
        className: "Asirem-TagTile-lastPostedDiscussion"
      }, m("div", {
        className: "Asirem-TagTile-lastPosterIcon"
      }, user.avatarUrl != null && user.avatarUrl() ? m("span", {
        className: "Avatar Avatar--image",
        style: {
          backgroundImage: "url(" + (user.avatarUrl == null ? void 0 : user.avatarUrl()) + ")"
        }
      }) : m("span", {
        className: "Avatar Avatar--no-image",
        style: {
          backgroundColor: user.color == null ? void 0 : user.color()
        }
      }, user.displayName == null ? void 0 : (_user$displayName = user.displayName()) == null ? void 0 : (_user$displayName$ = _user$displayName[0]) == null ? void 0 : _user$displayName$.toUpperCase())), m((flarum_components_Link__WEBPACK_IMPORTED_MODULE_1___default()), {
        href: app.route.discussion(lastPostedDiscussion, lastPostedDiscussion.lastPostNumber()),
        className: "Asirem-TagTile-lastPostedDiscussion-link"
      }, m("span", {
        className: "Asirem-TagTile-lastPostedDiscussion-title"
      }, lastPostedDiscussion.title())), m("time", {
        datetime: lastPostedDiscussion.lastPostedAt()
      }, flarum_helpers_humanTime__WEBPACK_IMPORTED_MODULE_4___default()(lastPostedDiscussion.lastPostedAt()))) : m("span", {
        className: "Asirem-TagTile-lastPostedDiscussion"
      }))));
    })), cloud.length ? m("div", {
      className: "Asirem-TagCloud"
    }, cloud.map(function (tag) {
      return [flarum_tags_common_helpers_tagLabel__WEBPACK_IMPORTED_MODULE_6___default()(tag, {
        link: true
      }), ' '];
    })) : '')));
  };
  return TagsPage;
}();


/***/ }),

/***/ "./src/forum/index.js":
/*!****************************!*\
  !*** ./src/forum/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/DiscussionListItem */ "flarum/forum/components/DiscussionListItem");
/* harmony import */ var flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_tags_components_TagsPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/tags/components/TagsPage */ "flarum/tags/components/TagsPage");
/* harmony import */ var flarum_tags_components_TagsPage__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_tags_components_TagsPage__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_TagsPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/TagsPage */ "./src/forum/components/TagsPage.js");
/* harmony import */ var _components_SignupPage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/SignupPage */ "./src/forum/components/SignupPage.js");
/* harmony import */ var flarum_utils_string__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/utils/string */ "flarum/utils/string");
/* harmony import */ var flarum_utils_string__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_string__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_extensions_afrux_theme_base_forum_components_Footer__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/extensions/afrux-theme-base/forum/components/Footer */ "flarum/extensions/afrux-theme-base/forum/components/Footer");
/* harmony import */ var flarum_extensions_afrux_theme_base_forum_components_Footer__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_extensions_afrux_theme_base_forum_components_Footer__WEBPACK_IMPORTED_MODULE_7__);








app.initializers.add('deltamichael-asirem', function () {
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'view', function (vnode) {
    var discussionListItemContent = vnode.children.find(function (e) {
      return e && e.tag === 'div' && e.attrs && e.attrs.className.includes('DiscussionListItem-content');
    });
    discussionListItemContent.children[0] = m("div", {
      className: "DiscussionListItem-author-container"
    }, [discussionListItemContent.children[0], discussionListItemContent.children[1]]);
    delete discussionListItemContent.children[1];
    discussionListItemContent.children[3] = m("div", {
      className: "DiscussionListItem-stats"
    }, discussionListItemContent.children[3]);
    if (this.attrs.discussion.tags() && this.attrs.discussion.tags()[0] && this.attrs.discussion.tags()[0].color()) {
      vnode.attrs.style = (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
        '--tag-color': this.attrs.discussion.tags()[0].color()
      }, vnode.attrs.style || {});
    }
    if (this.attrs.discussion.isUnread()) {
      vnode.attrs.className += ' DiscussionListItem--unread';
    }
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.extend)((flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_2___default().prototype), 'infoItems', function (items) {
    if (!items.has('excerpt')) {
      var firstPost = this.attrs.discussion.firstPost();
      if (firstPost) {
        var excerpt = (0,flarum_utils_string__WEBPACK_IMPORTED_MODULE_6__.truncate)(firstPost.contentPlain(), 175);
        items.add('excerpt', m("div", null, excerpt), -100);
      }
    }
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.override)((flarum_extensions_afrux_theme_base_forum_components_Footer__WEBPACK_IMPORTED_MODULE_7___default().prototype), 'separator', function () {
    return m("svg", {
      xmlns: "http://www.w3.org/2000/svg",
      width: "1440",
      height: "288",
      className: "Asirem-footerWaves"
    }, m("path", {
      "fill-opacity": "1",
      d: "M0,224L18.5,186.7C36.9,149,74,75,111,58.7C147.7,43,185,85,222,112C258.5,139,295,149,332,154.7C369.2,160,406,160,443,149.3C480,139,517,117,554,101.3C590.8,85,628,75,665,96C701.5,117,738,171,775,165.3C812.3,160,849,96,886,101.3C923.1,107,960,181,997,218.7C1033.8,256,1071,256,1108,250.7C1144.6,245,1182,235,1218,202.7C1255.4,171,1292,117,1329,117.3C1366.2,117,1403,171,1422,197.3L1440,224L1440,320L1421.5,320C1403.1,320,1366,320,1329,320C1292.3,320,1255,320,1218,320C1181.5,320,1145,320,1108,320C1070.8,320,1034,320,997,320C960,320,923,320,886,320C849.2,320,812,320,775,320C738.5,320,702,320,665,320C627.7,320,591,320,554,320C516.9,320,480,320,443,320C406.2,320,369,320,332,320C295.4,320,258,320,222,320C184.6,320,148,320,111,320C73.8,320,37,320,18,320L0,320Z"
    }));
  });
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.override)((flarum_tags_components_TagsPage__WEBPACK_IMPORTED_MODULE_3___default().prototype), 'view', _components_TagsPage__WEBPACK_IMPORTED_MODULE_4__["default"].prototype.view);
  (0,flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__.override)((flarum_tags_components_TagsPage__WEBPACK_IMPORTED_MODULE_3___default().prototype), 'oninit', _components_TagsPage__WEBPACK_IMPORTED_MODULE_4__["default"].prototype.oninit);
  app.routes['signup'] = {
    path: '/signup',
    component: _components_SignupPage__WEBPACK_IMPORTED_MODULE_5__["default"]
  };
});

/***/ }),

/***/ "flarum/common/Component":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['common/Component']" ***!
  \*********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/Component'];

/***/ }),

/***/ "flarum/common/components/Button":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Button']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/components/Button'];

/***/ }),

/***/ "flarum/common/extend":
/*!******************************************************!*\
  !*** external "flarum.core.compat['common/extend']" ***!
  \******************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/extend'];

/***/ }),

/***/ "flarum/common/utils/Stream":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/utils/Stream']" ***!
  \************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['common/utils/Stream'];

/***/ }),

/***/ "flarum/components/IndexPage":
/*!*************************************************************!*\
  !*** external "flarum.core.compat['components/IndexPage']" ***!
  \*************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['components/IndexPage'];

/***/ }),

/***/ "flarum/components/Link":
/*!********************************************************!*\
  !*** external "flarum.core.compat['components/Link']" ***!
  \********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['components/Link'];

/***/ }),

/***/ "flarum/components/LoadingIndicator":
/*!********************************************************************!*\
  !*** external "flarum.core.compat['components/LoadingIndicator']" ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['components/LoadingIndicator'];

/***/ }),

/***/ "flarum/extensions/afrux-theme-base/forum/components/Footer":
/*!********************************************************************************************!*\
  !*** external "flarum.core.compat['extensions/afrux-theme-base/forum/components/Footer']" ***!
  \********************************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['extensions/afrux-theme-base/forum/components/Footer'];

/***/ }),

/***/ "flarum/forum/components/DiscussionListItem":
/*!****************************************************************************!*\
  !*** external "flarum.core.compat['forum/components/DiscussionListItem']" ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['forum/components/DiscussionListItem'];

/***/ }),

/***/ "flarum/helpers/humanTime":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['helpers/humanTime']" ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['helpers/humanTime'];

/***/ }),

/***/ "flarum/helpers/listItems":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['helpers/listItems']" ***!
  \**********************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['helpers/listItems'];

/***/ }),

/***/ "flarum/tags/common/helpers/tagIcon":
/*!********************************************************************!*\
  !*** external "flarum.core.compat['tags/common/helpers/tagIcon']" ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['tags/common/helpers/tagIcon'];

/***/ }),

/***/ "flarum/tags/common/helpers/tagLabel":
/*!*********************************************************************!*\
  !*** external "flarum.core.compat['tags/common/helpers/tagLabel']" ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['tags/common/helpers/tagLabel'];

/***/ }),

/***/ "flarum/tags/common/utils/sortTags":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['tags/common/utils/sortTags']" ***!
  \*******************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['tags/common/utils/sortTags'];

/***/ }),

/***/ "flarum/tags/components/TagsPage":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['tags/components/TagsPage']" ***!
  \*****************************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['tags/components/TagsPage'];

/***/ }),

/***/ "flarum/utils/string":
/*!*****************************************************!*\
  !*** external "flarum.core.compat['utils/string']" ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = flarum.core.compat['utils/string'];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!******************!*\
  !*** ./forum.js ***!
  \******************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.js");

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=forum.js.map