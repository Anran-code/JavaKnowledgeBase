import catalog from './theme/catalog.json'
import { defineConfig } from 'vitepress'
const lessons = [
 ['start','从 Hello World 开始'],['types','变量与基本类型'],['casting','自动转换与强制转换'],
 ['methods','方法与 static'],['overload','方法重载'],['input','Scanner 键盘输入'],
 ['random','Math 与随机数'],['arrays','数组与二维数组'],['operators','异或与格式化输出'],['practice','把基础串成一个练习']
]
export default defineConfig({
 lang:'zh-CN',title:'安染的 Java 手册',description:'把学过的知识，和自己写过的代码放在一起。',
 cleanUrls:true,lastUpdated:false,srcExclude:['public/**'],
 head:[['link',{rel:'icon',type:'image/svg+xml',href:'/book.svg'}]],
 markdown:{lineNumbers:true},
 vite:{server:{strictPort:true}},
 themeConfig:{
  logo:'/book.svg',siteTitle:'安染的 Java 手册',
  nav:[{text:'总目录',link:'/',activeMatch:'^/$'},{text:'源码索引',link:'/sources'},{text:'整理说明',link:'/about'}],
  sidebar:{
   '/basics/':[{text:'返回总目录',link:'/'},{text:'语言基础',link:'/parts/foundation'},{text:'第一章 · Java 基础',items:[{text:'本章导读',link:'/basics/'},...lessons.map(([slug,text])=>({text,link:'/basics/'+slug}))]}],
   '/':[{text:'返回总目录',link:'/'},...catalog.map(group=>({text:group.title,link:group.link,collapsed:true,items:group.chapters.map(c=>({text:c.title,link:c.link}))}))]
  },
  outline:{level:[2,3],label:'本页目录'},
  docFooter:{prev:'上一节',next:'下一节'},
  darkModeSwitchLabel:'切换深浅主题',sidebarMenuLabel:'章节目录',returnToTopLabel:'返回顶部',
  search:{provider:'local',options:{
   detailedView:true,
   miniSearch:{options:{tokenize:(text:string)=>Array.from(new Intl.Segmenter('zh',{granularity:'word'}).segment(text), s=>s.segment).filter(s=>s.trim().length>0)},searchOptions:{prefix:true,fuzzy:0.2}},
   translations:{button:{buttonText:'搜索知识点',buttonAriaLabel:'搜索知识点'},modal:{displayDetails:'显示摘要',resetButtonTitle:'清空搜索',backButtonTitle:'返回',noResultsText:'没有找到相关知识点',footer:{selectText:'选择',navigateText:'切换',closeText:'关闭'}}}
  }}
 }
})
