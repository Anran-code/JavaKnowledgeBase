---
title: 方法重载
description: 同一个方法名，接受不同的参数；调用时由编译器选择匹配的版本。
---
<ReadingTools />

# 方法重载

同一个方法名，接受不同的参数；调用时由编译器选择匹配的版本。


## 你的重载示例

<SourceCode id="overload" />

两次调用名称都是 `printVariable`，但参数一个是 int，一个是 String，因此选择不同的方法。

```text
printVariable(12)     → printVariable(int num)
printVariable("qwe")  → printVariable(String str)
```

## 什么才算不同的参数列表？

| 变化 | 能否构成重载 |
| --- | --- |
| 参数数量不同 | 可以 |
| 参数类型不同 | 可以 |
| 不同类型参数的顺序不同 | 可以 |
| 只有参数名字不同 | 不可以 |
| 只有返回值不同 | 不可以 |
| 只有 static 或访问修饰符不同 | 不可以 |

```java
void show(int value) {}
void show(String value) {}
void show(int value, String text) {}
void show(String text, int value) {}
```

## 为什么不能只靠返回类型区分？

调用方法时可以忽略返回值。如果你只写 `add(1, 2);`，编译器不能靠“结果要赋给什么变量”来确定同签名的两个版本。

## 自动转换与歧义

没有完全匹配的版本时，编译器可能通过扩大转换选择方法。例如只有 `show(long n)`，传入 int 的 10 也可以。

但如果定义了 `show(String s)` 和 `show(Integer n)`，调用 `show(null)` 就存在歧义：null 可以匹配两个没有继承关系的引用类型。

## 重载不是重写

**overload（重载）**关注参数列表。**override（重写）**关注子类对继承方法的重新实现，后面学继承时再展开。reload 的意思是重新加载，不是重载。


---

本节依据：`notes/01基础.md` 与页面标注的原始练习。完整原笔记可在[整理说明](/about)中下载。
