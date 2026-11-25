# 泛型与包装类笔记

本章对应 `13-collection` 中的 `genericity`、`genericity2`、`genericity3` 和 `genericity4` 练习。

## 1.为什么使用泛型：

泛型把“要存放或处理的数据类型”作为参数交给类、接口或方法。你的 `GenericDemo1` 对比了不写泛型和写泛型的集合：

```java
ArrayList list = new ArrayList(); // 原始类型：不同类型都能放进去
list.add(123);
list.add("Java");

ArrayList<Integer> numbers = new ArrayList<>();
numbers.add(123);
// numbers.add("Java"); // 编译错误
Integer number = numbers.get(0); // 不需要强制转换
```

不写泛型时，取出的元素按 `Object` 看待，强制转换可能在运行时失败。写成 `ArrayList<Integer>` 后，编译器能提前限制放入的类型，取出时也更方便。`ArrayList` 单独使用叫**原始类型**，新代码中通常不建议这样写。

## 2.泛型类：

在类名后声明类型参数，例如你的 `MyArrayList<E>`：

```java
public class MyArrayList<E> {
    private ArrayList<E> list = new ArrayList<>();

    public boolean add(E value) {
        list.add(value);
        return true;
    }

    public boolean remove(E value) {
        return list.remove(value);
    }
}

MyArrayList<String> names = new MyArrayList<>();
names.add("Anran");
```

`E` 是类型参数的名字，不是某个固定类型。创建 `MyArrayList<String>` 时，该对象的 `add(E)`、`remove(E)` 都按 `String` 使用。常见命名有 `E`（元素）、`T`（一般类型）、`K`（键）、`V`（值）。

## 3.泛型接口：

你的 `Data<E>` 把增删改查操作定义成一套可复用的规范：

```java
public interface Data<E> {
    void add(E e);
    void delete(E e);
    void update(E e);
    E query(int id);
}

public class StudentData implements Data<Student> {
    // 实现方法时，E 已经确定为 Student
}
```

`TeacherData implements Data<Teacher>` 同理。这样一套接口可以服务于不同数据类型，同时让每个实现类只接收自己的类型。你现在的 `StudentData`、`TeacherData` 方法体仍为空，`query()` 返回 `null`，它们用于演示**泛型接口的声明和实现**，尚未完成真实的增删改查功能。

## 4.泛型方法：

泛型方法在**返回类型前**声明自己的类型参数：

```java
public static <T> void printArray(T[] values) {
    for (T value : values) {
        System.out.println(value);
    }
}

String[] names = {"Anran", "Bobo"};
printArray(names); // 本次调用中，T 推断为 String
```

`<T>` 表示“这个方法要使用类型参数 T”，后面的 `void` 才是返回类型。泛型方法可以写在普通类中，不要求整个类也是泛型类。

你的 `GenericDemo4` 中 `printArray()` 方法体为空、`getMax()` 直接返回 `null`；目前只演示了声明和调用语法，**还没有真正打印数组或找最大值**。若以后实现 `getMax()`，还要明确元素之间如何比较。

## 5.通配符 `?` 与泛型的不变性：

虽然 `Xiaomi extends Car`，但 `ArrayList<Xiaomi>` **不是** `ArrayList<Car>` 的子类型。所以接收 `ArrayList<Car>` 的方法不能直接接收 `ArrayList<Xiaomi>`。

```java
ArrayList<Xiaomi> cars = new ArrayList<>();
// go(cars); // go(ArrayList<Car>)：编译错误
```

如果方法只关心“这是某种类型的列表”，可以使用通配符 `?`。例如 `ArrayList<?>` 可接收多种元素类型的列表；但由于具体类型未知，不能随意往里加入非 `null` 元素，读出时只能当作 `Object`。

`?` 表示**未知的某个类型**；`T` 则是自己声明的**有名字的类型参数**，可以在参数和返回值之间重复使用，表示它们是同一种类型。

## 6.通配符上限与下限：

你的 `GenericDemo5` 使用上限，让赛车方法只接收 `Car` 及其子类的列表：

```java
public static void go1(ArrayList<? extends Car> cars) {
    Car car = cars.get(0); // 可以按 Car 读取
    // cars.add(new Xiaomi()); // 编译错误：实际列表也可能是 ArrayList<LX>
}
```

| 写法 | 可传入的列表示例 | 主要用途 |
| --- | --- | --- |
| `? extends Car` | `ArrayList<Car>`、`ArrayList<Xiaomi>`、`ArrayList<LX>` | 从列表中**读取**，至少能当作 `Car` |
| `? super Car` | `ArrayList<Car>`、`ArrayList<Object>` | 向列表中**写入** `Car` 或其子类 |

`? extends Car` 不能接收 `ArrayList<Dog>`。它虽然允许不同的汽车子类列表传进来，但方法内不知道具体是哪种子类，因此不能安全地加入一辆新车（`null` 除外）。

`? super Car` 表示未知类型是 `Car` 或 `Car` 的父类型，所以可以加入 `Car`、`Xiaomi` 等对象；读出时不能保证比 `Object` 更具体：

```java
public static void addCar(ArrayList<? super Car> cars) {
    cars.add(new Car());
    cars.add(new Xiaomi());
    Object value = cars.get(0);
}
```

可以先用一句话记：**主要读取用 `extends`，主要写入用 `super`。** 实际方法参数也常写成 `List<? extends Car>` 或 `List<? super Car>`，这样不仅能接收 `ArrayList`，还可接收其他 `List` 实现。

## 7.包装类与泛型：

Java 的泛型类型参数必须是**引用类型**，不能是 `int`、`double` 等基本类型：

```java
// ArrayList<int> wrong = new ArrayList<>(); // 编译错误
ArrayList<Integer> numbers = new ArrayList<>();
```

每种基本类型都有对应的包装类：

| 基本类型 | 包装类 | 基本类型 | 包装类 |
| --- | --- | --- | --- |
| `byte` | `Byte` | `short` | `Short` |
| `int` | `Integer` | `long` | `Long` |
| `float` | `Float` | `double` | `Double` |
| `char` | `Character` | `boolean` | `Boolean` |

你的 `GenericDemo6` 演示了自动装箱和拆箱：

```java
Integer wrapped = 100; // 自动装箱：int → Integer
int number = wrapped;   // 自动拆箱：Integer → int

ArrayList<Integer> list = new ArrayList<>();
list.add(100);           // 自动装箱
int first = list.get(0); // 自动拆箱
```

包装类可以是 `null`；如果拆箱一个 `null`，会抛出 `NullPointerException`。另外，包装对象比较**数值内容**时用 `equals()`（或先拆箱），不要依赖 `==`：

```java
Integer a = Integer.valueOf(100);
Integer b = Integer.valueOf(100);
System.out.println(a == b);      // true：100 在 valueOf 的缓存范围内，但比较的是引用
System.out.println(a.equals(b)); // true，比较数值内容
```

你的示例中 `100` 的两个 `Integer.valueOf()` 结果会复用缓存对象，因此 `==` 为 `true`；这不能推出所有 `Integer` 对象都能用 `==` 比较数值。

## 8.包装类常用转换：

```java
String text = Integer.toString(23); // int → String，结果是 "23"
int value = Integer.parseInt("98"); // String → int，结果是 98
Integer object = Integer.valueOf("98"); // String → Integer
```

`"23" + 1` 是字符串拼接，得到 `"231"`；`Integer.parseInt("23") + 1` 才是数值运算，得到 `24`。如果字符串不是合法整数，`parseInt()` 会抛出运行时异常 `NumberFormatException`，可以结合上一章的异常处理知识给用户提示。
