---
title: 自动转换与强制转换
description: 类型转换决定数据怎样参与计算；能编译，并不代表没有精度损失。
---
<ReadingTools />

# 自动转换与强制转换

类型转换决定数据怎样参与计算；能编译，并不代表没有精度损失。


## 自动转换：按允许的方向扩大类型

常见数值类型的扩大转换方向：

```text
byte → short → int → long → float → double
       char → int → long → float → double
```

char 和 short 都占 16 位，但取值范围不同，不能因此认为可以互相自动转换。boolean 不参与这些数值转换。

<SourceCode id="types" />

你的 `cal1(1, 2, 3.2, 'a')` 中，字符 'a' 对应数值 97。表达式里出现 double，最终结果也是 double，大约为 103.2。

::: warning 扩大转换也可能损失精度
int 或 long 转成浮点类型时，虽然允许自动转换，整数精度仍可能丢失。“范围扩大”不等于“每个数都能精确表示”。
:::

## 强制转换：明确告诉编译器

```java
double number = 3.9;
int result = (int) number; // 3，不是四舍五入

int large = 130;
byte small = (byte) large; // -126，超出范围后的结果
```

小数转整数会向零截断；缩小整数类型也可能改变原来的数值。

## 字符与编码

你在 `Basic.getAsciiOfLetter(char c)` 里使用了 `(int)c`：

```java
char letter = 'A';
System.out.println((int) letter); // 65
```

对 A 这样的 ASCII 字符，这个结果与 ASCII 码一致。但这个方法也接受非 ASCII 的 char，它得到的是 UTF-16 代码单元的数值，不只限于 ASCII。

## 表达式中的类型提升

byte、short、char 参与普通整数算术时，通常先提升到 int：

```java
byte a = 10;
byte b = 20;
int sum = a + b;
// byte sum = a + b; // 不能直接把 int 结果赋给 byte
```

## 与引用类型转换分开记

原笔记还记录了 `Animal animal = new Dog()`、向下转型和 instanceof。这是对象类型关系，放到后续“面向对象”章节继续整理；不要把它理解成这里的数值截断。


---

本节依据：`notes/01基础.md` 与页面标注的原始练习。完整原笔记可在[整理说明](/about)中下载。
