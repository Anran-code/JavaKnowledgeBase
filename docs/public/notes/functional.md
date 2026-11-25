# 函数式编程笔记

当前在 `10-lambda` 模块中学习了函数式接口、Lambda 表达式和静态方法引用。它们可以把“一段行为”作为参数传给其他方法。

## 1.函数式接口：

有且只有一个抽象方法的接口，称为函数式接口。

```java
@FunctionalInterface
interface Swim {
    void swimming();
}
```

`@FunctionalInterface` 不是必须的，但建议添加。若以后不小心加入第二个抽象方法，编译器会立即提示该接口不再是函数式接口。

接口中的默认方法、静态方法和私有方法不计入抽象方法数量。

Lambda 只能用于函数式接口，不能代替抽象类的匿名子类。即使抽象类只有一个抽象方法，也仍然要使用匿名内部类：

```java
Animal animal = new Animal() {
    @Override
    public void cry() {
        System.out.println("meow meow");
    }
};
```

## 2.Lambda 表达式：

Lambda 表达式用于简化函数式接口的匿名实现类。

匿名内部类写法：

```java
Swim swimmer = new Swim() {
    @Override
    public void swimming() {
        System.out.println("swim");
    }
};
```

Lambda 写法：

```java
Swim swimmer = () -> {
    System.out.println("swim");
};
```

基本格式：

```text
(参数列表) -> {
    方法体
}
```

左边对应函数式接口抽象方法的参数，右边对应该方法的具体实现。Lambda 的目标类型是 `Swim`，因此编译器知道这段代码实现的是 `swimming()`。

## 3.Lambda 的简化规则：

完整写法：

```java
Arrays.sort(stu, (Stu o1, Stu o2) -> {
    return Integer.compare(o1.getAge(), o2.getAge());
});
```

1.参数类型可以全部省略，由编译器根据接口推断：

```java
Arrays.sort(stu, (o1, o2) -> {
    return Integer.compare(o1.getAge(), o2.getAge());
});
```

参数类型要么全部写，要么全部省略，不能只省略其中一部分。

2.只有一个参数时，可以省略圆括号：

```java
button.addActionListener(e -> {
    System.out.println("按钮按下");
});
```

没有参数时仍要写 `()`；有多个参数时也不能省略圆括号。

3.方法体只有一条语句时，可以省略大括号：

```java
Arrays.sort(stu,
        (o1, o2) -> Integer.compare(o1.getAge(), o2.getAge()));
```

如果这一行需要返回结果，省略大括号后同时省略 `return` 和分号。

## 4.Lambda 与 Comparator 排序：

`Comparator<Stu>` 是函数式接口，它的核心抽象方法是：

```java
int compare(Stu o1, Stu o2);
```

因此下面的 Lambda：

```java
(o1, o2) -> Integer.compare(o1.getAge(), o2.getAge())
```

就相当于为 `compare()` 提供方法体。`Arrays.sort()` 负责排序过程，Lambda 负责提供两个学生的比较规则。

```java
Arrays.sort(stu,
        (o1, o2) -> Integer.compare(o1.getAge(), o2.getAge()));
```

比较结果的含义：

```text
负数：o1 排在 o2 前面
0：本次比较中二者相等
正数：o1 排在 o2 后面
```

交换比较参数可以改为年龄降序：

```java
Arrays.sort(stu,
        (o1, o2) -> Integer.compare(o2.getAge(), o1.getAge()));
```

## 5.静态方法引用：

如果 Lambda 只是调用一个已经存在的静态方法，可以进一步写成静态方法引用。

先定义符合比较器要求的方法：

```java
public static int compareByAge(Stu s1, Stu s2) {
    return Integer.compare(s1.getAge(), s2.getAge());
}
```

普通 Lambda：

```java
Arrays.sort(stu,
        (s1, s2) -> Stu.compareByAge(s1, s2));
```

静态方法引用：

```java
Arrays.sort(stu, Stu::compareByAge);
```

语法：

```text
类名::静态方法名
```

`Stu::compareByAge` 不会在这一行立即执行方法。它把该方法作为比较规则传给 `Arrays.sort()`；排序过程中需要比较两个学生时，`Arrays.sort()` 才会调用它。

方法引用能够成立，是因为两个方法的参数和返回值能够对应：

```text
Comparator.compare(Stu, Stu) -> int
Stu.compareByAge(Stu, Stu)    -> int
```

方法名可以不同，关键是参数列表和返回值要兼容。

## 6.三种排序写法横向对比：

下面三种代码都表示按照年龄从小到大排序。

1.匿名内部类：

```java
Arrays.sort(stu, new Comparator<Stu>() {
    @Override
    public int compare(Stu o1, Stu o2) {
        return Integer.compare(o1.getAge(), o2.getAge());
    }
});
```

