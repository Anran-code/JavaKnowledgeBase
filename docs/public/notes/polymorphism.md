# 多态笔记

多态表示：使用同一种父类型接收不同的子类型对象，调用相同方法时，不同对象表现出不同的行为。

```text
父类或接口类型的引用 = 子类或实现类对象
```

## 1.运行时多态的条件：

运行时多态通常需要满足三个条件：

1.存在继承或接口实现关系。
2.子类或实现类重写了父类型的方法。
3.使用父类或接口类型的引用指向子类型对象。

```java
Animal animal = new Wolf();
animal.run();
```

左边 `Animal` 是引用的编译类型，右边 `Wolf` 是对象的实际类型。

## 2.普通继承中的多态：

普通父类引用可以指向不同子类对象：

```java
Animal a1 = new Wolf();
Animal a2 = new Tortoise();

a1.run(); // 调用 Wolf.run()
a2.run(); // 调用 Tortoise.run()
```

虽然两个变量都是 `Animal` 类型，但实际对象不同，因此重写后的 `run()` 表现不同。

多态也可以用在方法参数中：

```java
public static void go(Animal animal) {
    animal.run();
}

go(new Wolf());
go(new Tortoise());
```

以后新增其他 `Animal` 子类时，`go()` 通常不需要修改。

## 3.抽象类中的多态：

抽象类不能直接创建对象，但可以作为父类型引用指向具体子类对象：

```java
Animal animal = new Dog();
animal.cry(); // 调用 Dog.cry()
```

抽象父类规定子类必须实现哪些方法，具体子类负责实现。普通父类多态和抽象类多态使用的是同一套继承、多态机制。

## 4.接口中的多态：

接口类型引用可以指向它的实现类对象：

```java
ClassDataInter data = new ClassDataInterImplement1(students);
data.printAverageScore();

data = new ClassDataInterImplement2(students);
data.printAverageScore();
```

左边接口规定可以调用哪些方法，右边的实际对象决定方法如何执行。多个实现类遵守相同规范，因此能够灵活替换，降低调用方和具体实现之间的耦合。

```java
Driver driver = new Student();
driver = new Teacher();
```

普通类继承、抽象类继承和接口实现看起来是三种形式，其共同规律都是：用更通用的类型接收更具体的对象。

## 5.编译看左，运行看右：

调用重写的实例方法时：

- 编译看左边：左侧类型必须声明这个方法，否则不能通过编译。
- 运行看右边：执行实际对象重写后的方法。

```java
Animal animal = new Wolf();
animal.run();  // 可以，Animal 中声明了 run()
// animal.bite(); // 不可以，Animal 中没有声明 bite()
```

成员变量没有这种运行时多态，访问哪个成员变量由左侧引用类型决定：

```java
System.out.println(animal.name); // 访问 Animal 中的 name
```

因此可以简单记忆：

```text
实例方法：编译看左，运行看右
成员变量：编译看左，运行也看左
```

## 6.向上转型与向下转型：

子类对象赋值给父类型引用是向上转型，可以自动完成：

```java
Animal animal = new Wolf();
```

向上转型后，只能直接调用左侧父类型中声明的成员。要调用子类独有的 `bite()`，需要向下转型：

```java
if (animal instanceof Wolf) {
    Wolf wolf = (Wolf) animal;
    wolf.bite();
}
```

强制转换只改变引用看待对象的方式，不会把对象本身变成另一种类型。如果实际对象不是目标类型，会抛出 `ClassCastException`。

## 7.多态的作用与限制：

多态的主要作用：

- 一个方法可以接收多种子类型对象。
- 调用代码依赖父类或接口，更换实现时改动较少。
- 新增子类或实现类后，已有通用代码通常可以继续使用。

多态的限制：父类型引用只能直接访问父类型已经声明的成员，不能直接访问子类独有成员；确实需要时才能进行安全的向下转型。

## 8.方法重载与多态：

方法重载有时也叫编译时多态或静态多态：编译器根据参数列表，在编译阶段决定调用哪个同名方法。

```java
printVariable(12);     // 选择 printVariable(int)
printVariable("Java"); // 选择 printVariable(String)
```

它与前面的运行时多态不同：

| 类型 | 决定时机 | 依据 |
| --- | --- | --- |
| 方法重载 | 编译时 | 参数数量、类型和顺序 |
| 方法重写产生的多态 | 运行时 | 对象的实际类型 |

当前学习中提到“多态”时，通常主要指父类或接口引用指向子类型对象所产生的运行时多态。

## 9.总结：

| 形式 | 示例 | 实际执行者 |
| --- | --- | --- |
| 普通父类多态 | `Animal a = new Wolf();` | `Wolf` 对象 |
| 抽象类多态 | `Animal a = new Dog();` | `Dog` 对象 |
| 接口多态 | `Driver d = new Student();` | `Student` 对象 |

核心规律：左边决定能使用哪些成员，右边决定重写后的实例方法怎样执行。
