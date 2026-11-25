# 高级面向对象笔记

本阶段在类、封装的基础上学习继承、构造方法调用、访问控制、方法重写、多态、`final` 和单例模式。

## 1.继承：

继承让子类复用父类已有的属性和方法。使用 `extends` 表示继承关系。

```java
class People {
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

class Teacher extends People {
    private String skill;

    public String getSkill() {
        return skill;
    }
}
```

`Teacher` 自动拥有可访问的 `getName()`、`setName()`，同时可以定义自己独有的 `skill`。Java 类只支持单继承：一个类只能直接 `extends` 一个父类。

父类的 `private` 成员也会存在于子类对象中，但子类不能直接访问，应该调用父类提供的公共方法。

## 2.访问修饰符：

| 修饰符 | 同一个类 | 同一个包 | 不同包的子类 | 其他位置 |
| --- | --- | --- | --- | --- |
| `private` | 可以 | 不可以 | 不可以 | 不可以 |
| 不写修饰符 | 可以 | 可以 | 不可以 | 不可以 |
| `protected` | 可以 | 可以 | 可以 | 不可以 |
| `public` | 可以 | 可以 | 可以 | 可以 |

不写修饰符称为默认（包访问权限）。`protected` 的重点是：不同包中的子类可以在自己的类内部访问继承来的 `protected` 成员；普通对象不能在不同包中随意访问它。

## 3.`super` 与构造方法：

`super` 表示当前对象的父类部分。子类构造方法必须先完成父类部分的初始化。

```java
class People {
    public People(String name, char sex) {
        // 初始化父类成员
    }
}

class Teacher extends People {
    private String skill;

    public Teacher(String skill, String name, char sex) {
        super(name, sex);
        this.skill = skill;
    }
}
```

`super(...)` 必须是构造方法的第一条语句。若没有手写它，编译器会尝试在第一行补上 `super()`；因此父类没有无参构造方法时，子类必须显式调用匹配的父类构造方法。

创建子类对象时，先执行父类构造方法，再执行子类构造方法。

`super` 还可以访问被子类同名成员遮蔽的父类成员：

```java
System.out.println(this.name);  // 子类的 name
System.out.println(super.name); // 父类的 name

fun();       // 调用子类重写后的方法
super.fun(); // 调用父类方法
```

## 4.构造方法重载与 `this(...)`：

一个类可以有多个构造方法。相似的初始化逻辑可以让简化版构造方法调用完整版构造方法。

```java
public Student(String name, int age, char sex, String schoolName) {
    this.name = name;
    this.age = age;
    this.sex = sex;
    this.schoolName = schoolName;
}

public Student(String name, int age, char sex) {
    this(name, age, sex, "洪江一中");
}
```

`this(...)` 表示调用当前类的另一个构造方法，也必须写在构造方法第一行。`this(...)` 和 `super(...)` 不能同时直接写在同一个构造方法中。

## 5.方法重写：

子类重新实现父类中已有的方法，称为重写（Override）。建议始终写 `@Override`，若方法名、参数或返回类型不符合重写规则，编译器会及时提示。

```java
class Animal {
    public void cry() {
        System.out.println("动物叫");
    }
}

class Dog extends Animal {
    @Override
    public void cry() {
        System.out.println("大狗叫");
    }
}
```

重写时，方法名和参数列表必须相同；子类方法的访问权限不能比父类更严格。例如父类方法是 `public`，子类不能重写为 `private`。

`toString()` 是所有类从 `Object` 继承的方法。重写它后，直接打印对象会输出更有意义的内容：

```java
@Override
public String toString() {
    return "Student(name:" + name + " age:" + age + ")";
}
```

## 6.多态：

父类引用可以指向子类对象，称为向上转型：

```java
Animal animal = new Wolf();
animal.run();
```

调用**实例方法**时，编译看左边的引用类型，运行看右边的实际对象类型。因此 `animal.run()` 会调用 `Wolf` 重写后的 `run()`。

```java
public static void go(Animal animal) {
    animal.run();
}

go(new Wolf());
go(new Tortoise());
```

这种写法让 `go()` 不必为每种动物重复编写，新增动物子类后也能直接使用，体现了低耦合和可扩展性。

成员变量没有多态：`animal.name` 始终按引用左侧的类型确定。方法调用与变量访问要区分开。

需要调用子类独有方法时，可以向下转型；转换前使用 `instanceof` 判断实际对象类型：

```java
if (animal instanceof Wolf) {
    Wolf wolf = (Wolf) animal;
    wolf.bite();
}
```

若实际对象不是 `Wolf`，直接强转会抛出 `ClassCastException`。

## 7.银行卡练习：继承与重写的综合使用：

`Card` 保存所有卡共有的数据和充值行为；`SilverCard`、`GoldenCard` 继承它，并分别设置折扣和重写消费方法。

```java
class SilverCard extends Card {
    public SilverCard(...) {
        super(...);
        setDiscount(0.9);
    }

    @Override
    public void consume(double money) {
        // 按九折计算并扣款
    }
}
```

父类将 `consume()` 留为空实现，子类给出各自规则；金卡在消费额达到 `200` 后额外提示洗车券。这体现了“公共部分放父类，差异部分由子类重写”。

命名推荐使用小驼峰：`carId`、`ownerName`、`phoneNumber`、`discount`。字段名不建议使用下划线或以大写字母开头。

