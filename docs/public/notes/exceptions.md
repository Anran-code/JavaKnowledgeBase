# Java 异常笔记

本章对应 `13-collection/src/com/ranan/exception` 中的练习：认识常见异常、`try-catch`、`throw` 与 `throws`、自定义异常，以及两种异常处理思路。

## 1.异常是什么：

异常表示程序运行过程中出现了不正常的情况。例如数组下标越界、除数为零、调用 `null` 对象的方法，或者把不符合格式的字符串解析成日期。

你的 `ExceptionDemo1` 中列出了三种常见运行时异常：

| 异常 | 典型原因 |
| --- | --- |
| `ArrayIndexOutOfBoundsException` | 访问数组范围外的下标 |
| `ArithmeticException` | 整数除以零等非法算术运算 |
| `NullPointerException` | 对 `null` 引用调用方法或访问成员 |

如果异常一直没有被捕获，会沿方法调用链向上传播；最终仍无人处理时，当前线程会因异常结束。

## 2.受检异常和运行时异常：

主要看异常类继承自谁：

```text
Exception
├── RuntimeException → 运行时异常（非受检异常）
└── 其他 Exception 子类 → 受检异常（常称“编译时异常”）
```

| 类型 | 示例 | 编译器要求 |
| --- | --- | --- |
| 受检异常 | `ParseException`、`IOException` | 必须 `catch`，或用 `throws` 继续声明 |
| 运行时异常 | `ArithmeticException`、`NullPointerException` | 可以 `catch` 或声明 `throws`，但都不是必须的 |

“编译时异常”不是说异常在编译时发生。两类异常都可能在**运行时**发生，区别是编译器是否强制你处理或声明。

在 `ExceptionDemo1.show2()` 中，`SimpleDateFormat.parse(str)` 可能抛出受检异常 `ParseException`，所以方法声明了 `throws ParseException`；调用它的 `main()` 则使用 `try-catch` 处理。

## 3.`try-catch`：在当前地方处理异常

```java
try {
    show2();
} catch (ParseException e) {
    e.printStackTrace();
}
```

`try` 中的代码正常执行时，不进入 `catch`。如果发生匹配的异常，就跳到对应的 `catch`；`try` 中发生异常位置之后的语句不会继续执行。

`ExceptionDemo2` 在 `main()` 中捕获了 `div(10, 0)` 抛出的 `ArithmeticException`，因此可以打印失败信息，然后继续执行后面的“程序结束执行...”。

常见的异常信息方法：

| 写法 | 作用 |
| --- | --- |
| `e.getMessage()` | 获取创建异常时传入的消息 |
| `e.printStackTrace()` | 打印异常类型、消息和调用位置，便于排查问题 |

## 4.`throw` 与 `throws`：

| 关键字 | 写在哪里 | 含义 |
| --- | --- | --- |
| `throw` | 方法体内 | 实际抛出**一个异常对象** |
| `throws` | 方法声明的参数列表后 | 声明方法可能抛出的异常类型，把处理责任交给调用者 |

`ExceptionDemo2.div()` 主动抛出运行时异常：

```java
public static int div(int a, int b) {
    if (b == 0) {
        throw new ArithmeticException("除数不能为零");
    }
    return a / b;
}
```

运行时异常可以只写 `throw`，不写 `catch` 或 `throws`。但这不表示异常被处理了；调用者仍可选择捕获它。

受检异常则必须在**当前方法**用 `try-catch` 捕获，或者在方法声明后写 `throws`。例如 `ExceptionDemo3`：

```java
public static void saveAge(int age) throws AgeIllegalException {
    if (age < 1 || age > 200) {
        throw new AgeIllegalException("年龄非法");
    }
}
```

这里 `throw` 真正抛出异常，`throws` 告诉调用者可能收到 `AgeIllegalException`。`throws` **并没有处理异常**：调用 `saveAge()` 的地方仍需 `catch` 或继续 `throws`。

特别注意：`throw new Exception("出错了")` 抛出的是**受检异常**，因为 `Exception` 本身不是 `RuntimeException`；不能把它当作“运行时异常可以直接抛”的例子。

## 5.自定义异常：

当现成异常不能清楚表达业务问题时，可以定义异常类。你的年龄练习分别写了两种：

```java
public class AgeIllegalException extends Exception {
    public AgeIllegalException(String message) {
        super(message);
    }
}

public class AgeIllegalRuntimeException extends RuntimeException {
    public AgeIllegalRuntimeException(String message) {
        super(message);
    }
}
```

`super(message)` 把错误信息交给父类保存，之后可以通过 `getMessage()` 取得。

`saveAge(300)` 抛出受检异常，方法声明 `throws AgeIllegalException`，`main()` 用 `catch` 捕获；`saveAge2(300)` 抛出运行时异常，方法不必写 `throws`。你当前的 `main()` 没有捕获 `saveAge2(300)` 的异常，所以运行到这里会以未捕获异常结束。

**记忆方法：先看继承关系，再看处理要求；`throw` 是“抛出来”，`throws` 是“提前声明可能抛出来”。**

## 6.处理思路一：向外抛，在合适的边界统一处理

`ExceptionDemo4` 的 `show2()` 负责解析日期，声明 `throws ParseException`；最外层的 `main()` 用 `try-catch` 接住它：

```java
public static void show2() throws ParseException {
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    Date date = sdf.parse("2026-10-28 12:00:00");
    System.out.println(date);
}

public static void main(String[] args) {
    try {
        show2();
    } catch (ParseException e) {
        e.printStackTrace();             // 给开发者排查问题
        System.out.println("日期格式错误"); // 给使用者看
    }
}
```

