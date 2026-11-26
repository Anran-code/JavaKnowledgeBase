---
title: 嵌套循环：行与列
description: 乘法表与金字塔
prev:
  text: 三种循环：执行顺序
  link: /flow/loops
next:
  text: break、continue 与 return
  link: /flow/exits
---
<ReadingTools chapter="程序流程控制" chapterLink="/flow/" />

# 嵌套循环：行与列

乘法表与金字塔。

## 外层控制行，内层处理这一行

<SourceCode id="flow-nested" />

乘法表中外层 i 从 1 到 9，内层 j 从 1 到 i。第 i 行输出 i 个算式，总次数是 `1 + 2 + ... + 9 = 45`。

`printf` 不自动换行，因此每行结束后用 `println()` 换行。`%-4d` 是整数左对齐、最少占 4 列，超过四位不会被截断。

## 金字塔先找数量规律

查看完整源码中的 `PrintPyramid(layer)`：i 从 0 开始。

| 内容 | 第 i 行的数量 | layer 为 4 时 |
| --- | --- | --- |
| 左侧空格 | layer - 1 - i | 3、2、1、0 |
| 星号 | 2 * i + 1 | 1、3、5、7 |
| 右侧空格 | layer - 1 - i | 3、2、1、0 |

```text
   *
  ***
 *****
*******
```

你的代码还打印了右侧空格；终端中通常看不出来，但它们确实存在。左侧空格决定图形的缩进。

## 别看到两层循环就直接数 n²

次数要看每层的边界。方阵 n 行、每行 n 次，是 n²；乘法表的内层随行号增长，是 n(n+1)/2。两者随 n 增长都属于 O(n²)，实际执行次数并不相同。

## 自测

<details><summary>为什么换行放在内层循环外面？</summary>

要在这一整行都输出后再换行。放到内层会让每个算式或星号独占一行。

</details>

---
依据：`notes/02程序流程控制.md` 与 `03-flow-control` 的实际源码。[下载原笔记](/notes/flow.md){download} · [返回本章目录](/flow/)
