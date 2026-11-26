---
title: 类与对象
description: 从 Star 和 Student 理解属性、行为与对象引用
prev:
  text: 本章导读
  link: /oop/
next:
  text: 构造方法与 this
  link: /oop/constructors
---
<ReadingTools chapter="面向对象" chapterLink="/oop/" />

# 类与对象

类描述一种事物有哪些数据、能做什么；对象是按照这个类创建的具体实例。

## 从你的 Star 开始

<SourceCode id="oop-star" />
<SourceCode id="oop-star-test" />

`Star` 是类型，`new Star()` 创建对象，`s1` 是保存对象引用的变量。`s1.name` 访问这个对象的成员变量；`s1.age = 20` 修改的是这一个对象的数据。

当前源码的 `Star` 只有属性，没有 `sing()`。旧笔记中的 `sing()` 是讲解用的扩展示例；真实的成员方法可以看下一节的 `Student.getAllScore()`。

## 两次 new 与一次引用赋值

下面是补充示例，放在与 `Star` 相同的包中：

```java
Star a = new Star();
Star b = new Star();
a.name = "安染";
b.name = "小明";     // 两个对象，互不影响

Star c = a;         // 复制引用，没有创建第三个对象
c.name = "小染";
System.out.println(a.name); // 小染
```

与 C++ 对比：Java 的 `Star c = a` 不会把对象的成员逐个复制成一个新对象。`a` 和 `c` 指向同一个对象，通过任意一个引用修改它，都能从另一个引用看到。

## 成员变量的默认值

| 类型 | 没有显式赋值时的默认值 |
| --- | --- |
| 整数类型 | `0` |
| 浮点类型 | `0.0` |
| `boolean` | `false` |
| `char` | `'\u0000'`，不是空格 |
| 引用类型，如 `String`、`Double` | `null` |

这是成员变量的规则；方法里的局部变量必须在使用前明确赋值。`null` 表示没有引用对象，对它调用实例方法或访问实例字段会抛出空指针异常。

<details><summary>想一想：把 c 改为 null，a 还指向原来的对象吗？</summary>

还在。`c = null` 只是修改 c 保存的引用，不会同步改变 a，也不会清空原对象的数据。

</details>

---
依据：`notes/03面向对象.md` 与 `05-oop` 实际源码。[下载原笔记](/notes/objects.md){download} · [返回本章目录](/oop/)
