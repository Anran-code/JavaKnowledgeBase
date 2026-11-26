---
title: 静态成员与实例成员
description: 共享的 name 和 number，各自的 age
prev:
  text: 封装与数据校验
  link: /oop/encapsulation
next:
  text: 对象数组与扩容
  link: /oop/object-arrays
---
<ReadingTools chapter="面向对象" chapterLink="/oop/" />

# 静态成员与实例成员

实例成员属于每一个对象；静态成员属于类，由这个类的对象共享。

## 这段程序输出什么？

<SourceCode id="oop-static-student" />
<SourceCode id="oop-static-test" />

```text
LiPing
2
```

`Student.name`、`s1.name`、`s2.name` 访问的是同一个静态字段，三次赋值依次覆盖它，最后是 `LiPing`。通过对象引用访问静态字段虽能编译，但推荐统一写 `Student.name`，明确它属于类。

每次执行 `new Student()` 都会进入构造方法，使共享的 `number` 加 1；两个对象创建后为 2。这个计数表示创建过多少次，不会在对象不再使用时自动减少。

## 哪些应该共享？

| 对比 | 实例成员 | 静态成员 |
| --- | --- | --- |
| 声明 | 不加 `static` | 加 `static` |
| 数据归属 | 每个对象分别保存 | 同一个类共享 |
| 访问习惯 | `对象.成员` | `类名.成员` |
| 本例 | `age` | `name`、`number` |
| 常见用途 | 每个学生的年龄、姓名 | 计数、常量、工具方法 |

这个练习把 `name` 写成 static 是为了演示共享效果。如果表达真实学生的姓名，一般应使用实例字段，否则一个学生改名就会影响所有学生看到的姓名。

## static 方法为什么不能直接用 this？

静态方法可以在没有创建对象时调用，没有确定的“当前对象”，所以不能用 `this`，也不能直接访问实例成员。它可以通过明确的对象引用访问实例成员：

```java
public static void main(String[] args) {
    Student s = new Student();
    s.age = 20; // 在同包的 Test 中，明确操作 s 的实例字段
}
```

反过来，实例方法既可以操作当前对象的实例成员，也可以访问本类的静态成员。

---
依据：`notes/03面向对象.md` 与 `05-oop` 实际源码。[下载原笔记](/notes/objects.md){download} · [返回本章目录](/oop/)
