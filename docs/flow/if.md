---
title: if：按条件选择
description: 范围判断、短路与边界
prev:
  text: 本章导读
  link: /flow/
next:
  text: switch：固定值分支
  link: /flow/switch
---
<ReadingTools chapter="程序流程控制" chapterLink="/flow/" />

# if：按条件选择

范围判断、短路与边界。

## 一句话理解

`if` 根据一个 boolean 条件选择执行路径；`else if` 从上到下判断，命中一个分支后不再检查后续分支。

```java
int score = 85;
if (score >= 90) {
    System.out.println("优秀");
} else if (score >= 60) {
    System.out.println("通过");
} else {
    System.out.println("继续练习");
}
```

Java 与 C++ 的区别：不能把整数当条件写成 `if (1)`，必须是 boolean 表达式。多个独立的 `if` 可以执行多段代码；一条 `if / else if / else` 链最多执行一段。

## 对照你的分支练习

<SourceCode id="flow-if" />

这里只分析控制流程。当前源码中 `23.9 <= bmi < 24.0`、`27.9 <= bmi < 28.0` 没有对应分支，会落入最后的 `else`。原笔记已讨论连续边界，实际源码仍保留旧写法。

写区间判断时，先把所有端点列出来，再逐一测试“略小于、等于、略大于”。若按从小到大的顺序比较上限，前面失败的条件已经限定了后面分支的下限。

## 条件组合与短路

| 运算符 | 含义 | 短路规则 |
| --- | --- | --- |
| `&&` | 并且 | 左边为 false，不计算右边 |
| `\|\|` | 或者 | 左边为 true，不计算右边 |
| `!` | 取反 | true 与 false 互换 |

```java
String name = null;
if (name != null && !name.isEmpty()) {
    System.out.println(name);
}
```

先检查 null，后调用方法，顺序很重要。`==` 是比较，`=` 是赋值。

## 自测

为什么上面的分数判断把 `score >= 60` 放在前面，就可能永远进不了“优秀”分支？

<details><summary>查看答案</summary>

90 分以上也满足大于等于 60。前面的分支命中后，后面不会再判断。

</details>

---
依据：`notes/02程序流程控制.md` 与 `03-flow-control` 的实际源码。[下载原笔记](/notes/flow.md){download} · [返回本章目录](/flow/)
