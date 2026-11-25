---
title: 线程与线程池
prev: false
next: false
---
<div class="catalog-breadcrumb"><a href="/">总目录</a><span>/</span><a href="/parts/systems">IO 与并发网络</a><span>/ 线程与线程池</span></div>

# 线程与线程池

::: info 目录已导入 · 正文待整理
下方知识点来自你的现有笔记。后续会逐节补上讲解、真实代码和易错点。
:::

## 已有知识点

- 线程是什么
- 三种创建方式
- 常用线程 API
- 线程安全：共享账户取款
- 同步代码块与锁对象
- 同步方法
- `Lock`：显式上锁与解锁
- 线程池：复用线程执行任务
- 综合练习：100 人抢 200 个红包
- 本次排错与小结

## 原始笔记

来源：`notes/16线程.md`。

[下载现有笔记](/notes/threads.md){download}

## 对应源码

以下路径相对于你的 `D:\JavaCode` 项目。这里只展示位置，后续整理时再把具体代码嵌入知识点。

### 16-thread

- `src/com/ranan/demo1create/`
- `src/com/ranan/demo2threadapi/`
- `src/com/ranan/demo3threadsafe/`
- `src/com/ranan/demo4synchronized_code/`
- `src/com/ranan/demo5synchronized_method/`
- `src/com/ranan/demo6lock/`
- `src/com/ranan/demo7executorService/`
- `src/com/ranan/demo8test/`

[返回IO 与并发网络](/parts/systems) · [返回总目录](/)
