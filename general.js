
/**
 * @description: 一个实用程序函数，用于 Greasemonkey 脚本, 检测和处理 AJAXed 内容
 * @param {*} selector_txt 元素选择器
 * @param {*} active_host 激活的域名
 * @param {*} active_url 激活的页面URL
 * @param {*} b_wait_once 是否只扫描一次
 * @param {*} iframe_selector 是否扫描Frame框架
 * @param {*} action_function 找到元素时运行的方法，传送 node, selector_txt, active_host, active_url 四个变量
 */
function waitForKeyElements(selector_txt, active_host, active_url, b_wait_once, iframe_selector, action_function) {
    if (document.domain.split('.').slice(-2).join('.') != active_host) return

    var active_url_type = false
    if (typeof active_url == "object") {
        for (let index = 0; index < active_url.length; index++) {
            if (window.location.href.indexOf(active_url[index]) > -1) {
                active_url_type = true
                break
            }
        }
    } else if (typeof active_url == "string") {
        if (window.location.href.indexOf(active_url) > -1) active_url_type = true
    }


    if (active_url_type) {
        var target_nodes, b_targets_found
        if (iframe_selector) {
            target_nodes = $(iframe_selector).contents().find(selector_txt)
        } else {
            target_nodes = $(selector_txt)
        }

        if (target_nodes && target_nodes.length > 0) {
            b_targets_found = true
            target_nodes.each(function () {
                var j_this = $(this)
                var already_found = j_this.data("alreadyFound") || false

                if (!already_found) {
                    logPrint(`selector_txt > ${selector_txt} active_host > ${active_host} active_url > ${active_url} b_wait_once > ${b_wait_once} iframe_selector > ${iframe_selector}`)
                    console.log(j_this);

                    var cancel_found = false
                    if (typeof action_function == "object") {
                        action_function.forEach(element => {
                            cancel_found = element(j_this, selector_txt, active_host, active_url);
                        })
                    } else if (typeof action_function == "function") {
                        cancel_found = action_function(j_this, selector_txt, active_url);
                    }

                    if (cancel_found) {
                        b_targets_found = false
                    } else {
                        j_this.data("alreadyFound", true);
                    }
                }
            })
        } else {
            b_targets_found = false;
        }

        var control_obj = waitForKeyElements.control_obj || {};
        var control_key = selector_txt.replace(/[^\w]/g, "_");
        var time_control = control_obj[control_key];

        if (b_targets_found && b_wait_once && time_control) {
            clearInterval(time_control);
            delete control_obj[control_key];
        } else {
            if (!time_control) {
                time_control = setInterval(function () {
                    waitForKeyElements(selector_txt, active_host, active_url, b_wait_once, iframe_selector, action_function);
                }, 300);
                control_obj[control_key] = time_control;
            }
        }
        waitForKeyElements.control_obj = control_obj;
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