---
title: 电影管理练习复盘
description: 串起建模、重载、遍历与查找
prev:
  text: 对象数组与扩容
  link: /oop/object-arrays
next:
  text: 本章总结与自测
  link: /oop/summary
---
<ReadingTools chapter="面向对象" chapterLink="/oop/" />

# 电影管理练习复盘

这个练习将电影数据、管理操作和运行入口拆成三个类，是把已有语法组合起来的一次实践。

## 三个类如何合作

| 类 | 负责的事情 |
| --- | --- |
| `Movie` | 保存一部电影的 id、name、price |
| `MovieSystem` | 持有 Movie 数组，负责添加、展示、扩容与查询 |
| `Practice` | 创建系统，准备电影并调用操作 |

<SourceCode id="oop-movie" />
<SourceCode id="oop-practice" />

## 两种添加方式，共用一套逻辑

`addMovie(Movie movie)` 接收现成对象；`addMovie(int id, String name, double price)` 先创建 Movie，再调用前一个方法。

这样既演示了方法重载，也避免把容量判断和数组写入重复写两遍。重载依据参数列表区分，不是只看返回类型。

## 跟着 Practice 看一次运行

系统初始容量是 5，前五次添加成功。随后两次添加 `movie3`、`movie4` 因满容量被拒绝。扩容到 6 后，再加入编号 10301 的电影，最终存有 6 部电影。尝试缩小到 3 会被拒绝。

`getAllMovies()` 用 getter 读取字段，并通过 `printf` 对齐输出：`%-8d` 为左对齐、最小宽度 8 的整数；`%-20s` 为左对齐字符串；`%-10.2f` 保留两位小数。宽度是最小值，不会截断较长文本。

## 查找：第一项不匹配，不能代表全部不存在

<SourceCode id="oop-movie-search" />

当前 `findById()` 的 else 在循环里面，而且立即 return。这意味着：

- 查第一部电影 10101：能找到。
- 查第二部电影 10102：第一部不匹配就返回，错误地报告没找到。
- 空系统中查询：循环不执行，也没有提示。

原来的 Practice 只查询第一部和不存在的编号，恰好没有覆盖“存在于后面”的情况。下面是修订示例，原文件仍保留原始写法：

```java
public void findById(int id) {
    for (int i = 0; i < index; i++) {
        if (id == movies[i].getId()) {
            System.out.printf("查找到：%d %s %.2f%n",
                    movies[i].getId(), movies[i].getName(), movies[i].getPrice());
            return;
        }
    }
    System.out.println("未查找到 id：" + id);
}
```

找到目标可以立即结束；判定“不存在”必须等整个有效区间都检查完。这个规律同样适用于以后按用户名查用户、按员工编号查职员。

## 怎么验证一次查找？

至少覆盖第一项、中间项、最后一项、不存在的编号，以及空系统。它们可以帮助发现循环边界和提前 return 的问题。

---
依据：`notes/03面向对象.md` 与 `05-oop` 实际源码。[下载原笔记](/notes/objects.md){download} · [返回本章目录](/oop/)
