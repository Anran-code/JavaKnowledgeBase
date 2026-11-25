---
title: 数组与二维数组
description: 用固定长度的一组位置保存同类型数据，再通过下标访问。
---
<ReadingTools />

# 数组与二维数组

用固定长度的一组位置保存同类型数据，再通过下标访问。


## 创建、默认值与下标

```java
int[] numbers = {10, 20, 30};
double[] grades = new double[8];
String[] names = new String[3];

System.out.println(numbers[0]); // 10
System.out.println(grades[0]);  // 0.0
System.out.println(names[0]);   // null
```

数组长度创建后固定，合法下标是 0 到 length - 1。`length` 是数组的属性，不是 `length()` 方法。

## 你的成绩统计练习

<SourceCode id="array" />

`getAverage()` 先累加全部成绩，再除以数组长度。当前练习创建了长度为 8 的数组，所以不会遇到空数组除法。

`getMax()` 从第一个元素初始化最大值，再逐一比较。这个方法要求数组非空；如果以后把它做成通用工具，就需要处理空数组。

## 数组作为方法参数

`getInput(grades, sc)` 接收到引用值的副本，但这个引用仍指向同一个数组对象。方法里给 `grades[i]` 赋值，主流程之后就能看到新元素。

## 二维数组是数组的数组

<SourceCode id="array2d" />

`names.length` 表示外层数组长度，`names[i].length` 表示第 i 个内部数组长度。Java 的二维数组各行可以不等长，不要在遍历中假定每行都有相同列数。

## 扑克牌：用下标连续填充

<SourceCode id="poker" />

13 种点数乘 4 种花色得到 52 张牌，再补入两张王牌。`pokers[index++]` 先使用当前下标，随后下标加一。

练习里的洗牌方式是随机交换两个位置，适合熟悉数组操作；它不是严格均匀随机洗牌算法的证明。

## 一个值得保留的易错案例

<SourceCode id="puzzle" />

你原笔记已经写了“随机坐标应使用 n”，但当前 `HuaRongRoadDemo.java` 源码仍写着 `Math.random() * 5`。

当 n 小于 5 时可能越界；当 n 大于 5 时又只能随机到前 5 行、前 5 列。这里把差异明确记下来，**没有修改你的源文件**。以后完善练习时，应把四个随机坐标的范围统一改成 n。

## 常见错误速查

| 现象 | 检查位置 |
| --- | --- |
| ArrayIndexOutOfBoundsException | 是否用了 i ≤ arr.length |
| 数组长度不能直接增加 | 创建更大数组再复制，或以后使用 ArrayList |
| 最大值方法在空数组报错 | 是否直接访问了 arr[0] |
| 各行长度不同导致越界 | 内层循环是否用了 arr[i].length |


---

本节依据：`notes/01基础.md` 与页面标注的原始练习。完整原笔记可在[整理说明](/about)中下载。
