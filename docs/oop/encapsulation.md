---
title: 封装与数据校验
description: private、getter、setter 的职责
prev:
  text: 构造方法与 this
  link: /oop/constructors
next:
  text: 静态成员与实例成员
  link: /oop/static
---
<ReadingTools chapter="面向对象" chapterLink="/oop/" />

# 封装与数据校验

封装让外部通过规定的方法操作对象，数据校验可以集中在这些方法里。

## 你的年龄和成绩校验

<SourceCode id="oop-encapsulation" />
<SourceCode id="oop-encapsulation-test" />

`age`、`grade` 是私有字段，外部不能直接赋值，必须经过 `setAge()` 和 `setGrade()`。年龄不能小于 0，成绩必须在 0～100 之间。

```java
Student s = new Student("小明");
s.setAge(20);
s.setAge(-1);                  // 打印“输入有误”，不修改原年龄
System.out.println(s.getAge()); // 仍然是 20
```

若第一次就传入非法年龄，字段仍保持默认值 0。当前 setter 只打印提示，没有返回成功与否，也没有抛出异常。

## getter 和 setter 不是必须成对生成

| 方法 | 职责 |
| --- | --- |
| getter，如 `getAge()` | 提供读取入口 |
| setter，如 `setAge(int age)` | 提供修改入口，可以增加校验 |
| 业务方法，如 `addMovie()` | 表达一次有意义的操作，管理内部状态 |

并不是每个字段都必须公开修改入口。只允许读取的数据可以只提供 getter；不需要外部知道的数据，也可以不提供 getter。

## 看清当前封装到什么程度

这个 `Student` 的 `name` 仍是 `public`，只有年龄和成绩受上述方法控制。`Movie` 的三个字段都是 `private`，但其 setter 目前只是直接赋值，并没有验证价格、编号是否合法。

所以 `private` 提供访问限制，校验规则仍要写在方法里。把字段改成私有，再生成无条件赋值的 setter，不会自动得到业务校验。

<details><summary>为什么不在每个调用处都检查年龄？</summary>

把规则放到统一入口可以减少重复和遗漏。以后改变校验条件时，调用者仍然使用同一个方法。

</details>

---
依据：`notes/03面向对象.md` 与 `05-oop` 实际源码。[下载原笔记](/notes/objects.md){download} · [返回本章目录](/oop/)
