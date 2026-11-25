---
title: 从 Hello World 开始
description: 先找到程序从哪里开始，再看清模块、包和类的关系。
---
<ReadingTools />

# 从 Hello World 开始

先找到程序从哪里开始，再看清模块、包和类的关系。


## 一句话理解

对你当前这些传统 Java 练习，运行一个类，就是让 JVM 从选定类的 `main` 方法开始执行。

## 你的第一个 Java 程序

<SourceCode id="hello" />

这份源码来自你自己的 `01-HelloWorld` 模块。依次看这四层：

| 代码 | 在做什么 |
| --- | --- |
| `package com.ranan.obj.helloworld;` | 声明这个类属于哪个包 |
| `public class HelloWorld` | 定义类，文件名为 HelloWorld.java |
| `public static void main(String[] args)` | 本练习使用的程序入口 |
| `System.out.println("Hello World");` | 输出内容，并换行 |

## main 的几个关键词

`public` 表示公开访问；`static` 表示这个方法属于类，调用时不需要先创建对象；`void` 表示不返回结果。

`String[] args` 接收**启动程序时**传入的参数。例如传入 `abc def`，那么 `args[0]` 是 `"abc"`，`args[1]` 是 `"def"`。它与程序运行时用 Scanner 读取键盘输入不是一回事。

::: tip 从 C++ 过来
这里的 main 放在类里面；你会经常用 `System.out.println()` 输出，而不是 `cout`。
:::

## 项目、模块、包、类

```text
JavaCode                       项目
└── 01-HelloWorld               IDEA 模块
    └── src                    源码目录
        └── com/ranan/obj/helloworld
            └── HelloWorld.java
```

包主要用于组织类、区分名称。IDEA 的“模块”不等同于 Java 的 JPMS 模块系统；当前这些入门代码不需要为了运行 main 就添加 `module-info.java`。

## 一个项目能有多个 main 吗？

可以，甚至同一个包中也可以有多个带 main 的类。每次运行时，你选择其中一个入口，它再调用其他类和方法。

同一个包中的类通常可以直接用类名；不同包通常需要 import 或完整类名；跨 IDEA 模块还需要配置依赖。**import 不会自动建立模块依赖，也不能绕过 private。**

::: info 原笔记的小修订
早期 HelloWorld 示例少了输出语句末尾的分号。这里展示的实际源码已经正确；未修改你的原笔记。
:::

## 读完试着回答

在 IDEA 中运行 `Basic.main()`，会顺便执行 `HelloWorld.main()` 吗？

::: details 查看答案
不会。只有你选择的入口会启动；其他方法要在被调用时才执行。
:::


---

本节依据：`notes/01基础.md` 与页面标注的原始练习。完整原笔记可在[整理说明](/about)中下载。
