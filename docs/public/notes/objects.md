# 面向对象笔记

面向对象（Object-Oriented Programming，OOP）把数据和操作数据的方法组织到“类”中，再根据类创建对象。它适合描述学生、电影、订单等具有属性和行为的事物。

## 1.类与对象：

类（class）是对象的设计图；对象（object）是根据类创建出的具体实例。

```java
class Star {
    String name;
    int age;
    String gender;

    void sing() {
        System.out.println(name + "正在唱歌");
    }
}

Star star = new Star();
star.name = "LiHua";
star.age = 20;
star.sing();
```

`name`、`age` 等是成员变量（属性）；`sing()` 是成员方法（行为）。使用 `new` 创建对象后，通过 `对象.成员` 访问其属性和方法。

每个对象拥有自己的非静态成员数据：

```java
Star a = new Star();
Star b = new Star();

a.name = "A";
b.name = "B";
```

## 2.构造方法与 `this`：

构造方法在 `new` 对象时自动执行，用于完成对象初始化。它的名称必须和类名相同，且没有返回值类型。

```java
class Student {
    String name;

    public Student(String name) {
        this.name = name;
    }
}

Student s = new Student("小明");
```

`this` 表示“当前对象”。当参数名和成员变量同名时，`this.name` 表示成员变量，右侧的 `name` 表示参数。

成员方法中的 `this` 也能区分当前对象的属性和传入参数：

```java
public void love(String name) {
    System.out.println(this.name + "喜欢" + name);
}
```

如果类没有写任何构造方法，Java 会提供无参构造方法；一旦自己写了构造方法，若仍需要无参创建对象，就要自己写 `public 类名() {}`。

## 3.封装：

封装的目标是隐藏对象内部数据，让外部通过受控制的方法读取或修改数据。通常成员变量使用 `private`，对外提供 `public` 的 getter 和 setter。

```java
public class Student {
    private int age;
    private double grade;

    public void setAge(int age) {
        if (age >= 0) {
            this.age = age;
        } else {
            System.out.println("输入有误");
        }
    }

    public int getAge() {
        return age;
    }
}
```

这样外部不能直接写 `student.age = -1`，而是必须经过 `setAge()` 的校验。电影类 `Movie` 也使用了私有的 `id`、`name`、`price`，并通过 getter、setter 访问。

## 4.静态成员：

使用 `static` 修饰的成员属于类本身，不属于某一个对象。推荐通过类名访问。

```java
class Student {
    static int number;
    int age;

    public Student() {
        number++;
    }
}

Student s1 = new Student();
Student s2 = new Student();
System.out.println(Student.number); // 2
```

`number` 被所有 `Student` 对象共享，适合统计对象数量；`age` 是每个学生各自拥有的数据。静态方法中不能直接访问非静态成员，因为静态方法运行时不确定“当前对象”是哪一个。

## 5.对象数组与电影管理系统：

数组也可以存放对象引用：

```java
Movie[] movies = new Movie[5];
movies[0] = new Movie(10101, "Oppenheimer", 100);
```

数组创建后每个位置初始为 `null`。电影管理系统用 `index` 表示已存入电影的数量，也表示下一部电影应放入的位置：

```java
movies[index++] = movie;
```

系统提供两个同名的 `addMovie()` 方法：一个接收 `Movie` 对象，另一个接收电影的三个属性后创建对象。这是方法重载的实际使用。

扩容时不能改变旧数组的长度，而是创建新数组、复制旧数据、再让变量指向新数组：

```java
Movie[] newMovies = new Movie[newSize];
for (int i = 0; i < index; i++) {
    newMovies[i] = movies[i];
}
movies = newMovies;
```

查找电影时，只有找到目标 `id` 才应立即返回；“未找到”的提示必须写在整个循环之后。若写在循环内部，第一次不匹配就会过早结束查找。

```java
for (int i = 0; i < index; i++) {
    if (id == movies[i].getId()) {
        System.out.println("查找到电影");
        return;
    }
}
System.out.println("未查找到该 id");
```

## 6.本阶段总结：

| 概念 | 作用 |
| --- | --- |
| 类 | 对象的设计图，定义属性和方法 |
| 对象 | 用 `new` 从类创建出的具体实例 |
| 构造方法 | 创建对象时初始化成员数据 |
| `this` | 当前对象，用于区分成员与同名参数 |
| 封装 | 私有化数据，通过方法控制访问和校验 |
| `static` | 类共享的成员，可用类名直接访问 |
| 对象数组 | 用数组统一管理多个同类型对象 |
