---
title: 第二章 · 程序流程控制
aside: false
prev:
  text: Java 基础
  link: /basics/
next:
  text: if：按条件选择
  link: /flow/if
---
<div class="catalog-breadcrumb"><a href="/">总目录</a><span>/</span><a href="/parts/foundation">语言基础</a><span>/ 程序流程控制</span></div>

# 程序流程控制

让程序知道什么时候选择、什么时候重复、什么时候结束。

本章结合你的 10 份 Java 练习，整理为 9 个小节。从分支与循环出发，再回到计算器、验证码、猜数字和素数输出。先读代码的执行路径，再检查输入与边界。

<FlowContents />

## 阅读时抓住三个问题

- 分支：哪些条件互斥，边界有没有遗漏？
- 循环：什么状态在变化，什么时候能够结束？
- 方法：这段代码接受什么输入，调用者需要满足什么前提？

原始源码保持原样，讲解会区分当前实现与可扩展思路。
