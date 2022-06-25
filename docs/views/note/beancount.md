---
title: 'Beancount入门'
date: 2022-06-25 15:16:15
# 永久链接
permalink: '/note/beancount'
sidebar: 'auto'
isShowComment: true
categories:
 - note
tags:
 - null
---



:::tip 转自

[https://www.skyue.com/19101819.html](https://www.skyue.com/19101819.html)

:::

## 一、普通记账 vs 复式记账

Beancount 记账方法叫复式记账。

把只记录收支的方法称为**普通记账**（估计是多数人在用的方法）。那么**复式记账**，除了记录收支，还需记录账户（支付宝、银行卡等）的变动。以一个最简单的例子感受二者的区别：

假设：7 月 1 日，打车花费 30 元，使用**银行卡**支付。

普通记账一般包括日期、收支分类和金额，如下：

```
2019-08-28: 交通-打车 -200元
```

复式记账把账户变化也一并记账，如下：

```
2019-08-28:
    交通-打车    200元
    银行卡      -200元
```

**复式记账会记录每笔交易的资金流动，各账户变化「有正有负，正负相等」。这便是复式记账的基本原理，称之为「会计恒等式」**。这种方式能够保证记账准确无误，也能提供更详细的财务分析。

这句话中的**账户**是广义的，也可理解为分类，「银行卡」和「交通 - 打车」都是账户。下文中出现账户，若无特别说明，均指广义的账户。

------

## 二、Beancount 入门

**复式记账是方法论，而 Beancount 则是支持复式记账的工具**，Beancount 有以下三个优点：

1.  完整个人财务数据比较敏感，Beancount 本地存储，不用担心数据泄露。
2.  纯文本账本，不依赖特定软件，便于数据迁移。
3.  Beancount 是开源软件。

接下来介绍 Beancount 的基础使用。

### 安装

beancount 是个 Python 项目，安装好 [python](https://www.python.org/downloads/) 后，执行：

```
pip install beancount
pip install fava
```

Fava 是关联软件，为 Beancount 提供一个更漂亮的 Web 界面（如图 1/2/3），建议同时安装。

### 账本示例

Beancount 的使用非常简单，概括为两步：

**第一步**：使用文本文件按一定格式记账。

下面是个完整示例，直接保存为 `moneybook.bean`（Beancount 的文件扩展名为`.bean`）

```
;【一、账本信息】
option "title" "我的账本" ;账本名称
option "operating_currency" "CNY" ;账本主货币

;【二、账户设置】
;1、开设账户
1990-01-01 open Assets:Card:1234 CNY, USD ;尾号1234的银行卡，支持CNY和USD
1990-01-01 open Liabilities:CreditCard:5678 CNY, USD ;双币信用卡
1990-01-01 open Income:Salary CNY ;工资收入
1990-01-01 open Expenses:Tax CNY ;交税
1990-01-01 open Expenses:Traffic:Taxi CNY ;打车消费，只支持CNY
1990-01-01 open Equity:OpenBalance ;用于账户初始化，支持任意货币

;2、账户初始化
2019-08-27 * "" "银行卡，初始余额10000元"
    Assets:Card:1234           10000.00 CNY
    Equity:OpenBalance        -10000.00 CNY

;【三、交易记录】
2019-08-28 * "杭州出租车公司" "打车到公司，银行卡支付"
    Expenses:Traffic:Taxi        200.00 CNY
    Assets:Card:1234            -200.00 CNY

2019-08-29 * "" "餐饮"
    Assets:Card:1234           -1100.00 CNY
    Liabilities:CreditCard:5678 1100.00 CNY
    
2019-08-31 * "XX公司" "工资收入"
    Assets:Card:1234           12000.00 CNY
    Expenses:Tax                1000.00 CNY
    Income:Salary             
```

**第二步**：命令行执行 `fava moneybook.bean`，看到如下结果：

```
 $ fava moneybook.bean                                                                                                                                              
Running Fava on http://localhost:5000
```

再到浏览器中打开 `http://localhost:5000` 就能看到账本，下图分别是损益表、资产负债表、日记账的截图。其它栏目自行探索。



[![记账神器Beancount教程](https://static.skyue.com/blog_static/2019/191018-moneybook-1.png)](https://static.skyue.com/blog_static/2019/191018-moneybook-1.png)图 1 - 损益表





[![记账神器Beancount教程](https://static.skyue.com/blog_static/2019/191018-moneybook-2.png)](https://static.skyue.com/blog_static/2019/191018-moneybook-2.png)图 2 - 资产负债表





[![记账神器Beancount教程](https://static.skyue.com/blog_static/2019/191018-moneybook-3.png)](https://static.skyue.com/blog_static/2019/191018-moneybook-3.png)图 3 - 日记账



### 记账格式

使用 Beancount，关键就是了解它的记账格式。从示例可知，账本包括三个部分：

-   账本信息：比如账本名称，账本主货币。
-   账户设置：包括开设账户和账户初始化。
-   交易记录：日常记账。

下面依次介绍。

#### 账本信息

一般设置账本的名称和主货币即可。

```
option "title" "我的账本" ;账本名称
option "operating_currency" "CNY" ;账本主货币
```

#### 账户设置

【开户】

记账之前，得有账户，开户格式如下：

```
开启日期 open 账户名 货币类型
```

Beancount 中账户名支持层级，以英文冒号`:` 分隔，如 `Assets:Card:1234`。但第一层必须是以下五个账户之一，日常交易中涉及到的账户，一定可以归于其中某一类：

-   **收入（Income）**：工资、投资收益等。
-   **支出（Expenses）**：衣、食、住、行等。
-   **资产（Assets）**：储蓄卡余额、支付宝余额、股票账户余额、房子、车子等。
-   **负债（Liabilities）**：信用卡欠款、房贷、车贷等。
-   **权益（Equity）**：这个账户比较特殊，在账户初始化、误差处理等少数场合使用。

开启日期可使用真实日期，若忘了了，我习惯使用自己的生日或开始复式记账的前一天（2019-06-30）。

开设账户时货币类型不是必须的，但建议加上，记录交易时货币不一致 Beancount 会报错。货币可设多个，用英文逗号（,）分隔。

最后，如果一个账户不再使用，比如注销信用卡。可用 `close` 命令关闭账户。如下：

```
关闭日期 close 账户名
```

【初始化】

当我们开始记账时，一般资产和负债都不会是 0，因此需要对资产和负债账户进行初始化。初始化的格式与交易明细完全一致，请参考正文的交易明细介绍。

唯一不同，初始化需要用到 Equity 账户。如示例中的 `Assets:Card:1234`，初始金额 10000 元来自 `Equity:OpenBalance`。

#### 交易明细

账户设置中的初始化，和交易明细有关，因此先介绍交易明细的记录格式。如下：

```
日期 * "交易方" "交易备注"
    账户   金额 货币
    账户   金额 货币
```

其中

-   `*` 号表示这笔交易是确定的，没有疑问。若是 `!` 号，表示存疑，但一般用不上。
-   交易方和交易备注，均可省略。
-   货币必须与账户设置中对应的货币类型一致。比如账户设置为美元账户，消费时出现人民币，Beancount 会报错。

此外，账户后的金额是带有符号的，如下：

-   支出账户：一般为正数。表示花费多少钱。
-   收入账户：一般为负数。表示收入多少钱。投资收入账户可能出现正数，则表示投资亏损。
-   资产账户：可正可负。正数表示有钱存入，余额增加；负数表示有钱转出，余额减少。
-   负债账户：可正可负。正数表示还款，负债减少；负数表示借款，负债增加。

**支出为正，收入为负，**有点反直觉，是会计恒等式逻辑所致。会计恒等式具体表述如下：

>   (Assets + Expenses) + (Liabilities + Income) + Equity = 0

一笔交易记录可能涉及 2 个以上的账户，比如例子中的「工资收入」，这时，多个账户的金额也满足「**有正有负，正负相等**」。实际记录时，Beancount 允许一个账户的金额为空，它会根据正负相等的原则自动计算。

看到这里，已经可以开始动手记账了。开设好账户，然后初始化，最后每天记录交易。

------

## 三、Beancount 实践

下面是些个人使用经验，供参考。

### 编辑器

我使用的是 VSCode 编辑器，配合 `Beancount` 插件（by Lencerf），能够实现语法着色、账户自动补全、数字按小数点对齐、错误提示等，大大提高记账效率。

### 拆分账本

如果按前面的方法记账，一段时间后会发现：**随着交易增加，账本文件越来越大，维护不方便**。

Beancount 允许将账本拆分，然后通过 `include` 语法将账本进行关联起来。比如，我的账本结目录构如下：

```
beancount
├── 2018
│   ├── 2018.bean
│   └── yuegangzhoudian.bean
├── 2019
│   ├── 2019.bean
│   ├── 0-default
│   │   ├── 00.bean
│   │   ├── 07-expenses.bean
│   │   ├── 08-expenses.bean
│   │   ├── 09-expenses.bean
│   │   ├── 10-expenses.bean
│   │   ├── event.bean
│   │   ├── income.bean
│   │   └── transfer.bean
│   ├── 1-securities
│   │   ├── 00.bean
│   ├── 2-trip
│   │   ├── 00.bean
│   │   ├── 20190708-beijing.bean
│   │   ├── 20190720-yiwu.bean
│   ├── 3-cycle
│   │   ├── 00.bean
│   │   ├── bankcard.bean
│   │   ├── creditcard.bean
│   │   ├── cycle-expenses.bean
│   │   └── loans.bean
│   ├── 4-project
│   │   ├── 00.bean
│   └── 5-doc
│       ├── 2019-note.md
│       ├── creditcard-bill
│       └── note.xlsx
├── accounts
│   ├── assets.bean
│   ├── equity.bean
│   ├── expenses.bean
│   ├── income.bean
│   └── liabilities.bean
|── main.bean
```

最底下的 `main.bean` 是我的主账本（查账执行 `fava main.bean`）。该文件的内容如下：

```
;==main文件==
;【一、账本设置】
option "title" "我的账本"
option "operating_currency" "CNY" 
1990-01-01 custom "fava-option" "language" "zh" 

;【二、账户设置】
include "accounts/assets.bean"  ;资产账户设置及初始化
include "accounts/liabilities.bean"  ;负债账户设置及初始化
include "accounts/expenses.bean"  ;支出账户设置
include "accounts/income.bean"  ;收入账户设置
include "accounts/equity.bean"  ;权益账户设置

;【三、交易记录】
include "2018/2018.bean" ;历史账本合集
include "2019/2019.bean" ;2019年账本合集
```

我使用 `include` 导入了 7 个文件，其中 5 个账户设置文件，2 个年度账本。

我 2019 年年度账本如下：

```
;==2019.bean文件==
;2019年每个账本文件的描述
include "0-default/00.bean" ;默认目录，每月日常支出，收入，转账等
include "1-securities/00.bean" ;证券投资目录
include "2-trip/00.bean" ;旅行&出差目录
include "3-cycle/00.bean" ;周期性费用/交易目录
include "4-project/00.bean" ;项目目录
```

`2019.bean` 文件仍然没有交易记录，而是继续导入其它账本。

概括起来，我的账本结构分三层：

最 1 层：`main.bean` 作为主账本，include 各个账户文件及每年账本文件。
第 2 层：每年有个目录，下设`年份.bean` 的文件，include 各个子目录下 `00.bean` 文件。
第 3 层：每个子目录下 `00.bean` 文件 include 该目录下所有正式的记账文件。

年份目录下各子目录功能如下：

-   默认目录（0-default）：日常支出，每月一个文件，也包括当年的收入、转账、event 事件。
-   证券投资（1-securities）：股票和基金买卖记录。
-   旅行出差（2-trip）：旅行出差的账本，命名`日期-地点.bean`
-   周期性账（3-cycle）：包括每月信用卡还款、水电费、车贷房贷等。
-   项目目录（4-project）：比如装修房子

这样设计优点：

-   按年组织，往年数据直接存档，不会被破坏
-   年份目录下进行分类记录，避免放在一个文件不好维护

### 定期断言

前面介绍复式记账优点时提到：

>   这种方式能够保证记账准确无误。

在 Beancount 中通过 `balance` 实现账户核对。

假设在 10 月 17 日 24 点，尾号 1234 的银行卡余额为 5000 元，记录如下：

```
2019-10-18 balance Assets:Card:1234   5000.00 CNY
```

Beancount 会自动汇总 10 月 17 日（含）以前尾号 1234 的银行卡所有收支，如果历史交易记录无误，那么计算出来也应该是 5000 元。若不是 5000 元，则 Beancount 报错，表示历史交易记录有误。

细心的朋友会发现，10 月 17 日 24 点余额，balance 时使用 2019-10-18。

我一般**每月对所有账户进行一次断言**，频繁使用的账户月中会视情况穿插几次断言，避免错误。

### 错误 / 误差处理

如果断言报错，一般我会回溯，因为每月有断言的习惯，所以最多回溯一月数据即可。若无法回溯，则使用 `Euqity:UFO` 记录。

假如断言时发现 `Assets:Card:1234` 少了 200 元，则在断言前增加：

```
2019-10-18 * "" ""
    Assets:Card:1234    -200.00 CNY
    Equity:UFO
```

另一个错误场景是误差。假如存在四舍五入的误差，我用 `Equity:Round` 处理，比如：

```
2019-10-09 * "支付宝基金" "购买基金110011易方达中小盘混合"
    Assets:Bank:CMB:XXXX           -450.00 CNY
    Assets:Alipay:Fund               85.05 FD_110011 {5.2830 CNY}
    Expenses:Commission:AlipayFund    0.67 CNY
    Equity:Round
```

`Equity` 账户是个很特别的存在，可以处理边缘情况。我设置了四个 `Equity` 账户如下：

-   `Equity:OpenBalance` 用于初始化
-   `Equity:HistoryIncome` 开始复式记账（2019-07-01）前的部分收入
-   `Equity:Round` 四舍五入操作
-   `Equity:UFO` 无法追溯的差额

### 多币种及货币转化

账户可以根据实际情况设置多个货币。比如 Visa 信用卡美元消费以美元入账，则需要支持美元。

对于美元消费以人民币入账，可以使用 `@@`进行货币转化。比如，本博客的服务器账单如下，3.71 美元以 26.57 入账。

```
2019-10-04 * "Amazon" "付lightsail服务器月账单"
    Liabilities:CreditCard:SPDB:XXXX          -26.57 CNY
    Expenses:Digital:Software                   3.71 USD @@ 26.57 CNY
```

在 `option` 中设置**账本**货币时，通常只需要一种主货币，Fava 显示时，非主货币都会放进「其它」那一列，如图 1。

### 标签

一个问题：约会时的用餐，该记在哪个账户？

可以记在 `Expenses:Food` 饮食支出账户，也可以记在 `Expenses:Date:Food` 约会分类下饮食。如果使用后者，Food 类账户越来越多，不便于维护。

此时，我一般使用前者，并借助 Beancount 提供的标签功能。如下：

```
2019-10-18 * "" "" #Date
    Assets:Card:1234        -200.00 CNY
    Expenses:Food
```

其中`#Date` 是标签，在 Fava 上可以筛选标签，查看该标签下各个账户的收支。

再比如，每次旅游，我会给旅游中所有的花费打上类似`#20191001-hangzhou` 的标签，带有日期和目的地。通过筛选标签，轻易的查看旅游中的吃、住、行、玩等等花销。

旅行的交易通常很多，一条条添加标签比较繁琐，Beancount 支持使用 `pushtag` 和 `poptag` 给多笔交易加上标签。

```
pushtag #20191001-hangzhou

2019-10-18 * "" "" 
    Assets:Card:1234        -200.00 CNY
    Expenses:Food:Dinner
    
2019-10-18 * "" "" 
    Assets:Card:1234         -20.00 CNY
    Expenses:Traffic:Taxi

poptag #20191001-hangzhou
```

这样，在 `pushtag` 和 `poptag` 之间的所有交易，都会带上`#20191001-hangzhou` 标签.

### 事件

生活中可能有些事件希望被记录，这已经和记账没多大关系了，不过 Beancount 也支持，格式：

```
日期 event "事件分类" "事件详情"
```

比如我的事件举例：

```
;beancount事件
2019-06-30 event "beancount" "启用beancount"

;工作事件
2019-08-30 event "work" "神马lastday"
2019-09-02 event "work" "今天开始在AE上班"

;旅行或出差记录location事件
2019-09-13 event "location" "杭州->苏州：去程"
2019-09-15 event "location" "苏州->杭州：回程"
```

然后 Fava 界面有事件查看界面。

## 四、结语

没想到写了这么多，断断续续也写了多天，有点意犹未尽。

学习过程中，除了 byvoid 的[文章](https://www.byvoid.com/zht/blog/beancount-bookkeeping-1)，还参考了 wzyboy 和 [Beancount —— 命令行复式簿记](https://wzyboy.im/post/1063.html)和[官方文档](https://docs.google.com/document/d/1RaondTJCS_IUPBHFNdT8oqFKJjVJDsfsn6JEjBG04eA/edit)

能用这种方式去记账，很大程度上利益于移动支付的普及。熟练之后，每天晚上对照支付宝和微信账单，3 分钟就能记完。

当然，这仍然不是最好的方式，wzyboy 已经实现了 import，每月花一两个小时处理一次即可。我觉得 import 的方式得到的信息不够丰富和详细，所以没有深入研究。

Beancount 还有些高级应用，比如记录证券投资，使用 BQL 语句统计分析。各种满足工具控的折腾欲。