这样底层方法不必决定怎么向用户提示，调用它的上层可以统一记录错误并作出回应。你的 `Demo4` 使用 `catch (Exception e)`，也能捕获 `ParseException`，但这里只知道可能出现 `ParseException` 时，捕获更具体的类型更清晰。另外，当前源码只调用了 `printStackTrace()`，还没有真正输出友好的用户提示。

## 7.处理思路二：捕获后让用户重试

`ExceptionDemo5` 的目标是不断读取定价：输入成功就 `break` 退出循环，输入不合法则捕获异常，提示用户重新输入。

```java
Scanner sc = new Scanner(System.in);
while (true) {
    try {
        double price = sc.nextDouble();
        System.out.println("设置了定价：" + price);
        break; // 成功后结束重试
    } catch (InputMismatchException e) {
        sc.nextLine(); // 消费这次输入的错误内容，避免下次又读到它
        System.out.println("请输入数字");
    }
}
```

这里需要导入 `java.util.Scanner` 和 `java.util.InputMismatchException`。`nextDouble()` 遇到非数字时抛出的 `InputMismatchException` 是**运行时异常**，虽然不强制捕获，但为了让用户重新输入，这里主动 `catch` 它。

你的 `Demo5` 在每次循环中重新创建 `Scanner`，且输入错误后没有消费错误内容，可能反复遇到同一次非法输入，无法顺利重试。更稳妥的做法是**循环外只创建一个 `Scanner`，捕获后跳过错误输入**。普通输入错误通常给用户简短提示即可，不必每次都打印完整堆栈。

### 也可以在 `userInputPrice()` 内部重试

如果希望“读取价格”这个方法自己解决输错的问题，可以把循环和 `try-catch` 一起放进方法里：

```java
public static double userInputPrice() {
    Scanner sc = new Scanner(System.in);
    while (true) {
        System.out.println("请输入定价:");
        try {
            return sc.nextDouble(); // 读对了，直接返回
        } catch (InputMismatchException e) {
            sc.nextLine(); // 丢弃本次错误输入
            System.out.println("请输入数字，重新试一次");
        }
    }
}
```

这样调用者不需要再为**非数字输入**写重试循环，因为这个方法已经能恢复。不要只捕获并打印一句话就结束：返回类型是 `double`，方法仍必须成功返回一个价格，或继续向外抛出异常。

两种思路并不矛盾：**当前层能合理恢复（如重新输入）就处理；不能恢复时，向上交给更合适的调用者处理。**

## 8.项目中一定要处处 `try-catch` 吗？

不需要。判断标准是：**当前这一层能不能妥善处理这个问题？**

| 当前层的情况 | 常见做法 |
| --- | --- |
| 能修复、重试或给用户明确提示 | 在这里 `catch`，采取相应行动 |
| 不知道如何处理，但上层可能知道 | 不在这里捕获，让异常向调用者传播 |
| 只是为了让编译通过而捕获，捕获后什么也不做 | 不推荐，会把问题藏起来 |

在图书系统里可以这样对照：

| 情况 | 当前项目的做法 | 为什么 |
| --- | --- | --- |
| 充值金额输入了文字 | 界面 `catch NumberFormatException` | 界面能提示用户重新输入 |
| 注册参数不合法或用户名重复 | `LibraryData.registerUser()` 抛出 `IllegalArgumentException`；登录界面调用前也先检查 | 数据层守住规则，界面决定如何提示 |
| 库存不足或余额不足，借书不成功 | `rentBook()` 返回 `false` | 这是预期内的业务结果，不一定要抛异常 |

目前注册界面主要通过事先 `if` 检查来提示，**不是**捕获 `registerUser()` 抛出的异常；以后若增加其他注册入口，也要考虑在合适的边界处理这种异常。

**失败不一定要靠异常表示；如果已经抛出异常，也不一定要在抛出的地方捕获。**可以用条件判断或返回值处理预期情况；真正需要捕获时，选择能修复或回应用户的那一层。

例如图书系统的充值输入：界面知道如何提示用户，因此可以在界面事件中捕获数字格式异常；底层方法则不必到处重复写 `try-catch`。

```java
try {
    double amount = Double.parseDouble(input);
    member.topUp(amount);
} catch (NumberFormatException e) {
    JOptionPane.showMessageDialog(this, "请输入数字金额");
}
```

这里的示例只演示异常处理；实际充值时还要检查金额是否大于零等业务条件。像“余额不足”“没有可借库存”这类**预期内的业务结果**，也可以像当前项目那样用 `false` 返回并显示提示，不必一律设计成异常。

### “不在这里捕获”不是“忽略异常”

不捕获表示让异常沿调用链继续向上找处理者。受检异常需要用 `throws` 明确声明；运行时异常即使不写 `throws` 也会自动向上传播。`throws` 只是转交处理责任，不会让错误消失。

如果一直没有人捕获，发生异常的位置以及当前调用链中尚未执行的代码都会被跳过：

```java
static void save(boolean fail) {
    if (fail) {
        throw new IllegalStateException("保存失败");
    }
    System.out.println("保存完成");
}

static void submit() {
    save(true);
    System.out.println("提交完成"); // 不会执行
}
```

若调用 `submit()` 的上层有匹配的 `catch`，程序会跳到那里处理；若最终仍无人捕获，当前线程会因未捕获异常结束。“当前操作中断”**不一定等于整个程序退出**，例如 GUI 窗口可能还在，但这一次按钮操作没有完成。

**总结：受检异常在编译时必须 `catch` 或声明 `throws`；运行时异常没有这项强制要求。项目中不必层层捕获，但不能捕获后假装没事；在能够恢复或回应用户的位置处理，其他层让它向上传递。**
