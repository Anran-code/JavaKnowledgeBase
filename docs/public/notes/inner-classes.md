# 内部类笔记

内部类是定义在另一个类内部的类。当前在 `09-more-advanced-oop2` 中学习了成员内部类和静态内部类。

内部类通常用于表示与外部类关系紧密的事物，例如 `People` 中的 `Heart`。

## 1.成员内部类：

定义在外部类的成员位置、没有使用 `static` 修饰的类，称为成员内部类。

```java
public class Outer {
    private int age = 20;

    public class Inner {
        private String name;

        public void show() {
            System.out.println(age);
        }
    }
}
```

成员内部类属于某个外部类对象。创建内部类对象前，必须先有外部类对象：

```java
Outer outer = new Outer();
Outer.Inner inner = outer.new Inner();
```

也可以合并写成：

```java
Outer.Inner inner = new Outer().new Inner();
```

创建出来的 `inner` 会依附于创建它的 `outer` 对象。

## 2.成员内部类访问外部类成员：

成员内部类保存着所依附的外部类对象，因此可以直接访问外部类的静态成员和实例成员，包括私有成员。

```java
public class Outer {
    public static String schoolName = "Anran";
    private int age = 20;

    public void test() {}

    public class Inner {
        public void show() {
            System.out.println(schoolName); // 外部类静态成员
            System.out.println(age);        // 外部类实例成员
            test();                         // 外部类实例方法
        }
    }
}
```

在成员内部类中，可以使用 `外部类名.this` 取得当前内部类所依附的外部类对象：

```java
System.out.println(Outer.this);
```

## 3.同名变量的访问：

`People.Heart` 练习中，外部类成员、内部类成员和局部变量都叫 `heartBeat`：

```java
public class People {
    private int heartBeat = 100;

    public class Heart {
        private int heartBeat = 200;

        public void show() {
            int heartBeat = 300;

            System.out.println(People.this.heartBeat); // 100
            System.out.println(this.heartBeat);        // 200
            System.out.println(heartBeat);             // 300
        }
    }
}
```

三种写法的含义：

| 写法 | 访问目标 |
| --- | --- |
| `heartBeat` | 当前方法中的局部变量 |
| `this.heartBeat` | 当前内部类对象的成员变量 |
| `People.this.heartBeat` | 当前所依附的外部类对象的成员变量 |

变量同名时仍然遵循就近原则：局部变量优先于内部类成员，内部类成员优先于外部类成员。

## 4.静态内部类：

使用 `static` 修饰的成员内部类，称为静态内部类。

```java
public class Outer {
    public static String name = "Anran";
    private int age = 10;

    public static class Inner {
        public void show() {
            System.out.println(name);
        }
    }
}
```

静态内部类属于外部类本身，不依附于某个外部类对象，因此创建时不需要先 `new Outer()`：

```java
Outer.Inner inner = new Outer.Inner();
inner.show();
```

静态内部类可以直接访问外部类的静态成员，但不能直接访问外部类的实例成员：

```java
System.out.println(name); // 可以
// System.out.println(age); // 编译错误
```

原因是静态内部类对象没有自动关联某个 `Outer` 对象，不知道应该访问哪一个对象的 `age`。如果确实需要，可以在静态内部类中先显式创建外部类对象：

```java
public void showAge() {
    Outer outer = new Outer();
    System.out.println(outer.age);
}
```

## 5.两种内部类的区别：

| 项目 | 成员内部类 | 静态内部类 |
| --- | --- | --- |
| 是否使用 `static` | 不使用 | 使用 |
| 是否依附外部类对象 | 是 | 否 |
| 创建方式 | `outer.new Inner()` | `new Outer.Inner()` |
| 直接访问外部类静态成员 | 可以 | 可以 |
| 直接访问外部类实例成员 | 可以 | 不可以 |
| 是否可以使用 `外部类名.this` | 可以 | 不可以 |

简单记忆：成员内部类需要“先有外部对象”，静态内部类只需要“知道外部类名”。

## 6.匿名内部类：

匿名内部类是没有显式类名的内部类。它会临时定义一个子类或实现类，并立即创建该类的对象，适合只使用一次的实现。

1.继承抽象类：

```java
Animal animal = new Animal() {
    @Override
    public void cry() {
        System.out.println("喵喵");
    }
};

animal.cry();
```

`new Animal() { ... }` 不是直接创建抽象类对象。它定义了一个继承 `Animal` 的匿名子类，重写 `cry()`，再创建这个匿名子类的对象。

2.实现接口：

```java
Swim swimmer = new Swim() {
    @Override
    public void swimming() {
        System.out.println("学生游泳");
    }
};

start(swimmer);
```

也可以把匿名实现类对象直接作为方法参数：

```java
start(new Swim() {
    @Override
    public void swimming() {
        System.out.println("学生游泳");
    }
});
```

这里同时体现了接口多态：方法参数是 `Swim`，实际传入的是匿名实现类对象。

3.事件监听：

`Test3` 给按钮传入一个临时的 `ActionListener` 实现对象：

```java
btn.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        System.out.println("按钮按下");
    }
});
```

注册监听器时不会立即执行 `actionPerformed()`；用户点击按钮后，Swing 才会调用它。一次性的事件处理逻辑很适合使用匿名内部类。

4.自定义数组排序规则：

`Arrays.sort()` 的第二个参数需要一个 `Comparator<Stu>` 比较器对象。`Test4` 使用匿名内部类临时提供比较规则：

```java
Arrays.sort(stu, new Comparator<Stu>() {
    @Override
    public int compare(Stu o1, Stu o2) {
        return Integer.compare(o1.getAge(), o2.getAge());
    }
});
```

`compare()` 的返回值规则：

```text
负数：o1 排在 o2 前面
0：两个对象在本次比较中相等
正数：o1 排在 o2 后面
```

`Integer.compare(o1.getAge(), o2.getAge())` 表示按年龄从小到大排列。若要按年龄从大到小，可以交换两个参数：

```java
return Integer.compare(o2.getAge(), o1.getAge());
```

按身高排序时应使用：

```java
return Double.compare(o1.getHeight(), o2.getHeight());
```

匿名内部类适合简短、只使用一次的实现；如果代码较长或需要反复创建对象，单独定义一个有名字的类会更清楚。

## 7.练习总结：

`innerclass` 包演示了成员内部类：

- `Outer.Inner` 访问外部类的成员和 `Outer.this`。
- `People.Heart` 区分外部类、内部类和方法中的同名变量。

`innerclass2` 包演示了静态内部类：

- 使用 `new Outer.Inner()` 直接创建对象。
- 可以直接访问外部类静态成员，不能直接访问外部类实例成员。

`innerclass3` 包演示了匿名内部类：

- `Test` 临时创建 `Animal` 的匿名子类。
- `Test2` 创建 `Swim` 的匿名实现类并作为参数传递。
- `Test3` 使用匿名监听器处理按钮点击事件。
- `Test4` 使用匿名 `Comparator<Stu>` 为学生数组提供年龄排序规则。
