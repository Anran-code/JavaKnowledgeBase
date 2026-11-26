---
title: 随机验证码复盘
description: 输入校验、字符映射与拼接
prev:
  text: 简易计算器复盘
  link: /flow/calculator
next:
  text: 猜数字复盘
  link: /flow/guess
---
<ReadingTools chapter="程序流程控制" chapterLink="/flow/" />

# 随机验证码复盘

输入校验、字符映射与拼接。

## 从随机下标到字符

<SourceCode id="flow-verification" />

`(int)(Math.random()*62)` 得到 0～61，映射到 10 个数字、26 个大写字母与 26 个小写字母。

| 下标 | 字符 | 原代码的计算 |
| --- | --- | --- |
| 0～9 | 0～9 | (char)(48 + i) |
| 10～35 | A～Z | (char)(55 + i) |
| 36～61 | a～z | (char)(61 + i) |

例如下标 10 对应 65，也就是字符 A。也可写成 `(char)('A' + i - 10)`，更容易看出区间起点。

## 为什么还有最后一个分支？

调用方生成的下标在 0～61 内，但方法参数是 int，其他调用者仍能传入 62。当前实现对区间外值返回空格。每条执行路径都必须能返回 char，否则不能保证方法返回值完整。

这也对应你之前问的“局部变量 c 可能没有赋值”：编译器不会因为你打算只传合法值，就假定其他分支不存在。

## 长度输入与 StringBuilder

完整源码的 `getLength()` 用 while(true) 重试：先 hasNextInt，再读取并检查大于 0。遇到不是整数的输入，调用 `sc.next()` 取走它，避免下次仍检查同一内容。

`getVerificationCode()` 循环 len 次，每次 `append()` 一个字符，最后 `toString()` 返回字符串。每次追加前都会重新取随机数；把随机数放到循环外，会重复同一个字符。

这是普通随机数与流程控制练习，真实安全验证码还需要其他安全机制。

## 自测

<details><summary>怎么检查三个区间有没有接错？</summary>

测试 0、9、10、35、36、61，应依次得到 0、9、A、Z、a、z；再测试一个区间外值，确认当前的兜底行为。

</details>

---
依据：`notes/02程序流程控制.md` 与 `03-flow-control` 的实际源码。[下载原笔记](/notes/flow.md){download} · [返回本章目录](/flow/)
