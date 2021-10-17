const themeConfig = require('./config/theme/index.js')
const navConf = require('./config/nav/index')
const sidebarConf = require('./config/sidebar/index')
const pluginsConf = require('./config/plugins/index')
module.exports = {
    title: "wxvirus",
    description: '纯粹的浪荡人士与抱定决心干大事的人，面相是截然不同的。',
    base: '/vue-blog/',
    // dest: 'public',
    head: [
        ['link', { rel: 'icon', href: '/logo.jpg' }],
        ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
        ["meta", { name: "robots", content: "all" }],
        ["meta", { name: "author", content: "CHANX" }],
        ['meta', { name: 'keywords', content: 'wxvirus,virusblog,无解的博客,后端,运维,blog,vuepress-blog' }],
        // ['script', { type: 'text/javascript', src: '/assets/js/baidu.js' }],
        ['script', { src: "/assets/js/jq3.5.1.js" }, ``],
        ['script', { src: "/assets/js/mouse.js" }, ``],

    ],
    theme: 'reco',
    themeConfig: {
        type: 'blog',
        smoothScroll: true,
        // 博客设置
        blogConfig: {
            category: {
                location: 2, // 在导航栏菜单中所占的位置，默认2
                text: '分类' // 默认 “分类”
            },
            tag: {
                location: 3, // 在导航栏菜单中所占的位置，默认3
                text: '标签' // 默认 “标签”
            }
        },
        valineConfig: {
            appId: 'AG5GjOH1Wf5NkPfss2t1zdec-gzGzoHsz',// your appId
            appKey: 'p5ynUkyUglPJ7mklJBW0y5g2', // your appKey
            recordIP: true,
            placeholder: '填写邮箱地址可以及时收到回复噢...',
            visitor: true,
        },
        authorAvatar: '/logo.jpg',
        // 最后更新时间
        lastUpdated: '上次更新时间', // string | boolean
        repo: 'sword-demon/vue-blog',
        // 如果你的文档不在仓库的根部
        docsDir: 'docs',
        // 可选，默认为 master
        docsBranch: 'main',
        editLinks: true,
        editLinkText: '在 GitHub 上编辑此页！',
        // 作者
        author: '无解',
        // 项目开始时间
        startYear: '2020',
        nav: navConf,
        // sidebar: sidebarConf,
        // logo: '/head.png',
        // 搜索设置
        search: true,
        searchMaxSuggestions: 10,
        // 自动形成侧边导航
        sidebar: 'auto',
        friendLink: [
            {
                title: '午后南杂',
                desc: 'Enjoy when you can, and endure when you must.',
                email: '1156743527@qq.com',
                link: 'https://www.recoluan.com'
            },
            {
                title: 'vuepress-theme-reco',
                desc: 'A simple and beautiful vuepress Blog & Doc theme.',
                logo: "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
                link: 'https://vuepress-theme-reco.recoluan.com'
            },
            {
                title: '枫枫知道',
                desc: '后端设计师、程序员',
                logo: 'https://blog.fengfengzhidao.icu/static/ico/image.ico',
                link: 'https://blog.fengfengzhidao.icu/'
            }
        ]
    },
    markdown: {
        lineNumbers: true,
        extendMarkdown: md => {
            // 使用 markdown-it的插件
            md.use(require('markdown-it-sup'))
        }
    },
    plugins: pluginsConf
}