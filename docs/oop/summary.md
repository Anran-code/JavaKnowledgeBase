---
title: 本章总结与自测
description: 从一段流程，到几个协作的对象
prev:
  text: 电影管理练习复盘
  link: /oop/movie-system
next:
  text: 下一章：高级面向对象
  link: /chapters/advanced-oop
---
<ReadingTools chapter="面向对象" chapterLink="/oop/" />

# 本章总结与自测

这一章把“数据与操作分散在入口里”逐步整理成“对象保存状态，方法提供操作”。后面的继承、抽象类和接口，会在此基础上继续组织类型之间的关系。

## 知识点横向比较

| 知识点 | 要解决的问题 | 你的代码 |
| --- | --- | --- |
| 类与对象 | 描述同一类事物，创建不同实例 | `Star`、`Student` |
| 构造方法 | 创建对象时准备初始数据 | `new Student("小明")` |
| `this` | 指明当前对象，区分同名参数 | `love(String name)` |
| 封装 | 控制数据修改入口 | 年龄、成绩校验 |
| 静态成员 | 在类的范围共享数据 | `Student.number` |
| 对象数组 | 管理多条同类型数据 | `Movie[]` |
| 方法重载 | 为同一个操作提供不同参数入口 | 两个 `addMovie()` |
| 职责拆分 | 分开数据、操作和测试入口 | `Movie`、`MovieSystem`、`Practice` |

## 容易混淆的四组区别

- **类与对象**：类是类型定义，new 创建该类型的实例。
- **构造方法与普通方法**：前者参与对象初始化且无返回值类型；后者要写返回值类型，由调用者调用。
- **实例字段与静态字段**：一个按对象分别保存，一个由同一个类共享。
- **数组容量与元素数量**：有 5 个槽位不代表已经有 5 个对象。

## 合上笔记试一试

<details><summary>1. `Movie b = a` 后修改 b 的价格，a 读到的价格会变吗？</summary>

如果 a 原本引用一个 Movie 对象，会变。这里复制了引用，a 和 b 指向同一个对象。

</details>

<details><summary>2. 有 `Student(String name)`，还能直接 `new Student()` 吗？</summary>

只有显式声明了可访问的无参构造方法才可以。编译器不会再自动补默认构造方法。

</details>

<details><summary>3. `Student.number` 变成 2，是否表示现在一定还有两个对象存活？</summary>

不是。这个练习的计数只在构造时加 1，没有跟踪对象是否还在使用。

</details>

<details><summary>4. 为什么电影查找的“未找到”放在循环外？</summary>

一个元素不匹配只说明该元素不是目标；遍历完所有有效元素仍没有匹配，才能判定没找到。循环外的提示还覆盖空系统。

</details>

## 下一章会接上什么？

[高级面向对象](/chapters/advanced-oop)会继续整理继承、重写等内容；接口与多态在后续章节展开。本章先把对象、引用和实例成员理解扎实。

---
依据：`notes/03面向对象.md` 与 `05-oop` 实际源码。[下载原笔记](/notes/objects.md){download} · [返回本章目录](/oop/)
