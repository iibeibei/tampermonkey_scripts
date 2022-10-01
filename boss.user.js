// ==UserScript==
// @name         BOSS 直聘 跨境黑名单
// @namespace    https://github.com/MaiXiaoMeng
// @version      0.1.5
// @description  可以在 BOSS 直聘、智联招聘、前程无忧 上 显示 若比邻的 黑名单，应 Facebook 群友要求，分享一下 祝大家早日找到好工作
// @author       XiaoMeng Mai
// @license      GPLv3

// @match        https://www.zhipin.com/job_detail*
// @match        https://www.zhipin.com/web/geek/job*
// @match        https://www.zhipin.com/web/geek/chat*
// @match        https://www.zhipin.com/web/geek/recommend*
// @match        https://*.zhaopin.com/*
// @match        https://*.51job.com/*
// @match        https://www.facebook.com/messages/t/*
// @match        https://www.facebook.com/profile.php*

// @connect      ratecompany.org
// @connect      amz123.com

// @grant        GM_xmlhttpRequest 
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification

// @compatible   firefox Tampermonkey
// @compatible   chrome Tampermonkey
// @compatible   edge Tampermonkey

// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631

// @note         0.1.5 修复 BOSS直聘 搜索页改版不显示的问题
// @note         0.1.4 修复 BOSS直聘 详情页改版不显示的问题
// ==/UserScript==

var task_quantity = 0
var task_quantity_max = 20
var error_quantity = 0
var error_quantity_max = 20
var query_quantity = 0
var query_quantity_max = 60
var error_message = true
var version = '0.1.5'
var version_url = 'https://greasyfork.org/zh-CN/scripts/448162'
var skip_list = ['AMZ黑名单', '去搜索一下', '安装 Messenger 应用', '若比邻黑名单']
var host = document.domain.split('.').slice(-2).join('.')

loadMenu()


switch (host) {
    // BOSS 直聘
    case 'zhipin.com':
        waitForKeyElements('.info-company > div > h3 > a', actionFunction)
        waitForKeyElements('.company-info > h3 > a', actionFunction)
        waitForKeyElements('.article > p > span:nth-child(2)', actionFunction)
        waitForKeyElements('.job-sec > .name', actionFunction)
        waitForKeyElements('.title > .gray', actionFunction)
        waitForKeyElements('.level-list > .company-name', actionFunction)
        break
    // 智联招聘
    case 'zhaopin.com':
        waitForKeyElements('.iteminfo__line1__compname__name', actionFunction)
        waitForKeyElements('.ji-item-info-companyName', actionFunction)
        waitForKeyElements('.company__title', actionFunction)
        waitForKeyElements('.rc-item-companyname', actionFunction)
    // 全程无忧
    case '51job.com':
        waitForKeyElements('.el > .t2 > a', actionFunction)
        waitForKeyElements('.cname.at', actionFunction)
        waitForKeyElements('.com_name', actionFunction)
        break
    case 'facebook.com':
        waitForKeyElements('div.rq0escxv.l9j0dhe7.du4w35lb.j83agx80 > div > a', actionFunction)
        break
    default:
        break
}

function sleep(interval) {
    return new Promise(resolve => { setTimeout(resolve, interval) })
}