2.Lambda 表达式：

```java
Arrays.sort(stu,
        (o1, o2) -> Integer.compare(o1.getAge(), o2.getAge()));
```

3.静态方法引用：

```java
public static int compareByAge(Stu o1, Stu o2) {
    return Integer.compare(o1.getAge(), o2.getAge());
}

Arrays.sort(stu, Stu::compareByAge);
```

| 写法 | 比较逻辑写在哪里 | 特点 | 适用情况 |
| --- | --- | --- | --- |
| 匿名内部类 | 匿名类的 `compare()` 中 | 结构完整，但代码较长 | 需要明确展示接口实现，或实现逻辑较复杂 |
| Lambda | 调用位置 | 简洁，能直接看到规则 | 函数式接口的一次性简短实现 |
| 静态方法引用 | 已有静态方法中 | 调用位置最简洁，逻辑可复用 | 已存在含义清楚、参数匹配的方法 |

三种写法最终传给 `Arrays.sort()` 的都是一个符合 `Comparator<Stu>` 要求的比较行为，区别主要是表达方式和比较逻辑存放的位置。

它们的简化关系可以理解为：

```text
匿名内部类
    ↓ 省略类和方法声明
Lambda 表达式
    ↓ Lambda 只调用一个已有方法
方法引用
```

## 7.特定类型的方法引用：

当 Lambda 只是让第一个参数调用某个实例方法，并把后续参数传给该方法时，可以使用特定类型的方法引用。

`Demo2` 使用 Lambda 忽略大小写比较两个字符串：

```java
Arrays.sort(names,
        (o1, o2) -> o1.compareToIgnoreCase(o2));
```

它可以改为：

```java
Arrays.sort(names, String::compareToIgnoreCase);
```

语法：

```text
类型名::实例方法名
```

这里的方法引用可以展开为：

```text
String::compareToIgnoreCase

第一个参数 o1 → 方法的调用者
第二个参数 o2 → compareToIgnoreCase() 的参数

等价于 o1.compareToIgnoreCase(o2)
```

对应的方法结构为：

```java
int compareToIgnoreCase(String anotherString)
```

`Comparator<String>` 需要接收两个 `String` 并返回 `int`；第一个参数成为调用者，第二个参数成为实例方法的参数，因此能够匹配。

`compareToIgnoreCase()` 按照忽略大小写的字典顺序比较整个字符串，并非只比较首字母。如果开头字符相同，还会继续比较后面的字符。

## 8.构造器引用：

如果 Lambda 的作用只是根据参数创建并返回一个对象，可以使用构造器引用。

`Demo3` 中的函数式接口：

```java
@FunctionalInterface
interface CarFactory {
    Car getCar(String name);
}
```

1.匿名内部类：

```java
CarFactory factory = new CarFactory() {
    @Override
    public Car getCar(String name) {
        return new Car(name);
    }
};
```

2.Lambda 表达式：

```java
CarFactory factory = name -> new Car(name);
```

3.构造器引用：

```java
CarFactory factory = Car::new;
```

语法：

```text
类名::new
```

调用：

```java
Car car = factory.getCar("大众");
```

执行 `getCar("大众")` 时，字符串参数会传给 `Car(String name)` 构造方法，并返回创建好的 `Car` 对象。

构造器引用成立的原因：

```text
CarFactory.getCar(String) -> Car
Car(String)               -> 创建并得到 Car
```

函数式接口方法的参数必须能够传给目标构造方法，接口方法的返回类型也必须能够接收创建出的对象。类中有多个重载构造方法时，编译器会根据目标函数式接口的参数列表选择匹配的构造方法。

## 9.方法引用总结：

目前学习了三种引用形式：

| 引用类型 | 语法 | 对应的 Lambda |
| --- | --- | --- |
| 静态方法引用 | `类名::静态方法名` | `(a, b) -> 类名.方法(a, b)` |
| 特定类型实例方法引用 | `类型名::实例方法名` | `(a, b) -> a.方法(b)` |
| 构造器引用 | `类名::new` | `参数 -> new 类名(参数)` |

方法引用是对符合特定结构的 Lambda 的进一步简化。能否使用不取决于方法名称，而取决于函数式接口的参数、目标方法的参数以及返回值能否对应。

## 10.使用建议：

- 需要一次性提供简短行为时，优先考虑 Lambda。
- 已经有一个名称清楚、参数匹配的方法或构造方法时，可以使用方法引用。
- 实现中需要较多代码、成员数据或额外方法时，可以使用有名字的实现类或匿名内部类。
- 不要为了使用方法引用而创建含义模糊的方法；可读性比代码长度更重要。

静态方法引用、特定类型的方法引用和构造器引用，都遵守“参数和返回值必须与函数式接口兼容”的基本规则。