## 8.`final` 与常量：

`final` 有三种常见用途：

```java
final class A {}              // 类不能被继承
final void show() {}          // 方法不能被重写
final double PI = 3.14;       // 变量只能赋值一次
```

`final` 修饰引用变量时，固定的是引用地址，不是对象内部内容：

```java
final int[] arr = {1, 2, 3};
arr[2] = 5;           // 可以修改数组元素
// arr = new int[3];  // 不可以更换为另一个数组
```

常量通常写成 `public static final`，并使用全大写加下划线命名：

```java
public static final String SYSTEM_NAME = "minecraft";
```

## 9.单例模式：

单例模式保证一个类在程序中只创建一个对象。核心是：私有化构造方法、保存唯一对象、提供公共获取方法。

1.饿汉式：类加载时立即创建对象。

```java
public class A {
    private static A instance = new A();

    private A() {}

    public static A getInstance() {
        return instance;
    }
}
```

2.懒汉式：第一次需要时再创建对象。

```java
public class B {
    private static B instance;

    private B() {}

    public static B getInstance() {
        if (instance == null) {
            instance = new B();
        }
        return instance;
    }
}
```

```java
A a1 = A.getInstance();
A a2 = A.getInstance();
System.out.println(a1 == a2); // true
```

当前懒汉式适合单线程练习；多线程环境下需要进一步保证并发安全。

## 10.枚举（enum）：

枚举适合表示取值范围固定的数据，例如四个方向。`enumdemo` 中的 `Direction` 定义了四个枚举常量：

```java
public enum Direction {
    UP, DOWN, LEFT, RIGHT
}

Direction direction = Direction.LEFT;
```

每个常量都是一个 `Direction` 对象。方法参数写成 `Direction` 后，调用者只能传入该枚举的值，不能像 `int` 参数那样误传 `5`：

```java
public static void move(Direction direction) {
    switch (direction) {
        case UP:
            System.out.println("UP");
            break;
        case DOWN:
            System.out.println("DOWN");
            break;
        case LEFT:
            System.out.println("LEFT");
            break;
        case RIGHT:
            System.out.println("RIGHT");
            break;
    }
}

move(Direction.LEFT);
```

`case UP` 是简洁且兼容较早 Java 版本的写法。当前项目使用 JDK 25，`Test2.java` 中的 `case Direction.UP` 也能编译；若按 Java 17 编译，则需要去掉 `Direction.`。`Test2.java` 中导入的 `DeflaterInputStream` 没有用到。

`A.java` 中的 `X`、`Y`、`Z` 同样是枚举常量。常用方法：

```java
A a = A.Y;
System.out.println(a);           // Y
System.out.println(a.name());    // Y，常量名称
System.out.println(a.ordinal()); // 1，从 0 开始的声明位置
```

`ordinal()` 只是位置；若以后调整常量顺序，结果也会改变，不宜用它作为长期保存的编号。`Constant.java` 使用 `public static final int` 定义方向也能工作，但枚举能在编译时限制参数的取值，更适合表达一组固定选项。

## 11.抽象类与抽象方法（abstract）：

抽象类适合提取子类共同的特征，同时规定子类必须完成的行为。使用 `abstract` 修饰类和方法：

```java
// Animal.java
public abstract class Animal {
    public abstract void cry(); // 只有声明，没有方法体
}
```

```java
// Dog.java
public class Dog extends Animal {
    @Override
    public void cry() {
        System.out.println("Dog cry");
    }
}
```

这对应 `abstactdemo` 中 `A`、`B` 的关系，以及 `abstractdemo2` 中 `Animal`、`Dog`、`Cat` 的关系。

1.抽象类的规则与特点：

- 抽象类中不一定有抽象方法；但**有抽象方法的类必须声明为抽象类**。
- 抽象类也可以有成员变量、普通方法和构造方法。构造方法供子类创建对象时初始化父类部分使用。
- 抽象类不能直接 `new` 对象，但可以作为父类引用指向子类对象：`Animal animal = new Dog();`。
- 普通子类继承抽象类后，必须实现全部尚未实现的抽象方法；如果不实现，子类也必须声明为抽象类。

```java
// Animal animal = new Animal(); // 编译错误：不能直接实例化抽象类
Animal animal = new Dog();
animal.cry(); // Dog cry，体现多态
```

2.模板方法：

第二张图片中的作文例子：开头和结尾相同，中间正文由学生、老师各自完成。可以把固定的写作流程放在抽象父类中，将不同的正文留给子类实现。

```java
public abstract class People {
    public final void write() {
        System.out.println("《我的爸爸》");
        System.out.println("我爸爸是一个好人……");
        writeMain();
        System.out.println("我爸爸真好，你有这样的爸爸吗？");
    }

    public abstract void writeMain();
}

class Student extends People {
    @Override
    public void writeMain() {
        System.out.println("学生写自己的正文");
    }
}

class Teacher extends People {
    @Override
    public void writeMain() {
        System.out.println("老师写自己的正文");
    }
}
```

调用 `new Student().write()` 时，父类 `write()` 控制“开头 → 正文 → 结尾”的顺序；执行到 `writeMain()` 时，调用学生类实现的方法。`final` 让子类不能重写 `write()`，从而保持共同的写作流程；不同内容仍由子类的 `writeMain()` 决定。
