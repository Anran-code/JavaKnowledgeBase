<script setup>
import {onMounted,ref,watch} from 'vue'
import {useRoute} from 'vitepress'
defineProps({chapter:{default:'Java 基础'},chapterLink:{default:'/basics/'}})
const route=useRoute()
const done=ref(false)
const pageKey=()=>route.path.replace(/\.html$/,'').replace(/\/$/,'')
function load(){try{done.value=JSON.parse(localStorage.getItem('java-book-read')||'[]').map(p=>p.replace(/\.html$/,'')).includes(pageKey())}catch{done.value=false}}
function toggle(){try{const paths=new Set(JSON.parse(localStorage.getItem('java-book-read')||'[]'));if(done.value)paths.delete(pageKey());else paths.add(pageKey());localStorage.setItem('java-book-read',JSON.stringify([...paths]));done.value=!done.value}catch{}}
onMounted(load);watch(()=>route.path,load)
</script>
<template><div class="reading-tools"><span><a href="/">总目录</a> / <a :href="chapterLink">{{chapter}}</a></span><button @click="toggle" :aria-pressed="done">{{done?'✓ 已读过这一节':'标记为已读'}}</button></div></template>
