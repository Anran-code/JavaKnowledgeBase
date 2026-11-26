<script setup>
import lessons from '../flow-lessons.json'
</script>
<template><div class="section-title"><h2>本章阅读路线</h2><span>9 个小节 · 10 份源码</span></div><div class="lesson-list"><a v-for="(lesson,i) in lessons" :key="lesson.slug" :href="'/flow/'+lesson.slug" class="lesson-row"><span class="lesson-num">{{String(i+1).padStart(2,'0')}}</span><div><h3>{{lesson.title}}</h3><p>{{lesson.description}}</p></div></a></div></template>
