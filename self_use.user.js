// ==UserScript==
// @name         Ecomtool 插件免登录
// @namespace    https://github.com/MaiXiaoMeng
// @description  Ecomtool 插件免登录，自动填写 token 值 (交钱是不可能交钱的，这辈子都不可能交钱的)
// @author       XiaoMeng Mai
// @license      GPLv3
// @version      0.0.1

// @match        http://*/favicon.ico?*
// @match        https://*/favicon.ico?*
// @match        https://www.moonstatistics.com/*
// @match        https://www.pushplus.plus/uc.html

// @require      https://unpkg.com/jquery
// @require      https://greasyfork.org/scripts/448161-beibei-js/code/Beibeijs.js?version=1159976
// @require      file://E:\Android\AppCache\Github\tampermonkey_scripts\self_use.user.js
// @grant        unsafeWindow
// ==/UserScript==

// Ecomtool 插件免登录
waitForKeyElements('#token', '*', [''], false, false, '', actionFunction);
function actionFunction(node, selector_txt, active_host, active_url, js_code) {
	node.attr('value', '00000000002');
}

// pushplus 显示 pushToken
waitForKeyElements('.list-group', '*', [''], false, false, '', actionFunction2);
function actionFunction2(node, selector_txt, active_host, active_url, js_code) {
	var cookie = get_cookie('pushToken');
	var li_class = 'list-group-item d-flex justify-content-between align-items-center push-token';
	html = `<li class="${li_class}"><div>pushToken</div><div class="d-flex"><div class="text-muted pr-2">${cookie}</div></div></li>`;
	node.append(html);
}

// 月亮树跨境 选品去限制
waitForKeyElements('.el-input.is-disabled.el-input--suffix', '*', [''], false, false, '', disactivate);
waitForKeyElements('.el-radio__input.is-disabled', '*', [''], false, false, '', disactivate);
waitForKeyElements('.el-radio.is-disabled', '*', [''], false, false, '', disactivate);
waitForKeyElements('.el-checkbox__input.is-disabled', '*', [''], false, false, '', disactivate);
waitForKeyElements('.el-checkbox.is-disabled', '*', [''], false, false, '', disactivate);
waitForKeyElements('.el-select-dropdown__item.is-disabled', '*', [''], false, false, '', disactivate);
function disactivate(node, selector_txt, active_host, active_url, js_code) {
	node.removeClass('is-disabled');
	if (node.hasClass('el-input')) {
		node.find('.el-input__wrapper > input').attr('disabled', false);
	} else if (node.hasClass('el-radio__input')) {
		node.find('.el-radio__original').attr('disabled', false);
	} else if (node.hasClass('el-checkbox__input')) {
		node.find('.el-checkbox__original').attr('disabled', false);
	}
}
