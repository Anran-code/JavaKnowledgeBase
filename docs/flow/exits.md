---
title: break、continue 与 return
description: 结束循环、跳过本轮、结束方法
prev:
  text: 嵌套循环：行与列
  link: /flow/nested
next:
  text: 简易计算器复盘
  link: /flow/calculator
---
<ReadingTools chapter="程序流程控制" chapterLink="/flow/" />

# break、continue 与 return

结束循环、跳过本轮、结束方法。

## 三种退出范围

| 语句 | 作用 | 放在嵌套循环中 |
| --- | --- | --- |
| break | 结束最近一层循环或 switch | 默认只结束最近一层 |
| continue | 跳过本轮剩余代码 | 默认只影响最近一层循环 |
| return | 结束当前方法 | 方法中的所有循环都随之结束 |

这里讨论不带标签的 break 和 continue。

```java
for (int i = 1; i <= 5; i++) {
    if (i == 2) continue;
    if (i == 4) break;
    System.out.println(i);
}
// 输出 1、3
```

for 遇到 continue 后仍会执行更新部分，再判断条件；while 遇到 continue 会直接回到条件判断。如果 while 的计数更新写在 continue 后面，可能被跳过而形成死循环。

## 对照你的练习

- 验证码的输入循环：长度合法后 break，离开循环再返回 len。
- 素数输出：偶数时 continue，跳过该数字的后续判断。
- 猜数字：猜对后 return round，整个猜测方法结束。
- 计算器：`System.exit(1)` 结束的是 JVM 进程，不只是一个循环或方法。

## while(true) 不一定是错误

它表示不在循环条件里限制次数。只要循环体有符合需求的退出路径，就可以用来读取输入、反复显示菜单。例如“输入有效后 return”可以明确表达重试逻辑。

## 自测

<details><summary>循环里包含 switch，switch 的 break 会结束循环吗？</summary>

不会，它结束的是最近一层 switch。随后仍继续循环的后续代码。

</details>

---
依据：`notes/02程序流程控制.md` 与 `03-flow-control` 的实际源码。[下载原笔记](/notes/flow.md){download} · [返回本章目录](/flow/)
