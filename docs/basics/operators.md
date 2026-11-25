---
title: 异或与格式化输出
description: 把容易混淆的几个符号和输出格式放在一起速查。
---
<ReadingTools />

# 异或与格式化输出

把容易混淆的几个符号和输出格式放在一起速查。


## ^ 是异或，不是乘方

```text
5 = 0101
3 = 0011
---------
    0110 = 6
```

```java
System.out.println(5 ^ 3);      // 6
System.out.println(2 ^ 3);      // 1，不是 8
System.out.println(Math.pow(2, 3)); // 8.0
```

整数按位异或的规则是：相同为 0，不同为 1。常见规律包括 `a ^ a == 0`、`a ^ 0 == a`。

## boolean 也能使用异或

两个布尔值不同时，异或结果为 true：

| a | b | a ^ b |
| --- | --- | --- |
| false | false | false |
| false | true | true |
| true | false | true |
| true | true | false |

`^` 两侧都会求值，不像 `&&`、`||` 那样具有短路效果。

## printf 格式速查

| 格式 | 用途 |
| --- | --- |
| %d | 整数 |
| %f / %.2f | 小数 / 显示两位小数 |
| %s | 字符串 |
| %c | 字符 |
| %b | 布尔形式 |
| %n | 平台换行符 |
| %8.2f | 最小宽度 8，保留两位小数 |
| %-10s | 最小宽度 10，左对齐 |

```java
System.out.printf("|%-10s|%8.2f|%n", "Score", 95.5);
```

输出：

```text
|Score     |   95.50|
```

宽度是最小宽度，不足时补空格；内容较长时不会自动截断。中文字符在终端里的视觉宽度，还可能和英文字符不同。

## 字符串比较用 equals

```java
String name = "Java";
System.out.println("Java".equals(name)); // 比较内容
```

对于引用类型，`==` 判断是否指向同一个对象，不是普遍意义上的文字内容比较。把固定字符串写在 equals 前面，可以避免 name 为 null 时对它调用方法。


---

本节依据：`notes/01基础.md` 与页面标注的原始练习。完整原笔记可在[整理说明](/about)中下载。
