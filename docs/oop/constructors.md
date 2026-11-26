---
title: 构造方法与 this
description: 对象如何初始化，当前对象又是谁
prev:
  text: 类与对象
  link: /oop/objects
next:
  text: 封装与数据校验
  link: /oop/encapsulation
---
<ReadingTools chapter="面向对象" chapterLink="/oop/" />

# 构造方法与 this

构造方法负责初始化新对象；`this` 表示当前正在使用的对象。

## 你写的 Student

<SourceCode id="oop-student" />
<SourceCode id="oop-student-test" />

执行 `new Student("小明")` 时调用构造方法，把参数写入成员变量。随后设置语文、数学成绩，再调用成员方法。这个测试的输出是：

```text
小明的总成绩是：170.0
小明喜欢丽华
```

| 写法 | 含义 |
| --- | --- |
| `public Student(String _name)` | 构造方法，名称必须和类名相同 |
| `public void getAllScore()` | 普通实例方法，`void` 表示不返回结果 |
| `new Student("小明")` | 创建对象并调用匹配的构造方法 |

构造方法不写任何返回值类型，连 `void` 也不能写。源码用 `_name` 区分参数，也可以改写成 `this.name = name;`；两种写法都能完成初始化。

## this.name 与 name

```java
public void love(String name) {
    System.out.println(this.name + "喜欢" + name);
}
```

在 `s1.love("丽华")` 中，`this` 就是 s1 引用的对象，`this.name` 为“小明”；不带 `this` 的 `name` 优先指向同名参数，值为“丽华”。`this` 不是固定代表某个学生，而是随调用对象改变。

## 无参构造不是一直自动存在

没有声明任何构造方法时，编译器会提供默认的无参构造方法，因此 `Star` 可以直接 `new Star()`。一旦声明了构造方法，编译器就不再补这个默认构造方法。

你的 `obj.Student` 只有带名字参数的构造方法，所以不能直接 `new Student()`。电影类 `Movie` 显式写了无参和有参两个构造方法，因此两种创建方式都支持。这也是重载。

## 当前代码的使用前提

`chinese` 和 `math` 使用包装类 `Double`，默认值是 `null`。`getAllScore()` 中的加法需要拆箱；未设置成绩就调用会抛出空指针异常。当前 Test2 先给两科赋值，再计算，所以正常运行。若只需要普通数值，也可以用 `double`，其成员默认值为 0.0。

---
依据：`notes/03面向对象.md` 与 `05-oop` 实际源码。[下载原笔记](/notes/objects.md){download} · [返回本章目录](/oop/)
