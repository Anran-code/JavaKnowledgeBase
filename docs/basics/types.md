---
title: 变量与基本类型
description: 先记住常用类型，再理解 Java 与 C++ 在类型上的几个差别。
---
<ReadingTools />

# 变量与基本类型

先记住常用类型，再理解 Java 与 C++ 在类型上的几个差别。


## 八种基本数据类型

| 分类 | 类型 | 位数 | 示例 |
| --- | --- | --- | --- |
| 整数 | byte / short / int / long | 8 / 16 / 32 / 64 | `int age = 18;` |
| 浮点数 | float / double | 32 / 64 | `double score = 95.5;` |
| 字符 | char | 16 | `char letter = 'A';` |
| 布尔 | boolean | 不在这里指定存储位数 | `boolean ready = true;` |

整数常用 int，小数常用 double。long 字面量可以加 `L`，float 字面量需要使用 `F` 才能避免把 double 直接赋给 float：

```java
long count = 10000000000L;
float ratio = 0.5F;
double price = 12.5;
```

## 你的类型转换练习

<SourceCode id="types" />

`byte a = 12` 声明一个小范围整数。把它传给参数为 int、double 的方法时，Java 会进行自动转换。下一节详细追踪这个过程。

## String 不是基本类型

```java
char letter = 'A';      // 单个 UTF-16 代码单元
String word = "Java";   // 引用类型
```

char 使用单引号，String 使用双引号。一个 char 并不保证能容纳任意完整 Unicode 字符，例如一些 emoji 需要两个 UTF-16 代码单元。

## 与 C++ 不同的地方

- boolean 只能取 true 或 false，不能直接赋值 0、1，也不能写 `if (1)`。
- Java 的整数类型位宽固定，不随平台把 int 改成另一种位数。
- 局部变量必须在读取前确定已经赋值；不要把数组元素或成员变量的默认初始化规则套到局部变量上。

```java
int age;
// System.out.println(age); // 编译错误：局部变量尚未赋值
age = 18;
System.out.println(age);
```

## 易错点：小数并不总是精确

float 和 double 使用二进制浮点表示，很多十进制小数无法精确表示。先理解这种误差，涉及金额的精确计算时，再学习适合的表示方式。


---

本节依据：`notes/01基础.md` 与页面标注的原始练习。完整原笔记可在[整理说明](/about)中下载。
