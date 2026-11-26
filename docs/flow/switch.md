---
title: switch：固定值分支
description: case、default 与穿透
prev:
  text: if：按条件选择
  link: /flow/if
next:
  text: 三种循环：执行顺序
  link: /flow/loops
---
<ReadingTools chapter="程序流程控制" chapterLink="/flow/" />

# switch：固定值分支

case、default 与穿透。

## 一句话理解

多个固定选项用 `switch`，范围和复杂条件用 `if`。这里重点掌握练习中的冒号式 switch。

<SourceCode id="flow-switch" />

`case` 提供匹配项；没有匹配项时使用 `default`。String 的 switch 按字符串内容匹配，不是用 `==` 比较引用。

## 为什么要写 break？

匹配到入口后，冒号式 switch 会继续向下执行，直到遇到 break、return 等结束语句，或 switch 结束。后面的 case 标签本身不会阻止执行。

```java
int option = 1;
switch (option) {
    case 1:
        System.out.println("A");
    case 2:
        System.out.println("B");
        break;
    default:
        System.out.println("C");
}
// 输出 A、B
```

不是“只有条件满足才执行 case 2”，而是已经从 case 1 穿透到了这里。也可以有意让多个 case 共享一段代码。

## break 与 return 的区别

`break` 结束当前 switch，随后继续执行 switch 后的代码；`return` 结束整个方法。如果 case 已经 return，通常无需再写 break。

当前练习使用冒号式语法。箭头式 `case ... ->` 不会这样穿透，后续学习时要区分两种写法。

## 自测

<details><summary>default 必须放在最后吗？</summary>

语法上不必，但放在最后更清晰。冒号式 default 也可能向后穿透，因此同样需要根据控制流程决定是否写 break。

</details>

---
依据：`notes/02程序流程控制.md` 与 `03-flow-control` 的实际源码。[下载原笔记](/notes/flow.md){download} · [返回本章目录](/flow/)
