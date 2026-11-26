---
title: 简易计算器复盘
description: 字符串拆分与运算分支
prev:
  text: break、continue 与 return
  link: /flow/exits
next:
  text: 随机验证码复盘
  link: /flow/verification
---
<ReadingTools chapter="程序流程控制" chapterLink="/flow/" />

# 简易计算器复盘

字符串拆分与运算分支。

## 一条输入怎样变成结果

练习范围是两个数和一个运算符，不是带优先级的完整表达式解析器。

```text
12.5*3 → 找到下标 4 → 左侧 12.5、运算符 *、右侧 3 → calculate → 37.5
```

<SourceCode id="flow-calculator" />

`substring(0,index)` 左闭右开，不包含运算符；`substring(index+1)` 取后面的全部内容。`Double.parseDouble()` 再把子串解析成数字。

## 两个方法的分工

`getAnswerOfExpression()` 负责读取与拆分，`calculate()` 负责加减乘除。查看完整源码可见，calculate 使用 switch 和 break，最后统一返回 answer。

旧笔记使用了 throw 的示例，实际文件仍是打印提示后 `System.exit(1)`。退出整个进程适合观察这个早期练习的行为，但不等于 return 或抛异常；直接复用到 GUI 中会关闭整个程序。

## 空格与负号：先分清输入边界

`nextLine()` 能读入整行，包括空格。解析前可对左右两侧分别调用 `trim()`，显式去除首尾空白；trim 不会删除数字中间的空格。`Double.parseDouble()` 本身也允许普通的首尾空白。

当前查找规则会把第一个 `-` 当作运算符，因此 `-2+3` 的左侧为空，解析失败；`2*-3` 则可能成功，因为右侧的 `-3` 是完整数字。这里尚未统一支持带符号的表达式。

| 输入 | 当前行为 |
| --- | --- |
| 12.5*3 | 得到 37.5 |
| 12.5 * 3 | 两侧普通空白可被数字解析接受 |
| 123 | 找不到运算符，index 仍为 0，左侧空串解析失败 |
| 1+2+3 | 右侧 2+3 不能解析为一个 double |
| 1/0 | 打印提示并退出进程 |

## 这一题练到什么

遍历字符串定位符号，用 break 停止搜索，再用 switch 选择操作；把解析和计算拆成两个方法，便于分别理解。先掌握这条流程，再考虑完整的输入校验。

---
依据：`notes/02程序流程控制.md` 与 `03-flow-control` 的实际源码。[下载原笔记](/notes/flow.md){download} · [返回本章目录](/flow/)
