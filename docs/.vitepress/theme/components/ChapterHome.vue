<script setup>
import {onMounted,ref} from 'vue'
import meta from '../generated/meta.json'
const readCount=ref(0)
onMounted(()=>{try{readCount.value=JSON.parse(localStorage.getItem('java-book-read')||'[]').filter(p=>p.startsWith('/basics/')).length}catch{}})
const lessons=[
 ['start','从 Hello World 开始','入口、包与项目结构','HelloWorld.java'],
 ['types','变量与基本类型','8 种基本类型，和 C++ 有什么不同','Type.java'],
 ['casting','自动转换与强制转换','类型提升、截断与字符编码','Type.java · Basic.java'],
 ['methods','方法与 static','定义、参数、返回值与调用','Basic.java'],
 ['overload','方法重载','同一个名字，不同的参数列表','MethodOverload.java'],
 ['input','Scanner 键盘输入','读取、校验与换行陷阱','MyScanner.java'],
 ['random','Math 与随机数','范围、取整与数字验证码','Basic.java'],
 ['arrays','数组与二维数组','下标、遍历、成绩统计与洗牌','Array.java · Poker.java'],
 ['operators','异或与格式化输出','位运算、printf 与字符串比较','基础笔记'],
 ['practice','把基础串成一个练习','从输入到计算，再到格式化输出','Practice.java']
]
</script>
<template>
 <div class="chapter-hero">
  <div class="eyebrow"><span class="book-label">我的学习书架</span><span>第一章 · 已整理</span></div>
  <h1>重新翻开<br><em>Java 的第一页。</em></h1>
  <p class="hero-intro">把学过的知识，和自己写过的代码放在一起。<br>从一个入口开始，读懂类型、方法与数组。</p>
  <div class="hero-actions"><a class="primary-link" href="/basics/start">开始阅读</a><a class="secondary-link" href="/sources">查看本章源码</a></div>
  <div class="hero-book" aria-hidden="true"><div class="book-spine"></div><div class="book-cover"><span>ANRAN / JAVA NOTES</span><b>从理解<br>到写出来</b><code>public static void main</code><i>笔记 × 源码 × 练习</i></div><div class="book-edge"></div></div>
 </div>
 <div class="chapter-metrics"><div><b>10</b><span>个知识小节</span></div><div><b>{{meta.sourceCount}}</b><span>份真实源码</span></div><div><b>{{readCount}} / 10</b><span>小节已读</span></div></div>
 <div class="chapter-note"><span class="note-icon">✦</span><div><strong>为有 C++ 基础的你整理</strong><p>熟悉的语法快速带过，把注意力放在 Java 的类型规则、对象调用和常见易错点上。</p></div></div>
 <div class="section-title"><h2 id="reading-path">本章阅读路线</h2><span>按顺序读，也可以按需查</span></div>
 <div class="lesson-list">
  <a v-for="(lesson,i) in lessons" :key="lesson[0]" :href="'/basics/'+lesson[0]" class="lesson-row"><span class="lesson-num">{{String(i+1).padStart(2,'0')}}</span><div><h3>{{lesson[1]}}</h3><p>{{lesson[2]}}</p></div><span class="lesson-file">{{lesson[3]}}</span></a>
 </div>
 <div class="home-bottom"><div><b>不只是重新排版笔记</b><p>每一节都关联原始练习，保留关键片段、完整源码与易错点。输入类名、API 或中文关键词即可搜索。</p></div><a href="/about">了解这本手册</a></div>
</template>
