---
title: 猜数字复盘
description: 固定目标、重复输入与轮数
prev:
  text: 随机验证码复盘
  link: /flow/verification
next:
  text: 素数输出复盘
  link: /flow/primes
---
<ReadingTools chapter="程序流程控制" chapterLink="/flow/" />

# 猜数字复盘

固定目标、重复输入与轮数。

## 先生成答案，再开始猜

main 中只调用一次 `getRandomNum()`，把目标传入 `guessNum(sc,num)`。每轮只改变猜测值，答案保持不变。

`(int)(Math.random()*100)+1` 的范围是 1～100，包括两端。

<SourceCode id="flow-guess" />

## 每轮的执行路径

```text
轮数加一 → 判断输入是否为整数 → 读取整数
                             → 相等：return round
                             → 范围内较小／较大：给出提示
                             → 范围外：提示输入不合法
           非整数：取走错误内容并提示 → 进入下一轮
```

`return round` 同时完成两件事：结束猜测过程，把累计轮数交回 main。

## 轮数到底统计什么？

当前 round++ 在每轮开头，因此输入字母、0 或 101 也会计入轮数。它统计的是尝试次数。如果题目要求“有效猜测次数”，应在整数与范围校验通过后再计数；这两种口径要区分。

## 自测

<details><summary>假设答案为 50，输入 abc、0、50，返回几轮？</summary>

当前代码返回 3。前两次输入虽然不合法，也已经执行 round++。

</details>

---
依据：`notes/02程序流程控制.md` 与 `03-flow-control` 的实际源码。[下载原笔记](/notes/flow.md){download} · [返回本章目录](/flow/)
