// ==UserScript==
// @name         亚马逊卖家后台小工具
// @namespace    https://github.com/MaiXiaoMeng
// @version      0.0.1
// @description
// @author       XiaoMeng Mai
// @license      GPLv3

// @match        https://*.amazon.com/*
// @match        https://*.amazon.co.uk/*
// @match        https://*.amazon.co.de/*
// @match        https://*.amazon.fr/*
// @match        https://*.amazon.it/*
// @match        https://*.amazon.es/*
// @match        https://*.amazon.co.jp/*
// @match        https://*.amazon.com.au/*
// @match        https://*.amazon.sg/*

// @connect      gigab2b.com

// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_download
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow

// @compatible   firefox Tampermonkey
// @compatible   chrome Tampermonkey
// @compatible   edge Tampermonkey

// @require      https://unpkg.com/jquery
// @require      https://unpkg.com/sweetalert2
// @require      file://D:\跨境电商\产品报价\欧瑞思丹网络技术（苏州）有限公司\产品详细列表\amazon.user.js

// @resource     element-plus    https://unpkg.com/element-plus/dist/index.css

// @note         0.0.2 支持在 亚马逊订单管理页面上 显示 大健云仓 的物流追踪编号
// @note         0.0.1 支持业务报告批量下载

// ==/UserScript==

// append() - 在被选元素的结尾插入内容（内容的结尾，比如说有个a标签，则是在</a>这个标签之前添加东西） <a>    [append]</a>
// prepend() - 在被选元素的开头插入内容（内容的开始，比如说有个a标签，则是在<a>这个标签之后添加东西） <a>[prepend]   </a>
// after() - 在被选元素之后插入内容（元素的结尾，比如说有个a标签，则是在</a>这个标签之后添加东西）    <a>    </a>[after]
// before() - 在被选元素之前插入内容（内容的开始，比如说有个a标签，则是在<a>这个标签之前添加东西）    [before]<a>    </a>

// https://sweetalert2.github.io/
// https://element-plus.gitee.io/

// 初始化脚本
initializationScript()
// Listing页面
waitForKeyElements("#productTitle", getGigab2bProductInfo, ['/dp/', '/gp/'])
waitForKeyElements("#ASIN", actionFunction, ['/dp/', '/gp/'])
// 业务报告页面
waitForKeyElements(".css-1lafdix", getBusinessReport, ['business-reports/'])
// 订单管理页面
waitForKeyElements(".cell-body > .cell-body-title", getGigab2bTrackingNumber, ['orders-v3/']);
waitForKeyElements(".a-spacing-mini > div > span.a-text-bold", getGigab2bTrackingNumber, ['orders-v3/'])
waitForKeyElements(".myo-list-orders-product-name-cell> div:nth-child(3) > div", getGigab2bProductInfo, ['orders-v3/'])
// 管理库存页面
waitForKeyElements(".myi-sprite-container.myi-image > a", getProductType, ['inventory/'])

