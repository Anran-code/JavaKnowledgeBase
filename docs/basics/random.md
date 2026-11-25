---
title: Math 与随机数
description: 从随机数的范围开始，读懂你写的数字验证码。
---
<ReadingTools />

# Math 与随机数

从随机数的范围开始，读懂你写的数字验证码。


## 你的验证码方法

<SourceCode id="random" />

`Math.random()` 的范围是 **[0.0, 1.0)**。乘 10 后是 [0.0, 10.0)，再转成 int，就得到 0～9。

在循环中把每一位拼进 String，最终能保留开头的 0。若用整数保存整段验证码，前导 0 就无法表达。

## 为什么不能先强转？

```java
int a = (int) (Math.random() * 10); // 0～9
int b = (int) Math.random() * 10;   // 永远为 0
```

第二种写法先把一个小于 1 的非负小数截成 0，随后再乘 10。

## 自定义整数范围

练习中生成闭区间 [min, max] 的随机整数，可以写：

```java
int min = 3;
int max = 8;
int number = (int) (Math.random() * (max - min + 1)) + min;
```

前提是 min ≤ max，且这里的范围计算没有发生整数溢出。普通练习适用；真实安全验证码需要专门的安全随机数设计。

## 常用 Math API

| API | 含义 | 例子 |
| --- | --- | --- |
| abs | 绝对值 | Math.abs(-10) → 10 |
| max / min | 较大值 / 较小值 | Math.max(3, 8) → 8 |
| pow | 幂 | Math.pow(2, 3) → 8.0 |
| sqrt | 平方根 | Math.sqrt(16) → 4.0 |
| ceil | 向正无穷方向取整 | Math.ceil(3.2) → 4.0 |
| floor | 向负无穷方向取整 | Math.floor(3.8) → 3.0 |
| round | 取最接近的整数，中点向正无穷方向 | Math.round(3.5) → 4 |

Math 在 java.lang 中，无需手动 import。常用方法是静态方法，可直接用类名调用。

::: details 小检查：Math.floor(-3.2) 和 (int)-3.2 一样吗？
不一样。floor 得到 -4.0；强制转 int 向零截断，得到 -3。
:::


---

本节依据：`notes/01基础.md` 与页面标注的原始练习。完整原笔记可在[整理说明](/about)中下载。
