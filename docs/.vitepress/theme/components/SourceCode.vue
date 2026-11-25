<script setup>
import {computed,ref} from 'vue'
import sources from '../generated/sources.json'
const props=defineProps({id:String})
const source=computed(()=>sources[props.id])
const full=ref(false)
const copied=ref(false)
async function copy(){
 try {
  await navigator.clipboard.writeText(full.value?source.value.code:source.value.excerpt)
  copied.value=true;setTimeout(()=>copied.value=false,1600)
 }catch {copied.value=false}
}
</script>
<template>
 <section v-if="source" class="source-card" :aria-label="'你的源码 '+source.name">
  <div class="source-top"><span class="source-mark">JAVA</span><strong>{{source.name}}</strong><span class="source-badge">你的练习</span></div>
  <p class="source-path">{{source.path}}</p>
  <div class="source-controls">
   <div class="source-tabs" role="group" aria-label="选择源码范围">
    <button :class="{active:!full}" :aria-pressed="!full" @click="full=false">关键片段 <small>L{{source.start}}–{{source.end}}</small></button>
    <button :class="{active:full}" :aria-pressed="full" @click="full=true">完整源码</button>
   </div>
   <button class="copy-source" @click="copy">{{copied?'已复制':'复制代码'}}</button>
  </div>
  <div class="source-code" :class="{expanded:full}" v-html="full?source.html:source.excerptHtml"></div>
  <div class="source-foot"><span>源码保持原样 · 讲解见正文</span><a :href="'/sources/'+id+'.java'" :download="source.name">下载源文件</a></div>
 </section>
</template>
