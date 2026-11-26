---
title: 对象数组与扩容
description: 区分容量、数量和引用复制
prev:
  text: 静态成员与实例成员
  link: /oop/static
next:
  text: 电影管理练习复盘
  link: /oop/movie-system
---
<ReadingTools chapter="面向对象" chapterLink="/oop/" />

# 对象数组与扩容

对象数组存放的是对象引用。数组长度与实际存入的对象数量，需要分别记录。

## new Movie[5] 创建了什么？

```java
Movie[] movies = new Movie[5];
movies[0] = new Movie(10101, "Oppenheimer", 100);
```

第一行只创建一个长度为 5 的数组，五个元素初始都为 `null`，没有创建五部电影。第二行才创建一个电影对象，并把它的引用放进第一个位置。

## 容量 size 与数量 index

<SourceCode id="oop-movie-system" />

| 状态 | `size` | `index` | 有效下标 |
| --- | --- | --- | --- |
| 创建容量 5 的系统 | 5 | 0 | 无 |
| 添加 3 部电影后 | 5 | 3 | 0～2 |
| 添加 5 部电影后 | 5 | 5 | 0～4 |
| 扩容到 6 后 | 6 | 5 | 仍是 0～4 |

`movies[index++] = movie` 先把引用存到当前 index 位置，再让 index 加 1。所以 index 同时表示电影数量和下一次插入位置；满容量时必须先拦截，否则会越界。

当前代码遍历到 `Math.min(index, size)`，避免遍历空槽位。在正常保持 `0 <= index <= size` 的前提下，它等价于遍历到 index。这里也假设没有往有效区间添加 null。

## 扩容为什么要换数组？

`renewSize()` 的过程是：申请更长的新数组 → 复制已存引用 → 让 movies 指向新数组 → 更新 size。原来的数组长度没有改变。

```java
Movie[] newMovies = new Movie[newSize];
for (int i = 0; i < index; i++) {
    newMovies[i] = movies[i];
}
movies = newMovies;
```

这里复制的是引用，没有复制出新的电影对象。若外部还持有某部电影的引用，通过 setter 改了它，系统里读到的也是修改后的数据。

`renewSize()` 只允许更大的容量，拒绝相等或更小的值。容量满时 `addMovie()` 会拒绝添加，不会自动扩容；被拒绝的那次添加也不会在扩容后自动重试。

---
依据：`notes/03面向对象.md` 与 `05-oop` 实际源码。[下载原笔记](/notes/objects.md){download} · [返回本章目录](/oop/)