function actionFunction(jNode, selectorTxt, activeURL) {
    var asin = jNode.attr('value')
    var flow_score_url = 'https://api.xiyouzhaoci.com/v1/flowScore/country/US/asin/'
    var word_counts_url = 'https://api.xiyouzhaoci.com/v1/wordCounts'
    var search_by_asin = 'https://api.xiyouzhaoci.com/v1/searchByAsin'

    GM_xmlhttpRequest({
        url: flow_score_url + asin,
        method: 'GET',
        onload: function (response) {
            console.log(response.responseText);
        }
    })
    GM_xmlhttpRequest({
        url: word_counts_url,
        method: 'POST',
        data: JSON.stringify({
            'asin': `${asin}`,
            'country': 'US',
            'filters': [],
            'query': '',
            'rangeFilters': []
        }),
        onload: function (response) {
            console.log(response.responseText);
        }
    })
    GM_xmlhttpRequest({
        url: search_by_asin,
        method: 'POST',
        data: JSON.stringify({
            'asin': `${asin}`, 'country': 'US',
            'page': 1,
            'pageSize': 100,
            'orders': [
                {
                    'field': 'follow',
                    'order': 'desc'
                }
            ],
            'filters': [],
            'query': '',
            'rangeFilters': []
        }),
        onload: function (response) {
            console.log(response.responseText);
        }
    })



    // if (host == 'facebook.com') {
    //     if (GM_getValue('menu_GAEEScript_tc_amz123')) {
    //         searchAMZ123(jNode)
    //     }
    // } else {
    //     if (GM_getValue('menu_GAEEScript_tc_ratecompany')) {
    //         searchRatecompany(jNode)
    //     }
    // }
}
function waitForKeyElements(selectorTxt, actionFunction, activeURL, bWaitOnce, iframeSelector) {
    var active_url = false
    if (typeof activeURL == "object") {
        for (let index = 0; index < activeURL.length; index++) {
            if (window.location.href.indexOf(activeURL[index]) > -1) {
                active_url = true
                break
            }
        }
    } else if (typeof activeURL == "string") {
        if (window.location.href.indexOf(activeURL) > -1) active_url = true
    }

    if (active_url) {
        var targetNodes, btargetsFound;
        if (typeof iframeSelector == "undefined") {
            targetNodes = $(selectorTxt);
        } else {
            targetNodes = $(iframeSelector).contents().find(selectorTxt);
        }

        if (targetNodes && targetNodes.length > 0) {
            btargetsFound = true;
            targetNodes.each(function () {
                var jThis = $(this);
                var alreadyFound = jThis.data("alreadyFound") || false;

                if (!alreadyFound) {
                    logPrint(`selectorTxt > ${selectorTxt} activeURL > ${activeURL} bWaitOnce > ${bWaitOnce} iframeSelector > ${iframeSelector}`)
                    console.log(jThis);

                    var cancelFound = false
                    if (typeof actionFunction == "object") {
                        actionFunction.forEach(element => {
                            cancelFound = element(jThis, selectorTxt, activeURL);
                        })
                    } else if (typeof actionFunction == "function") {
                        cancelFound = actionFunction(jThis, selectorTxt, activeURL);
                    }

                    if (cancelFound) {
                        btargetsFound = false
                    } else {
                        jThis.data("alreadyFound", true);
                    }
                }
            })
        } else {
            btargetsFound = false;
        }

        var controlObj = waitForKeyElements.controlObj || {};
        var controlKey = selectorTxt.replace(/[^\w]/g, "_");
        var timeControl = controlObj[controlKey];

        if (btargetsFound && bWaitOnce && timeControl) {
            clearInterval(timeControl);
            delete controlObj[controlKey];
        } else {
            if (!timeControl) {
                timeControl = setInterval(function () {
                    waitForKeyElements(selectorTxt, actionFunction, activeURL, bWaitOnce, iframeSelector);
                }, 300);
                controlObj[controlKey] = timeControl;
            }
        }
        waitForKeyElements.controlObj = controlObj;
    }
}

