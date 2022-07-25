(window.webpackJsonp=window.webpackJsonp||[]).push([[40],{596:function(s,a,t){"use strict";t.r(a);var n=t(4),e=Object(n.a)({},(function(){var s=this,a=s.$createElement,t=s._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("h2",{attrs:{id:"c语言简单代码解析"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#c语言简单代码解析"}},[s._v("#")]),s._v(" C语言简单代码解析")]),s._v(" "),t("div",{staticClass:"language-c line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-c"}},[t("code",[t("span",{pre:!0,attrs:{class:"token macro property"}},[t("span",{pre:!0,attrs:{class:"token directive-hash"}},[s._v("#")]),t("span",{pre:!0,attrs:{class:"token directive keyword"}},[s._v("include")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("<stdio.h>")])]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("main")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("printf")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"hello world\\r\\n"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("return")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("0")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br")])]),t("p",[t("img",{attrs:{src:"https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/4021/%E6%97%A0%E6%A0%87%E9%A2%98-2021-09-14-2036.excalidraw.png",alt:"图解"}})]),s._v(" "),t("h2",{attrs:{id:"gdb调试"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#gdb调试"}},[s._v("#")]),s._v(" gdb调试")]),s._v(" "),t("p",[s._v("加上调试选项")]),s._v(" "),t("div",{staticClass:"language-bash line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[s._v("gcc demo1.c -o demo1 -g\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("p",[s._v("可以使用"),t("code",[s._v("gcc -h")]),s._v("或者"),t("code",[s._v("man gcc")]),s._v("来查看如何使用。")]),s._v(" "),t("p",[s._v("证明它使用了调试信息：")]),s._v(" "),t("div",{staticClass:"language-bash line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("root@jb51 c"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# file demo1")]),s._v("\ndemo1: ELF "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("64")]),s._v("-bit LSB executable, x86-64, version "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("SYSV"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(", dynamically linked "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("uses shared libs"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(", "),t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("for")]),s._v(" GNU/Linux "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("2.6")]),s._v(".32, BuildID"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),s._v("sha1"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v("7603f8afb0d7daa9a7775274d97b19a830354a5d, not stripped\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br")])]),t("div",{staticClass:"language-bash line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[s._v("gdb -q ./demo1\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])]),t("p",[s._v("常用命令：")]),s._v(" "),t("ul",[t("li",[s._v("start: 启动程序")]),s._v(" "),t("li",[s._v("next，缩写n：下一步，单步执行")]),s._v(" "),t("li",[s._v("step：下一步，缩写s，单步执行")]),s._v(" "),t("li",[s._v("display，x，print：打印值")]),s._v(" "),t("li",[s._v("quit：退出")])]),s._v(" "),t("blockquote",[t("p",[s._v("在linux系统中，启动程序后，操作系统会给进程分配一个比较大的且连续的内存空间【地盘】")]),s._v(" "),t("p",[s._v("内存位置是以字节为单位衡量空间的大小的，同时进程的空间会划分为多个区域，每个区域都有不同的权限，并且每个区域上的权限也不同。")])]),s._v(" "),t("ul",[t("li",[t("p",[s._v("权限：可读、可写、可执行")])]),s._v(" "),t("li",[t("p",[s._v("变量的权限：默认都是可读可写")])]),s._v(" "),t("li",[t("p",[s._v("变量的本质：其实是内存地址的一个助记符号，其实是内存首地址的一个助记符号，"),t("code",[s._v("start address")]),s._v("，也可以说是基地址。")])])]),s._v(" "),t("blockquote",[t("p",[s._v("CPU执行程序的时候是逐条指令执行的【速度是非常之快的】")])]),s._v(" "),t("div",{staticClass:"language-bash line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[s._v("root@jb51 c"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# gdb -q ./demo2")]),s._v("\nReading symbols from /data/work/c/demo2"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("..")]),s._v(".done.\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("gdb"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" start\nTemporary breakpoint "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(" at 0x400535: "),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("file")]),s._v(" demo2.c, line "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("9")]),s._v(".\nStarting program: /data/work/c/./demo2 \n\nTemporary breakpoint "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(", main "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" at demo2.c:9\n"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("9")]),s._v("               a "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" 0x11223344"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\nMissing separate debuginfos, use: debuginfo-install glibc-2.17-325.el7_9.x86_64\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("gdb"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" p sizeof"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("int"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$1")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("4")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("gdb"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" p "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v("a\n"),t("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$2")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("int *"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" 0x7fffffffe45c\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br")])]),t("ul",[t("li",[t("p",[t("code",[s._v("0x7fffffffe45c")]),s._v("：这个是一个随机值，每次运行的时候，地址是会随机变化的，是随机分配的。")])]),s._v(" "),t("li",[t("p",[t("code",[s._v("p &a")]),s._v("："),t("code",[s._v("print &a")]),s._v("：打印a的内存地址")])]),s._v(" "),t("li",[t("p",[t("code",[s._v("p a")]),s._v("：等价于"),t("code",[s._v('printf("%d\\n", a)')]),s._v("，要从首地址开始取出数据且按4字节大小方式取出数据")])])]),s._v(" "),t("p",[s._v("那这样，它的地址后面的是连续的，后面的地址则不叫首地址了")]),s._v(" "),t("ul",[t("li",[t("p",[s._v("首地址："),t("code",[s._v("0x7fffffffe45c")])])]),s._v(" "),t("li",[t("p",[t("code",[s._v("0x7fffffffe45d")])])]),s._v(" "),t("li",[t("p",[t("code",[s._v("0x7fffffffe45e")])])]),s._v(" "),t("li",[t("p",[t("code",[s._v("0x7fffffffe45f")])])])]),s._v(" "),t("div",{staticClass:"language-c line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-c"}},[t("code",[t("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" a"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("printf")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"%p\\n"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v("a"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("// 打印变量a的地址，【进程的虚拟地址】")]),s._v("\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br")])]),t("div",{staticClass:"language-bash line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("gdb"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" display /4xb "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v("a\n"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(": x/4xb "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v("a\n0x7fffffffe45c: 0x00    0x00    0x00    0x00\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br")])]),t("p",[s._v("打印变量"),t("code",[s._v("a")]),s._v("其余位置的地址")]),s._v(" "),t("p",[s._v("执行下一步，n: "),t("code",[s._v("next")])]),s._v(" "),t("div",{staticClass:"language-bash line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("gdb"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" n\n"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("11")]),s._v("              printf"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"%d'),t("span",{pre:!0,attrs:{class:"token entity",title:"\\n"}},[s._v("\\n")]),s._v('"')]),s._v(", a"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),s._v(": x/4xb "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v("a\n0x7fffffffe45c: 0x44    0x33    0x22    0x11\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br")])]),t("p",[s._v("取数据")]),s._v(" "),t("div",{staticClass:"language-bash line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-bash"}},[t("code",[t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("gdb"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" p /x *"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("((")]),s._v("char*"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("&")]),s._v("a"),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" + "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("1")]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token variable"}},[s._v("$8")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" 0x33\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br")])]),t("p",[s._v("二进制数值表示符号，例如：11001000")]),s._v(" "),t("ul",[t("li",[s._v("1：最高位，也称之为符号位，1：负数，0：正数")]),s._v(" "),t("li",[s._v("后面是数值位")])]),s._v(" "),t("p",[s._v("如果是无符号的，8位都是数值。")]),s._v(" "),t("blockquote",[t("p",[s._v("数据类型只是影响数据的内存空间大小，特别注意就是有没有加上"),t("code",[s._v("unsigned")]),s._v("，区分有符号和无符号")])])])}),[],!1,null,null,null);a.default=e.exports}}]);