function loadMenu() {
    var menu_ALL = [
        ['menu_GAEEScript_tc_ratecompany', 'Ratecompany', '若比邻网黑名单', true],
        ['menu_GAEEScript_tc_amz123', 'AMZ123', 'AMZ123黑名单', true],
    ], menu_ID = []

    // 如果读取到的值为 null 就写入默认值
    for (let i = 0; i < menu_ALL.length; i++) {
        if (GM_getValue(menu_ALL[i][0]) == null) { GM_setValue(menu_ALL[i][0], menu_ALL[i][3]) }
    }

    registerMenuCommand()

    // 注册脚本菜单
    function registerMenuCommand() {

        // 如果菜单ID数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
        if (menu_ID.length > menu_ALL.length) {
            for (let i = 0; i < menu_ID.length; i++) {
                GM_unregisterMenuCommand(menu_ID[i])
            }
        }

        // 循环注册脚本菜单
        for (let i = 0; i < menu_ALL.length; i++) {
            menu_ALL[i][3] = GM_getValue(menu_ALL[i][0])
            menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][3] ? '✅' : '❌'} ${menu_ALL[i][2]}`, function () {
                menu_switch(`${menu_ALL[i][0]}`, `${menu_ALL[i][1]}`, `${menu_ALL[i][2]}`, `${menu_ALL[i][3]}`)
            })
        }

        // 加入版本信息
        menu_ID[menu_ID.length] = GM_registerMenuCommand(`🏁 当前版本 ${version}`, function () {
            window.GM_openInTab(version_url, { active: true, insert: true, setParent: true })
        })
    }

    //切换选项
    function menu_switch(name, ename, cname, value) {
        if (value == 'false') {
            console.log(name)
            // 重新注册脚本菜单，刷新网页
            GM_setValue(`${name}`, true)
            registerMenuCommand()
            location.reload()
            GM_notification({ text: `「${cname}」已开启\n`, timeout: 3500 })
        } else {
            console.log(name)
            // 重新注册脚本菜单，刷新网页
            GM_setValue(`${name}`, false)
            registerMenuCommand()
            location.reload()
            GM_notification({ text: `「${cname}」已关闭\n`, timeout: 3500 })
        }
        // 重新注册脚本菜单
        registerMenuCommand()
    }
}

function actionFunction(jNode) {
    if (host == 'facebook.com') {
        if (GM_getValue('menu_GAEEScript_tc_amz123')) {
            searchAMZ123(jNode)
        }
    } else {
        if (GM_getValue('menu_GAEEScript_tc_ratecompany')) {
            searchRatecompany(jNode)
        }
    }
}

async function searchRatecompany(jNode) {
    var company_name = jNode.text().split('  ')[0].replace('...', '').replace('公司名称', '').trim()
    if (skip_list.indexOf(company_name) == -1 && company_name.length > 1 && query_quantity < query_quantity_max) {
        query_quantity = query_quantity + 1
        while (task_quantity > task_quantity_max) { await sleep(1000) }

        var blacklist_search = `https://www.ratecompany.org/?s=${company_name}&post_type=question`
        task_quantity = task_quantity + 1
        console.log(`${company_name} 开始 ${blacklist_search}`)

        GM_xmlhttpRequest({
            method: 'GET',
            url: blacklist_search,
            onload: function (response) {
                if (response.status == 200) {
                    console.log(`${company_name} 200 完成 ${blacklist_search}`)
                    query_quantity = query_quantity - 1
                    task_quantity = task_quantity - 1
                    // console.log(response)
                    var insert_html = ''
                    var response_text = $(response.responseText)
                    var hyperlink = response_text.find('.ap-questions-hyperlink').attr('href')
                    if (hyperlink == undefined) {
                        insert_html = `<a class="xiaomeng" style="color:#00F" href='${blacklist_search}'>&nbsp 去搜索一下 &nbsp</a>`
                    } else {
                        insert_html = `<a class="xiaomeng" style="color:#F00" href='${hyperlink}'>&nbsp 若比邻黑名单 &nbsp</a>`
                    }
                    // BOSS直聘
                    if (window.location.href.indexOf('zhipin.com') > 0) {
                        $(".article_child").remove()
                        $('.job-tags').prepend($(`<span>${insert_html}</span>`))
                        $('.job-keyword-list').prepend($(`<li>${insert_html}</li>`))
                        $('.job-boss-info > .name').append($(`${insert_html}`))
                        jNode.parent().parent().find('.name').append($(insert_html))
                        jNode.parent().parent().find('.company-name  > a').append($(insert_html))
                        jNode.parent().find('span:nth-child(2)').after($(insert_html).addClass("article_child"))
                    }

                    // 智联招聘
                    if (window.location.href.indexOf('zhaopin.com') > 0) {
                        $('.summary-plane__title').append($(insert_html))
                        jNode.parent().find('.ji-item-info-jobName').append($(insert_html).css({ 'margin': '4px 0 3px', 'font-size': "18px" }))
                        jNode.parent().find('.iteminfo__line1__compname__name').after($(insert_html))
                        jNode.parent().find('.company__title').append($(insert_html))
                        jNode.parent().find('.rc-item-jobname').append($(insert_html))
                    }

                    if (window.location.href.indexOf('51job.com') > 0) {
                        $('.cn > h1').append($(insert_html))
                        jNode.parent().parent().find('.t2 > a').before($(insert_html))
                        jNode.parent().find('.cname.at').prepend($(insert_html))
                        jNode.parent().find('.com_name').after($(insert_html))
                    }

                } else {
                    console.log(`${company_name} 503 重试 ${blacklist_search}`)
                    // console.log(response)
                    actionFunction(jNode)
                }
            },
            onerror: function (response) {
                console.log(`${company_name} Error 失败 ${blacklist_search}`)
                error_quantity = error_quantity + 1
                // console.log(response)

                if (error_quantity > error_quantity_max) {
                    if (error_message) {
                        error_message = false
                        GM_notification({ text: `「检测到黑名单搜索线程已经卡死，如果页面没有显示黑名单标记，请重新打开浏览器在试」\n`, timeout: 30000 }) // 提示消息
                    }
                }
            }
        })
    }
}
async function searchAMZ123(jNode) {
    var facebook_id = jNode.attr('href').replace(/\//g, '').trim()
    var facebook_name = jNode.text().trim()
    if (skip_list.indexOf(facebook_name) == -1 && facebook_id.length > 1 && query_quantity < query_quantity_max) {
        query_quantity = query_quantity + 1
        while (task_quantity > task_quantity_max) { await sleep(1000) }

        task_quantity = task_quantity + 1
        var blacklist_search = `https://www.amz123.com/search.htm?keyword=${facebook_id}`
        console.log(`${facebook_name} id: ${facebook_id} 开始 ${blacklist_search}`)

        GM_xmlhttpRequest({
            method: 'GET',
            url: blacklist_search,
            onload: function (response) {
                if (response.status == 200) {
                    console.log(`${facebook_name} id: ${facebook_id} 200 完成 ${blacklist_search}`)
                    query_quantity = query_quantity - 1
                    task_quantity = task_quantity - 1
                    // console.log(response)
                    var insert_html = ''
                    var response_text = $(response.responseText)

                    var hyperlink = response_text.find('.subject.break-all > a').attr('href')
                    if (hyperlink == undefined) {
                        insert_html = `<a class="xiaomeng" style="color:#00F" href='https://www.amz123.com/${blacklist_search}'>&nbsp 去搜索一下 &nbsp</a>`
                    } else {
                        insert_html = `<a class="xiaomeng" style="color:#F00" href='https://www.amz123.com/${hyperlink}'>&nbsp AMZ黑名单 &nbsp</a>`
                    }

                    jNode.parent().find('div.rq0escxv> div > div > h1').after($(insert_html))

                } else {
                    console.log(`${facebook_name} id: ${facebook_id} 503 重试 ${blacklist_search}`)
                    // console.log(response)
                }
            },
            onerror: function (response) {
                console.log(`${facebook_name} id: ${facebook_id} Error  ${blacklist_search}`)
                error_quantity = error_quantity + 1
                // console.log(response)

                if (error_quantity > error_quantity_max) {
                    if (error_message) {
                        error_message = false
                        GM_notification({ text: `「检测到黑名单搜索线程已经卡死，如果页面没有显示黑名单标记，请重新打开浏览器在试」\n`, timeout: 30000 }) // 提示消息
                    }
                }
            }
        })
    }
}
// append() - 在被选元素的结尾插入内容（内容的结尾，比如说有个a标签，则是在</a>这个标签之前添加东西） <a>    [append]</a>
// prepend() - 在被选元素的开头插入内容（内容的开始，比如说有个a标签，则是在<a>这个标签之后添加东西） <a>[prepend]   </a>
// after() - 在被选元素之后插入内容（元素的结尾，比如说有个a标签，则是在</a>这个标签之后添加东西）    <a>    </a>[after]
// before() - 在被选元素之前插入内容（内容的开始，比如说有个a标签，则是在<a>这个标签之前添加东西）    [before]<a>    </a>