function makeGetRequest(url, method = 'GET', data = null) {
    logPrint(`${method} -> ${url}`)
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            url: url,
            method: method,
            data: data,
            onload: function (response) {
                resolve(response);
            },
            onerror: function (error) {
                reject(error);
            }
        });
    });
}
function logPrint(params) {
    var date_time = $.trim(new Date(new Date().setHours(new Date().getHours() + 8)).toISOString().replace("Z", " ").replace("T", " "))
    var function_name = (new Error()).stack.split("\n")[2].trim().split(" ")[1]
    console.log(`[${date_time}][DEBUG] ${function_name} - ${params}`)
}
function sleep(interval) {
    return new Promise(resolve => { setTimeout(resolve, interval) })
}
function getFormatDate(date) {
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
function getBusinessReport(jNode, selectorTxt, activeURL) {

    if (jNode.attr("class").indexOf("beibei") == -1) {
        jNode.after($(`<div class="css-1lafdix beibei"><kat-button id='batch_download_of_the_daily_business_report' label="批量下载每天业务的报告" variant="primary" size="base" type="button"></kat-button></div>`))

        $("#batch_download_of_the_daily_business_report").click(function (event) {
            var start_date = new Date($(".css-jfggi0")[0].value);
            var end_date = new Date($(".css-jfggi0")[1].value);
            var site_brand = $(".partner-dropdown-button > span").text().split(" | ");
            (async () => {
                while (start_date <= end_date) {
                    var api_url = `https://${document.domain}/business-reports/api`;
                    var data = JSON.stringify({
                        operationName: "reportDataDownloadQuery",
                        variables: {
                            input: {
                                legacyReportId: "102:DetailSalesTrafficByParentItem",
                                startDate: `${getFormatDate(start_date)}`,
                                endDate: `${getFormatDate(start_date)}`,
                                userSelectedRows: [],
                                selectedColumns: [
                                    "SC_MA_ParentASIN_25990", 
                                    "SC_MA_ChildASIN_25991", 
                                    "MYG_Growth_Opportunities", 
                                    "sc_mat-ss_colDef_title", 
                                    "SC_MA_MobileAppSessions", 
                                    "SC_MA_BrowserSessions", 
                                    "SC_MA_Sessions_Total", 
                                    "SC_MA_MobileAppSessionPercentage", 
                                    "SC_MA_BrowserSessionPercentage", 
                                    "SC_MA_SessionPercentage_Total", 
                                    "SC_MA_MobileAppPageViews", 
                                    "SC_MA_BrowserPageViews", 
                                    "SC_MA_PageViews_Total", 
                                    "SC_MA_MobileAppPageViewsPercentage", 
                                    "SC_MA_BrowserPageViewsPercentage", 
                                    "SC_MA_PageViewsPercentage_Total", 
                                    "SC_MA_BuyBoxPercentage_25956", 
                                    "SC_MA_UnitsOrdered_40590", 
                                    "SC_MA_UnitSessionPercentage_25957", 
                                    "SC_MA_OrderedProductSales_40591", 
                                    "SC_MA_TotalOrderItems_1"
                                ],
                            },
                        },
                        query: "query reportDataDownloadQuery($input: GetReportDataInput) {\n  getReportDataDownload(input: $input) {\n    url\n    __typename\n  }\n}\n",
                    })
                    var response = await makeGetRequest(url = api_url, method = 'POST', data = data)
                    var download_url = JSON.parse(response.responseText)["data"]["getReportDataDownload"]["url"]
                    var download_file_name = `${site_brand[1]}_${site_brand[0]}_${getFormatDate(start_date)}.csv`
                    ElementPlus.ElMessage(`正在下载： ${download_file_name}`)
                    console.log(`正在下载： ${download_file_name} URL: ${download_url}`)
                    GM_download(download_url, download_file_name)
                    start_date = new Date((start_date / 1000 + 86400 * 1) * 1000)
                }
            })()

        })
    }
}
function getGigab2bTrackingNumber(jNode, selectorTxt, activeURL) {
    var ERROR_ON_ORDER_NUMBER = "Upload Time refers to the time when the sales order is uploaded to the Marketplace.";
    var order_numbers = jNode.text();
    var query_order_url = "https://www.gigab2b.com/index.php?route=account/sales_order/sales_order_management/salesOrderList&filter_orderId=";

    GM_xmlhttpRequest({
        method: "GET",
        url: query_order_url + order_numbers,
        onload: function (response) {
            if (response.finalUrl.indexOf("account/login") > 0) {
                jNode.append($(`<a target='_blank' href='${query_order_url + order_numbers}'>&nbsp检测到未登录&nbsp</a>`))
            } else if (response.responseText.indexOf(ERROR_ON_ORDER_NUMBER) == -1) {
                jNode.append($(`<a target='_blank' href='${query_order_url + order_numbers}'>&nbsp订单号不存在&nbsp</a>`))
            } else {
                var response_text = $(response.responseText);

                if (window.location.href.indexOf("sellercentral.amazon.com") > 0) {
                    var tracking_numbers = response_text.find(".tracking-number > a");
                    var tracking_href = $.trim(
                        response_text.find(".tracking-number > a").attr("href")
                    );
                } else if (window.location.href.indexOf("sellercentral-japan.amazon.com") > 0) {
                    var tracking_numbers = response_text.find(".tracking-number > span");
                }

                if (tracking_numbers.length > 0) {
                    var tracking = $.trim(response_text.find(".tracking-number").prop("firstChild").nodeValue)
                    jNode.append($(`<a target='_blank' href='${tracking_href}'>&nbsp${tracking}&nbsp</a>`))
                    for (let index = 0; index < tracking_numbers.length; index++) {
                        jNode.append($(`<span>&nbsp${tracking_numbers[index].textContent}&nbsp</span>`))
                    }
                } else {
                    jNode.append($(`<a target='_blank' href='${query_order_url + order_numbers}'>&nbsp没有查询到物流追踪编号&nbsp</a>`))
                }
            }
        },
    });
}
function getGigab2bProductInfo(jNode, selectorTxt, activeURL) {
    var query_product_info_url = 'https://www.gigab2b.com/index.php?route=product/search&search='

    if (selectorTxt == '#productTitle') {
        (async () => {
            var sku = $.trim(jNode.text().match(/\(.*?, (.*?)\)/)[1])
            var response = await makeGetRequest(query_product_info_url + sku)
            var response_text = $(response.responseText);
            var product_url = response_text.find(".product-image > a").attr("href")

            if (typeof product_url == "undefined") product_url = query_product_info_url + sku
            logPrint(`product_url -> ${product_url}`)
            let result = $.trim(jNode.text()).replace(/(\(.*, .*\))/, `<a target='_blank' href='${product_url}'>$1</a>`)
            logPrint(`result -> ${result}`)
            jNode.empty()
            jNode.append(result)
        })()
    } else if (selectorTxt == '.myo-list-orders-product-name-cell> div:nth-child(3) > div') {
        (async () => {
            var sku = $.trim(jNode.text().replace('SKU:  ', ''))
            var response = await makeGetRequest(query_product_info_url + sku)
            var response_text = $(response.responseText);
            var product_url = response_text.find(".product-image > a").attr("href")
            if (typeof product_url == "undefined") product_url = query_product_info_url + sku
            logPrint(`product_url -> ${product_url}`)
            jNode.empty()
            jNode.append($(`<div><span>SKU</span>:  <a target='_blank' href='${product_url}'>${sku}</a></div>`))
        })()
    }
}
function getProductType(jNode, selectorTxt, activeURL) {
    var grab_node = jNode.attr("href").split("&")[2].replace("productType=", "");
    jNode.parent().after($(`<div><div><span style="color:#00F;font-size: initial;">${grab_node}</span></div>`))
}
function initializationScript() {
    var $ = window.$;
    var VueCDN = "https://lib.baomitu.com/vue/3.2.36/vue.global.prod.min.js";
    var ElementPlusCDN = "https://lib.baomitu.com/element-plus/2.2.2/index.full.min.js"; // 过滤广告
    GM_addStyle(GM_getResourceText("element-plus"))
    $.getScript(VueCDN, function () {
        console.log("[" + VueCDN + "] Vue 加载成功");
        $.getScript(ElementPlusCDN, function () {
            console.log("[" + ElementPlusCDN + "] ElementPlus 加载成功")
            var ElementPlus = unsafeWindow.ElementPlus;
            var Vue = unsafeWindow.Vue;
        })
    })
}


// function loadMenu() {
//     var menu_ALL = [
//         ['menu_GAEEScript_tc_ratecompany', 'Ratecompany', '若比邻网黑名单', true],
//         ['menu_GAEEScript_tc_amz123', 'AMZ123', 'AMZ123黑名单', true],
//     ], menu_ID = []

//     // 如果读取到的值为 null 就写入默认值
//     for (let i = 0; i < menu_ALL.length; i++) {
//         if (GM_getValue(menu_ALL[i][0]) == null) { GM_setValue(menu_ALL[i][0], menu_ALL[i][3]) }
//     }

//     registerMenuCommand()

//     // 注册脚本菜单
//     function registerMenuCommand() {

//         // 如果菜单ID数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
//         if (menu_ID.length > menu_ALL.length) {
//             for (let i = 0; i < menu_ID.length; i++) {
//                 GM_unregisterMenuCommand(menu_ID[i])
//             }
//         }

//         // 循环注册脚本菜单
//         for (let i = 0; i < menu_ALL.length; i++) {
//             menu_ALL[i][3] = GM_getValue(menu_ALL[i][0])
//             menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][3] ? '✅' : '❌'} ${menu_ALL[i][2]}`, function () {
//                 menu_switch(`${menu_ALL[i][0]}`, `${menu_ALL[i][1]}`, `${menu_ALL[i][2]}`, `${menu_ALL[i][3]}`)
//             })
//         }

//         // 加入版本信息
//         menu_ID[menu_ID.length] = GM_registerMenuCommand(`🏁 当前版本 ${version}`, function () {
//             window.GM_openInTab(version_url, { active: true, insert: true, setParent: true })
//         })
//     }

//     //切换选项
//     function menu_switch(name, ename, cname, value) {
//         if (value == 'false') {
//             console.log(name)
//             // 重新注册脚本菜单，刷新网页
//             GM_setValue(`${name}`, true)
//             registerMenuCommand()
//             location.reload()
//             GM_notification({ text: `「${cname}」已开启\n`, timeout: 3500 })
//         } else {
//             console.log(name)
//             // 重新注册脚本菜单，刷新网页
//             GM_setValue(`${name}`, false)
//             registerMenuCommand()
//             location.reload()
//             GM_notification({ text: `「${cname}」已关闭\n`, timeout: 3500 })
//         }
//         // 重新注册脚本菜单
//         registerMenuCommand()
//     }
// }
