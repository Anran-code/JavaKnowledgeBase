---
title: 方法与 static
description: 把一个任务拆成可以调用的方法，分清参数、返回值以及调用对象。
---
<ReadingTools />

# 方法与 static

把一个任务拆成可以调用的方法，分清参数、返回值以及调用对象。


## 一个方法的组成

```java
public static int add(int a, int b) {
    return a + b;
}
```

这里的 `int` 是返回类型，`a` 和 `b` 是形参，return 把计算结果交给调用者。没有返回值时写 void。

::: info 原笔记的小修订
早期笔记中的 `public static add(...)` 少了返回类型。普通方法必须声明返回类型；构造方法是另一套规则。
:::

## 你的两种方法

<SourceCode id="basic" />

你的源码里：

- `add(int a, int b)` 没有 static，是实例方法。
- `muti(double a, double b)` 带 static，是静态方法。

源码中的方法名保留为你当时写的 `muti`，知识库不会为了展示而改写原文件。

## 两种调用方式

```java
Basic calculator = new Basic();
int sum = calculator.add(1, 2); // 先有对象，再调实例方法

double product = Basic.muti(1.2, 2.4); // 通过类调用静态方法
```

在同一个类的静态方法中，可以直接写 `muti(1.2, 2.4)`。但不能因为名字在同一个类里，就直接调用需要对象的实例方法。

## 参数传递

Java 总是按值传递。对于 int 等基本类型，传递数值副本；对于数组或其他对象，传递的是引用值的副本。

```java
static void change(int[] numbers) {
    numbers[0] = 99; // 修改同一个数组对象里的元素
}
```

这是方法能修改数组元素的原因。不是 Java 引入了 C++ 的引用参数语法。

## 用 return 把职责拆开

“计算”和“打印”可以拆成两个动作：方法返回计算结果，调用方决定怎么显示。你后面的综合练习会用到这种方式。

::: details 思考：add 改成 static 后还必须 new Basic() 吗？
不必。它就可以通过 `Basic.add(1, 2)` 调用。不过是否用 static，应根据方法是否依赖某个对象的状态来决定。
:::


---

本节依据：`notes/01基础.md` 与页面标注的原始练习。完整原笔记可在[整理说明](/about)中下载。
