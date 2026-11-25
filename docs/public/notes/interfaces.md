 # 接口笔记

接口（interface）用来规定一组行为：实现接口的类必须提供这些行为的具体代码。当前练习在 `08-interface` 模块中。

## 1.定义接口：

使用 `interface` 定义接口。`interface1` 中的 `A` 同时声明了常量和抽象方法：

```java
public interface A {
    String SCHOOL_NAME = "TongJi University";

    public abstract void run();
    void run1();
}
```

接口里的 `SCHOOL_NAME` 默认是 `public static final`，一般通过 `A.SCHOOL_NAME` 使用。这里的 `run()`、`run1()` 默认都是 `public abstract`，因此 `public abstract` 可以省略。

接口不能直接创建对象：

```java
// A a = new A(); // 编译错误
System.out.println(A.SCHOOL_NAME);
```

## 2.实现接口：

类使用 `implements` 实现接口。一个类可以同时实现多个接口，接口名之间用逗号分隔。

```java
interface A {
    void run();
}

interface B {
    void play();
}

class C implements A, B {
    @Override
    public void run() {
        System.out.println("run");
    }

    @Override
    public void play() {
        System.out.println("play");
    }
}
```

普通实现类必须实现接口要求的所有抽象方法；如果暂时不实现，类本身也要声明为 `abstract`。重写时要写 `public`，因为接口中的抽象方法本来就是 `public`，实现时不能缩小访问权限。

你的 `interface1` 练习中，`C` 同时实现了 `A` 和 `B`，所以要实现 `run()`、`run1()`、`play()` 三个方法。

## 3.接口与多态：

实现类对象可以赋值给它实现的接口类型引用：

```java
Driver driver = new Student();
BoyFriend boyFriend = new Student();
People person = new Student();
```

`interface2` 中的 `Student` 继承 `People`，同时实现 `Driver` 和 `BoyFriend`。Java 类只能直接继承一个类，但可以实现多个接口。上面三个变量指向的都可以是同一个类型的对象，只是分别以不同类型看待它。

使用接口类型接收对象，还可以灵活替换实现类：

```java
Driver first = new Student();
Driver second = new Teacher();
```

如果接口声明了方法，就可以通过接口引用调用该方法；实际执行哪个实现类的方法，由运行时对象决定。接口引用不能直接调用仅在实现类中声明的独有方法。

例如 `ClassDataInter data = new ClassDataInterImplement1(students);`：右边 `new` 创建实现类对象，左边用接口类型接收它。编译时看左边，确定能调用哪些方法；运行时看右边，执行对应实现类的方法。这样 `data` 之后也可以指向 `ClassDataInterImplement2`，调用代码不用改变。

## 4.练习：班级数据的两套实现：

`interface3` 先定义统一的操作规范：

```java
public interface ClassDataInter {
    void printAllStudentInfo();
    void printAverageScore();
}
```

然后让两个类分别实现它：

- `ClassDataInterImplement1`：打印全部学生信息，计算所有成绩的平均分。
- `ClassDataInterImplement2`：打印学生信息和男女生人数；计算平均分时去掉一个最高分和一个最低分。

调用方只需使用同一种接口类型，就能切换不同的统计规则：

```java
ClassDataInter data = new ClassDataInterImplement1(students);
data.printAllStudentInfo();
data.printAverageScore();

data = new ClassDataInterImplement2(students);
data.printAllStudentInfo();
data.printAverageScore();
```

当前 10 名学生的数据中，第一套方案的平均分为 `86.60`；第二套方案去掉最高分 `97` 和最低分 `70` 后，平均分为 `87.38`，男女生各 `5` 人。

第二套方案用到的计算过程是：

```text
平均分 = (总分 - 最高分 - 最低分) / (学生人数 - 2)
```

这个实现默认数组至少有 `3` 名学生，否则 `students[0]` 或除数可能出问题。人数统计中的 `else` 也默认性别只有 `'男'`、`'女'` 两种输入。

## 5.接口与抽象类的区别：

