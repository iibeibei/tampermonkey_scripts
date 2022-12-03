## **写在前面**

垃圾亚马逊，连批量下载业务报告的方法都没有，只好自己写一个了

这个脚本是我自己写的, 不提供任何的技术支持, 如果你更好的建议可以私信我, 但我不一定会听....

本脚本以纯学术交流使用,无针对任何公司,组织,或者个人,如果哪位高人利用此脚本侵犯公司,组织,或者个人的利益,请不要来找我！一切和本人没有半毛钱关系！

创建这个章节的目的在于为我节省时间，而不是反复地解释一些琐碎的安装使用问题，如果您已经认真检索过本章节的内容，确认没有符合的 FAQ 能帮到您，

请通过 [Facebook](https://www.facebook.com/MaiXiaoMeng) 联系我，这是能和我直接对话的最有效方法

## 更新记录

* 0.0.7 [Amazon] 新增 业务报告 支持按每天或者每月下载
* 0.0.6 [Amazon] 新增 业务报告 自动获取业务报告的全部字段
* 0.0.5 [Amazon] 新增 库存管理 显示库存管理产品的分类
* 0.0.4 [Amazon] 修复 业务报告 父商品详情页面销售和流量 和 详情页面销售和流量 错误显示批量下载按钮
* 0.0.3 [Amazon] 新增 业务报告 亚马逊企业购(B2B)相关数据列
* 0.0.2 [Amazon] 修复 业务报告 下载报告没有子ASIN列的问题
* 0.0.1 [Amazon] 新增 业务报告 详情页面销售和流量（按子商品）批量下载

## 安装教程

### 1. 安装脚本管理器 **`必须`**

比较知名的脚本管理器有：Tampermonkey，Violentmonkey，Greasemonkey，脚本猫。

这里以功能最强的 Tampermonkey 为例：

> Tampermonkey，俗称“油猴”，是一款免费的浏览器扩展和最为流行的用户脚本管理器。
>
> 所谓脚本就是一段代码，它们能够优化您的网页浏览体验。安装之后，有些脚本能为网站添加新的功能，有些能使网站的界面更加易用，有些则能隐藏网站上烦人的广告。

**根据您的浏览器前往对应扩展商店安装  Tampermonkey 扩展：**

| 浏览器       | Tampermonkey 下载地址                                                                                                                                                                                                         | 安装方法                                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| Chrome浏览器 | [Crx搜搜扩展商店](https://www.crxsoso.com/webstore/detail/dhdgffkkebhmkfjojejmpbldmpobfkfo)（推荐）或  ~~[Chrome 网上应用店](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)~~（被墙）  | [点击查看](https://www.baiduyun.wiki/zh-cn/crx.html?spm=1664612349106#chrome%E6%B5%8F%E8%A7%88%E5%99%A8)             |
| Edge浏览器   | [Crx搜搜扩展商店](https://www.crxsoso.com/addon/detail/iikmkjmpaadaobahmlepeloendndfphd)（推荐）或  ~~[Edge 外接程序](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)~~（很慢） | [点击查看](https://www.baiduyun.wiki/zh-cn/crx.html?spm=1664612349106#edge%E6%B5%8F%E8%A7%88%E5%99%A8)               |
| 火狐浏览器   | [Crx搜搜扩展商店](https://www.crxsoso.com/firefox/detail/tampermonkey)（推荐）                                                                                                                                                   | [点击查看](https://www.baiduyun.wiki/zh-cn/crx.html?spm=1664612349106#%E7%81%AB%E7%8B%90%E6%B5%8F%E8%A7%88%E5%99%A8) |

安装成功后浏览器扩展栏将出现如下图标就是安装成功了：

![第一步](https://s2.loli.net/2022/12/03/edEG3mY7TLvCpgf.png)

### 2. 安装脚本【亚马逊批量下载业务报告】**`必须`**

> 请确保第 1 步的脚本管理器 Tampermonkey 已安装成功。然后点击下列地址安装 亚马逊批量下载业务报告 脚本

👉 **[亚马逊批量下载业务报告](https://greasyfork.org/zh-CN/scripts/449460)**

打开安装页面，点击下图中绿色按钮

![第二步](https://s2.loli.net/2022/12/03/cXLYKv5RgMAQe1z.png)

在弹出的窗口中继续点击安装，成功后窗口自动关闭，**（注意：安装完成后没有任何提示信息）**

![第三步](https://s2.loli.net/2022/12/03/tKvoxOH4hXFSgyN.png)

### 3. 设置浏览器自动保存下载文件，如下图设置 **`必须`**

![第四步](https://s2.loli.net/2022/12/03/OIKVLXd3CcihRuY.png))

### 4. 打开亚马逊的业务报告下载页面即可使用

![第五步](https://s2.loli.net/2022/12/03/s4QNLJy7uz6OrZF.png)
