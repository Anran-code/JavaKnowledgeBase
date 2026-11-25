<script setup>
import {computed} from 'vue'
import catalog from '../catalog.json'
const props=defineProps({part:String})
const group=computed(()=>catalog.find(g=>g.id===props.part))
const count=catalog.reduce((n,g)=>n+g.chapters.length,0)
</script>
<template>
 <div v-if="group" class="part-page">
  <div class="catalog-breadcrumb"><a href="/">返回总目录</a><span>/ {{group.title}}</span></div>
  <header class="catalog-heading"><span class="book-label">分部目录</span><h1>{{group.title}}</h1><p>{{group.description}}</p></header>
  <div class="section-title"><h2>选择要阅读的章节</h2><span>{{group.chapters.length}} 个章节与专题</span></div>
  <div class="lesson-list"><a v-for="chapter in group.chapters" :key="chapter.slug" :href="chapter.link" class="lesson-row chapter-row"><span class="lesson-num">{{chapter.number}}</span><div><h3>{{chapter.title}}</h3><p>{{chapter.note || chapter.modules.join(' · ')}}</p></div><span class="chapter-status" :class="{ready:chapter.ready}">{{chapter.ready?'完整样章':'目录已导入'}}</span></a></div>
  <p class="catalog-footnote">“目录已导入”的章节已关联现有笔记或源码，正文会逐部分继续整理。</p>
  <a href="/" class="catalog-return">返回总目录</a>
 </div>
 <div v-else class="catalog-home">
  <header class="catalog-heading"><div class="eyebrow"><span class="book-label">我的学习书架</span><span>JAVA / PERSONAL HANDBOOK</span></div><h1>把学过的 Java，<br><em>放回一本书里。</em></h1><p>从知识点找到笔记，从笔记回到自己的代码。<br>按章节慢慢读，也可以直接搜索一个关键词。</p><div class="hero-actions"><a href="/basics/" class="primary-link">阅读 Java 基础样章</a><a href="/about" class="secondary-link">整理说明</a></div></header>
  <div class="catalog-summary"><span><b>{{catalog.length}}</b> 个学习部分</span><span><b>{{count}}</b> 个章节与专题</span><span>Java 基础已完成样章 · 其余目录已导入</span></div>
  <div class="section-title"><h2>全书目录</h2><span>选择一个部分，开始翻阅</span></div>
  <div class="part-grid"><a v-for="part in catalog" :key="part.id" :href="part.link" class="part-card"><div class="part-card-top"><span>{{part.chapters.length}} 个章节与专题</span><span>{{part.id==='foundation'?'含完整样章':'目录已导入'}}</span></div><h2>{{part.title}}</h2><p>{{part.description}}</p><div class="part-topics"><span v-for="chapter in part.chapters" :key="chapter.slug">{{chapter.title}}</span></div><span class="part-enter">进入分部目录</span></a></div>
  <footer class="catalog-footer">这本手册，和你的学习一起生长。<span>笔记 · 源码 · 练习</span></footer>
 </div>
</template>
