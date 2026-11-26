---
title: 三种循环：执行顺序
description: while、do-while 与 for
prev:
  text: switch：固定值分支
  link: /flow/switch
next:
  text: 嵌套循环：行与列
  link: /flow/nested
---
<ReadingTools chapter="程序流程控制" chapterLink="/flow/" />

# 三种循环：执行顺序

while、do-while 与 for。

## 先看三种写法的区别

| 循环 | 顺序 | 常见使用场景 |
| --- | --- | --- |
| while | 判断 → 循环体 → 再判断 | 不知道要重复多少次 |
| do-while | 循环体 → 判断 | 至少执行一次 |
| for | 初始化 → 判断 → 循环体 → 更新 → 再判断 | 用计数器控制重复 |

三者很多时候可以互相改写，选择最容易读懂的即可。

## while：直到状态达到目标

<SourceCode id="flow-while" />

这是一个按给定增长率重复计算的数学练习。每次循环更新 money，再累计 years。结束时 money 已经不小于目标；目标不是恰好相等。

完整源码中的纸张折叠练习也是同样的结构：厚度每次乘二，计数器加一。这里是理想化数值模型。

## do-while：先执行一次

<SourceCode id="flow-do" />

即使把初始 i 改成 3，也会输出一次。结尾的 `while (条件);` 必须带分号。

## for：把计数规则写到一起

<SourceCode id="flow-for" />

初始化只执行一次，之后重复“判断、循环体、更新”。i 取 0、1、2，一共三次。单独作为更新语句时，`i++` 和 `++i` 的效果相同。

循环次数由初值和条件共同决定，不能只看 `<` 或 `<=`。例如 `i=0; i<=3` 是四次，`i=1; i<=3` 才是三次。

## 自测

<details><summary>while 的条件一直不变，会怎样？</summary>

如果条件一直为 true，且没有 break、return 等退出路径，就会形成无限循环。检查循环体是否更新了影响条件的变量。

</details>

---
依据：`notes/02程序流程控制.md` 与 `03-flow-control` 的实际源码。[下载原笔记](/notes/flow.md){download} · [返回本章目录](/flow/)
