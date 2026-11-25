azxd# 面向对象与接口实践笔记

本练习使用面向对象编程实现一个简单的智能家居控制系统。系统可以保存不同类型的设备、显示设备状态，并根据用户选择切换指定设备的开关状态。

## 1.系统结构：

```text
Switch（接口：规定 press()）
    ↑ implements
Device（设备父类：名称、状态、开关逻辑）
    ├─ Lamp
    ├─ Television
    ├─ WashMachine
    └─ AirCondition

Status（枚举：OPEN、CLOSE）
SmartHomeControl（单例：统一控制所有设备）
```

各个类分工明确：设备类保存数据，接口规定开关能力，枚举限制状态取值，控制器负责操作设备。

## 2.接口与公共设备父类：

`Switch` 接口规定设备必须具备开关功能：

```java
public interface Switch {
    void press();
}
```

`Device` 实现接口，并统一完成状态切换逻辑：

```java
public class Device implements Switch {
    private String name;
    private Status status = Status.CLOSE;

    @Override
    public void press() {
        if (status == Status.CLOSE) {
            status = Status.OPEN;
        } else {
            status = Status.CLOSE;
        }
    }
}
```

因为父类已经实现 `press()`，`Lamp`、`Television` 等子类会继承该方法，不必重复实现。如果某种设备以后有特殊的开关行为，可以在子类中重写 `press()`。

## 3.封装与构造方法：

`Device` 将 `name`、`status` 声明为 `private`，外部通过 getter、setter 访问，体现了封装。

```java
private String name;
private Status status = Status.CLOSE;
```

状态在成员变量处默认初始化为 `CLOSE`，因此只传入设备名称时，设备默认关闭：

```java
new AirCondition("HaiEr AirCondition");
```

子类构造方法使用 `super(...)` 调用父类构造方法：

```java
public Lamp(String name, Status status) {
    super(name, status);
}
```

这样名称和状态的初始化集中在 `Device` 中，子类不需要重复代码。

## 4.枚举表示设备状态：

设备状态只有打开和关闭两种固定值，适合使用枚举：

```java
public enum Status {
    CLOSE,
    OPEN
}
```

相比使用字符串，`Status` 能限制取值范围，避免出现 `"open"`、`"OPEN "` 等不统一的数据。

```java
if (status == Status.CLOSE) {
    status = Status.OPEN;
}
```

枚举常量是固定对象，可以使用 `==` 比较。

## 5.继承与多态数组：

虽然四种设备的具体类型不同，但它们都继承 `Device`，因此可以放进同一个父类数组：

```java
Device[] devices = new Device[4];
devices[0] = new Lamp("Big Lamp", Status.CLOSE);
devices[1] = new WashMachine("XiaoMi WashMachine", Status.OPEN);
devices[2] = new Television("SkyWatch Television", Status.OPEN);
devices[3] = new AirCondition("HaiEr AirCondition");
```

这里每个数组元素的编译类型是 `Device`，实际对象可以是不同的设备子类。这是继承多态的体现。

控制方法同样使用父类类型接收不同设备：

```java
public void control(Device device) {
    System.out.println(device.getName() + "现在状态为：" + device.getStatus());
    device.press();
    System.out.println("已更改为：" + device.getStatus());
}
```

调用时可以传入任意 `Device` 子类对象。若某个子类将来重写 `press()`，运行时会执行该子类的实现。

当前 `control()` 的参数类型是 `Device`，所以这里主要体现的是继承多态；`Switch` 接口负责规定设备的开关能力。

## 6.单例控制器：

智能家居控制器采用饿汉式单例，整个程序共享同一个控制器对象：

```java
public class SmartHomeControl {
    private static final SmartHomeControl INSTANCE =
            new SmartHomeControl();

    private SmartHomeControl() {}

    public static SmartHomeControl getInstance() {
        return INSTANCE;
    }
}
```

它包含单例模式的三个关键点：

1.构造方法私有化，外部不能随意 `new`。
2.类内部保存唯一的静态对象。
3.通过静态方法返回该对象。

使用时：

```java
SmartHomeControl control = SmartHomeControl.getInstance();
```

## 7.显示状态与用户选择：

`printAllStatus()` 遍历设备数组，显示编号、设备名和当前状态：

```java
for (int i = 0; i < devices.length; i++) {
    System.out.println((i + 1) + "：" +
            devices[i].getName() + "，状态：" +
            devices[i].getStatus());
}
```

用户输入的序号从 `1` 开始，数组下标从 `0` 开始，因此控制设备时要减一：

```java
control(devices[index - 1]);
```

合法范围是：

```java
index > 0 && index <= devices.length
```

程序使用 `hasNextInt()` 判断输入是否为整数，并在错误时取走无效输入，避免循环反复读取同一内容。

## 8.`Scanner` 的使用改进：

当前 `choose()` 在 `while` 循环中反复执行 `new Scanner(System.in)`。同一个程序通常只创建一个读取键盘的 `Scanner`，再作为参数传入方法：

```java
Scanner sc = new Scanner(System.in);
control.choose(devices, sc);
sc.close();
```

```java
public void choose(Device[] devices, Scanner sc) {
    while (true) {
        System.out.print("请选择要控制的设备：");

        if (sc.hasNextInt()) {
            int index = sc.nextInt();
            if (index > 0 && index <= devices.length) {
                control(devices[index - 1]);
                return;
            }
        } else {
            sc.next();
        }

        System.out.println("输入不合法，请重新输入！");
    }
}
```

这样资源由创建它的地方统一管理，也避免多个 `Scanner` 同时读取同一个 `System.in`。

## 9.练习总结：

| 已学技术 | 在练习中的应用 |
| --- | --- |
| 封装 | `Device` 私有化名称和状态 |
| 构造方法 | 创建不同初始状态的设备 |
| 继承 | 四种具体设备继承 `Device` |
| 接口 | `Switch` 规定 `press()` 开关行为 |
| 方法重写 | `Device` 实现接口方法，子类以后也可重写 |
| 枚举 | `Status` 限制状态只能为打开或关闭 |
| 多态 | `Device[]` 和 `control(Device)` 接收不同子类对象 |
| 单例模式 | 全程序通过同一个 `SmartHomeControl` 控制设备 |
| 数组和循环 | 统一保存、显示和选择设备 |
| 输入校验 | 检查输入类型和设备序号范围 |

这个练习的核心是：把共同数据和逻辑放在父类中，用接口规定能力，用枚举限制状态，再通过多态让控制器统一操作各种设备。