| 项目 | 接口 | 抽象类 |
| --- | --- | --- |
| 关系关键字 | 类使用 `implements` 实现 | 子类使用 `extends` 继承 |
| 一个类可同时使用几个 | 可以实现多个接口 | 只能直接继承一个类 |
| 主要用途 | 规定某类对象应提供哪些行为 | 提取共同属性、方法和部分实现 |
| 创建对象 | 不能直接创建 | 不能直接创建 |

当前阶段可以简单理解为：抽象类描述“是什么”，接口描述“能做什么”。这只是帮助入门的记忆方式，实际设计时还要看哪些数据和代码需要共享。

## 6.接口中的默认、私有和静态方法：

早期接口主要用于定义抽象方法。Java 8 以后，接口还可以提供默认方法和静态方法；Java 9 以后可以定义私有方法。

1.默认方法：

默认方法使用 `default` 修饰，并且必须有方法体。它本质上是接口提供给实现类继承的公共实例方法。

```java
public interface A {
    default void go() {
        System.out.println("go");
    }
}

class B implements A {}

B b = new B();
b.go();
```

默认方法可以给已有接口增加功能，而不要求所有实现类立刻重写新方法。实现类需要不同逻辑时，也可以重写它。

2.私有方法：

私有方法只能在接口内部使用，适合提取多个默认方法中的重复代码。

```java
public interface A {
    default void go() {
        run();
    }

    private void run() {
        System.out.println("run");
    }
}
```

实现类不能直接调用或重写接口的私有方法。

3.静态方法：

接口的静态方法属于接口本身，只能使用接口名调用：

```java
public interface A {
    static void show() {
        System.out.println("show");
    }
}

A.show();
// new B().show(); // 编译错误
```

接口静态方法不会被实现类继承，也不参与方法重写。

| 方法类型 | 是否有方法体 | 调用方式 |
| --- | --- | --- |
| 抽象方法 | 没有 | 由实现类重写后，通过对象调用 |
| 默认方法 | 有 | 通过实现类对象调用 |
| 私有方法 | 有 | 只能在接口内部调用 |
| 静态方法 | 有 | 通过接口名调用 |

## 7.接口多继承与同名方法处理：

Java 中几种关系的数量限制：

```text
类与类：一个类只能直接继承一个父类
类与接口：一个类可以实现多个接口
接口与接口：一个接口可以继承多个接口
```

1.接口可以多继承：

```java
interface A {
    void show1();
}

interface B {
    void show2();
}

interface C extends A, B {
    void show3();
}

class D implements C {
    @Override
    public void show1() {}

    @Override
    public void show2() {}

    @Override
    public void show3() {}
}
```

因为 `C` 已经继承 `A`、`B`，实现类只写 `implements C` 即可获得三份方法规范。

2.返回类型不兼容的同名方法：

如果两个接口的方法名和参数列表相同，但返回类型互不兼容，就不能同时继承或实现：

```java
interface A1 {
    void show();
}

interface B1 {
    String show();
}

// interface C1 extends A1, B1 {} // 编译错误
```

仅仅方法同名不一定冲突；这里真正无法解决的是同一组参数对应了两个不兼容的返回类型。

3.父类方法优先：

当父类实例方法和接口默认方法同名时，优先使用父类的方法：

```java
interface A2 {
    default void show() {
        System.out.println("A2 show");
    }
}

class Animal {
    public void show() {
        System.out.println("Animal show");
    }
}

class Dog extends Animal implements A2 {}

new Dog().show(); // Animal show
```

如果实现类需要主动调用接口的默认方法，可以在类内部使用 `接口名.super.方法名()`：

```java
class Dog extends Animal implements A2 {
    public void go() {
        A2.super.show();
    }
}
```

4.多个接口的默认方法冲突：

如果一个类实现的多个接口提供了签名相同的默认方法，实现类必须重写该方法，明确如何处理冲突。

```java
class C2 implements A3, B3 {
    @Override
    public void show() {
        A3.super.show();
        B3.super.show();
    }
}
```

实现类可以完全写自己的逻辑，也可以用 `A3.super.show()`、`B3.super.show()` 选择调用某个接口的默认实现。
