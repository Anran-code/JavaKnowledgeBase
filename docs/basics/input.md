---
title: Scanner 键盘输入
description: 从标准输入读取内容，重点理解读取方式、输入校验和剩余换行。
---
<ReadingTools />

# Scanner 键盘输入

从标准输入读取内容，重点理解读取方式、输入校验和剩余换行。


## 创建一个 Scanner

```java
import java.util.Scanner;

Scanner sc = new Scanner(System.in);
```

Scanner 是类，System.in 是标准输入。通常让一个程序共用一个键盘输入 Scanner，再把它作为参数传给需要读取的方法。

## 你的用户名与年龄练习

<SourceCode id="scanner" />

这段循环先用 `hasNextInt()` 判断，合法时再用 `nextInt()` 取出年龄。

如果输入的是 `abc`，仅提示错误还不够：`sc.next()` 会取走错误内容，否则下一轮还会遇到同一个错误输入。

## 常用读取方法

| API | 读取内容 | 注意点 |
| --- | --- | --- |
| next() | 下一个词 | 默认按空白分隔，不适合含空格的完整姓名 |
| nextLine() | 当前行剩余文字 | 消耗行结束符，可能得到空字符串 |
| nextInt() | 一个 int | 格式不匹配时会抛异常 |
| nextDouble() | 一个 double | 与 hasNextDouble() 对应 |
| hasNextInt() | 判断下一个词能否读取为 int | 判断本身不会取走这个词 |

读取字符可以先读字符串：`sc.next().charAt(0)`。Scanner 没有 nextChar()。

## nextInt 后为什么 nextLine 读到空串？

nextInt 取走数字后，行结束符可能还留着。接下来的 nextLine 读取“这一行剩下的内容”，因而可能立即结束。

```java
int age = sc.nextInt();
sc.nextLine(); // 消耗当前行剩余内容和换行
String fullName = sc.nextLine();
```

也可以统一按行读取，再用 Integer.parseInt 等方法转换，转换失败时另做输入处理。

## 什么时候 close？

关闭基于 System.in 的 Scanner，也会关闭标准输入。不要在一个辅助方法里关闭它，却又在后面继续读键盘。让创建它的主流程在所有读取结束后统一关闭。

::: tip 再看你的代码
当前年龄练习只校验“能否解析成 int”，并不限制年龄必须大于 0。格式校验和业务范围校验是两件事；综合练习进一步检查了数值范围。
:::


---

本节依据：`notes/01基础.md` 与页面标注的原始练习。完整原笔记可在[整理说明](/about)中下载。
