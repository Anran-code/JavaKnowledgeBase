# Java GUI 编程

## 1.GUI 是什么：

GUI（Graphical User Interface）表示图形用户界面。它通过窗口、按钮、文本框等图形组件让用户操作程序，而不是只在控制台中输入和输出。

Java 中常见的 GUI 工具包有：

- `AWT`：Java 早期的 GUI 工具包，类主要位于 `java.awt` 包中。
- `Swing`：在 AWT 基础上发展而来，提供了更丰富的组件，类主要位于 `javax.swing` 包中。

Swing 组件的类名通常以 `J` 开头，例如：

```text
JFrame：窗口
JPanel：面板
JButton：按钮
```

本阶段主要使用 Swing 创建组件，使用 AWT 中的布局管理器排列组件：

```java
import javax.swing.*;
import java.awt.*;
```

## 2.创建基本窗口：

`JFrame` 表示一个可以显示在桌面上的窗口。

```java
JFrame frame = new JFrame("登录窗口");
frame.setSize(400, 300);
frame.setLocationRelativeTo(null);
frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
frame.setVisible(true);
```

常用方法：

| 方法 | 作用 |
| --- | --- |
| `setSize(width, height)` | 设置窗口的宽度和高度 |
| `setLocation(x, y)` | 设置窗口左上角的位置 |
| `setLocationRelativeTo(null)` | 让窗口在屏幕中央显示 |
| `setTitle(title)` | 修改窗口标题 |
| `setResizable(boolean)` | 设置是否允许用户调整窗口大小 |
| `setDefaultCloseOperation(operation)` | 设置关闭窗口时执行的操作 |
| `setVisible(true)` | 显示窗口 |

一般把 `setVisible(true)` 放在组件和布局设置完成之后，最后再显示窗口。

### 关闭窗口的方式

```java
frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
```

`EXIT_ON_CLOSE` 表示关闭窗口时结束整个程序，适合当前这种只有一个主窗口的练习。

其他常见选项：

| 选项 | 作用 |
| --- | --- |
| `JFrame.EXIT_ON_CLOSE` | 关闭窗口并结束程序 |
| `JFrame.DISPOSE_ON_CLOSE` | 销毁当前窗口，但不一定结束整个程序 |
| `JFrame.HIDE_ON_CLOSE` | 隐藏窗口 |
| `JFrame.DO_NOTHING_ON_CLOSE` | 点击关闭按钮时不自动执行操作 |

## 3.容器和组件：

GUI 中可以把对象简单分为两类：

- 容器：用来装其他组件，例如 `JFrame`、`JPanel`。
- 组件：界面中的具体内容，例如 `JButton`。

```java
JFrame frame = new JFrame("登录窗口");

JPanel panel = new JPanel();
frame.add(panel);

JButton button = new JButton("登录");
panel.add(button);
```

它们的包含关系是：

```text
JFrame 窗口
└── JPanel 面板
    └── JButton 按钮
```

`JPanel` 本身不会形成一个独立窗口，通常用于把一组组件组织在一起，再放进 `JFrame`。

### 什么时候用 `JPanel`？

`JPanel` 相当于窗口中的一块区域：它可以装多个组件，为这组组件单独设置布局、背景等，也可以把整块区域一次放进窗口。`JPanel` 不是每个窗口都必须有的一层。

在 `JFrameDemo1` 中，按钮先放到 `JPanel`，再把面板放到窗口：

```java
JPanel panel = new JPanel(); // 默认是 FlowLayout
panel.add(new JButton("登录"));
frame.add(panel);            // JFrame 的内容区域默认是 BorderLayout
```

这样按钮按面板的流式布局显示，保持正常大小。如果直接写 `frame.add(new JButton("登录"))`，按钮会进入窗口默认布局的 `CENTER` 区域，随该区域拉伸。

而 `FlowLayoutExample` 和 `GridLayoutExample` 已经给整个窗口设置了所需布局，按钮可以直接 `frame.add(...)`。`BorderLayoutExample` 则直接指定窗口中的 `NORTH`、`CENTER` 等区域，所以也不需要额外面板。

当不同区域需要**不同布局**，或者多个组件需要**作为一组**管理时，就使用 `JPanel`。例如窗口使用 `BorderLayout`，上方的面板使用 `FlowLayout` 放按钮，中间的面板使用 `GridLayout` 放输入区域。你的 `BoxLayoutExample` 用面板管理一组垂直排列的按钮和间隔，最后再把整个面板放入窗口。

简单判断：**整个窗口一种布局、无需分组，可以直接添加组件；要分区、分组或组合布局，就使用 `JPanel`。**

## 4.布局管理器：

布局管理器负责决定组件的排列位置和大小。

```java
frame.setLayout(new FlowLayout());
```

使用布局管理器后，通常不需要自己计算每个按钮的坐标。当窗口大小发生变化时，布局管理器也会重新安排组件。

本阶段学习了四种布局：

| 布局管理器 | 排列特点 |
| --- | --- |
| `FlowLayout` | 从左到右依次排列，空间不足时换行 |
| `BorderLayout` | 分为上、下、左、右、中五个区域 |
| `GridLayout` | 按行列划分为大小相同的网格 |
| `BoxLayout` | 沿水平轴或垂直轴依次排列 |

## 5.FlowLayout 流式布局：

`FlowLayout` 会按照添加顺序，从左到右排列组件；一行空间不足时自动换行。

```java
frame.setLayout(new FlowLayout());

frame.add(new JButton("Button1"));
frame.add(new JButton("Button2"));
frame.add(new JButton("Button3"));
```

特点：

- 组件通常按照自身合适的大小显示。
- 默认居中排列。
- 适合按钮较少、排列要求简单的界面。
- `JPanel` 默认使用 `FlowLayout`。

可以设置对齐方式和间距：

```java
frame.setLayout(new FlowLayout(FlowLayout.LEFT, 10, 10));
```

三个参数分别表示：对齐方式、水平间距、垂直间距。

## 6.BorderLayout 边界布局：

`BorderLayout` 把容器划分为五个区域：

```text
┌─────────────────────────┐
│          NORTH          │
├──────┬───────────┬──────┤
│ WEST │  CENTER   │ EAST │
├──────┴───────────┴──────┤
│          SOUTH          │
└─────────────────────────┘
```

```java
frame.setLayout(new BorderLayout());

frame.add(new JButton("North"), BorderLayout.NORTH);
frame.add(new JButton("South"), BorderLayout.SOUTH);
frame.add(new JButton("East"), BorderLayout.EAST);
frame.add(new JButton("West"), BorderLayout.WEST);
frame.add(new JButton("Center"), BorderLayout.CENTER);
```

特点：

- 每个区域通常放置一个组件或容器。
- `CENTER` 会占用剩余空间。
- 某些区域没有添加组件时，其他区域会自动占用更多空间。
- `JFrame` 的内容区域默认使用 `BorderLayout`。
- 添加组件时没有指定区域，默认会放到 `CENTER`。

## 7.GridLayout 网格布局：

`GridLayout` 将容器划分成规则网格，所有格子的大小相同。

```java
frame.setLayout(new GridLayout(2, 3));

frame.add(new JButton("Button1"));
frame.add(new JButton("Button2"));
frame.add(new JButton("Button3"));
frame.add(new JButton("Button4"));
frame.add(new JButton("Button5"));
frame.add(new JButton("Button6"));
```

`new GridLayout(2, 3)` 表示两行三列，组件按照添加顺序依次放入网格。

特点：

- 所有组件的显示大小相同。
- 适合计算器按键、棋盘等规则网格界面。
- 组件数量较多时，布局会根据行列设置自动调整。

也可以指定水平和垂直间距：

```java
frame.setLayout(new GridLayout(2, 3, 10, 10));
```

四个参数依次表示：行数、列数、水平间距、垂直间距。

## 8.BoxLayout 箱式布局：

`BoxLayout` 可以让组件沿一个方向依次排列。

```java
JPanel panel = new JPanel();
panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));

panel.add(new JButton("Button1"));
panel.add(Box.createVerticalStrut(10));
panel.add(new JButton("Button2"));

frame.add(panel);
```

创建 `BoxLayout` 时，需要传入它所管理的容器：

```java
new BoxLayout(panel, BoxLayout.Y_AXIS)
```

排列方向：

| 常量 | 作用 |
| --- | --- |
| `BoxLayout.X_AXIS` | 沿水平方向排列 |
| `BoxLayout.Y_AXIS` | 沿垂直方向排列 |

用于控制间距的方法：

| 方法 | 作用 |
| --- | --- |
| `Box.createHorizontalStrut(width)` | 创建固定宽度的水平间隔 |
| `Box.createVerticalStrut(height)` | 创建固定高度的垂直间隔 |
| `Box.createHorizontalGlue()` | 创建可以伸缩的水平空间 |
| `Box.createVerticalGlue()` | 创建可以伸缩的垂直空间 |

你使用的代码：

```java
panel.add(Box.createVerticalStrut(10));
```

表示在上下两个组件之间加入 `10` 像素的垂直间隔。

## 9.嵌套面板与组合布局：

一个复杂界面通常不会只使用一种布局，而是将多个 `JPanel` 嵌套起来，每个面板使用适合自己的布局。

```java
JFrame frame = new JFrame();
frame.setLayout(new BorderLayout());

JPanel topPanel = new JPanel(new FlowLayout());
topPanel.add(new JButton("按钮1"));
topPanel.add(new JButton("按钮2"));

JPanel centerPanel = new JPanel(new GridLayout(2, 2));
centerPanel.add(new JButton("A"));
centerPanel.add(new JButton("B"));
centerPanel.add(new JButton("C"));
centerPanel.add(new JButton("D"));

frame.add(topPanel, BorderLayout.NORTH);
frame.add(centerPanel, BorderLayout.CENTER);
```

核心思路是：

```text
先将组件放进小面板
再将小面板放进大容器
每一层容器可以使用不同的布局管理器
```

## 10.你的 GUI 代码总结：

`JFrameDemo1` 完成了：

- 创建并显示窗口。
- 设置窗口大小、居中位置和关闭方式。
- 将 `JPanel` 添加到窗口。
- 将 `JButton` 添加到面板。

另外四个示例分别演示了：

```text
FlowLayoutExample   → 流式排列
BorderLayoutExample → 五区域排列
GridLayoutExample   → 网格排列
BoxLayoutExample    → 水平或垂直排列
```

`com.ranan.event.Test` 又练习了按钮点击事件、键盘事件，以及焦点对键盘事件的影响。

## 11.事件监听：

组件本身只负责显示；用户点击按钮、按下按键时，程序会产生相应的**事件**。给组件添加监听器，就能在事件发生时执行代码。

### 按钮点击事件

你在 `Test` 中给“登录”按钮添加了 `ActionListener`：

```java
jb.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent e) {
        JOptionPane.showMessageDialog(jf, "有人点击了登录");
    }
});
```

- `addActionListener(...)`：给按钮注册动作监听器。
- `actionPerformed(ActionEvent e)`：按钮被点击时执行的方法。
- `e`：本次事件的信息；暂时用不到时可以先不读取。
- `JOptionPane.showMessageDialog(...)`：弹出消息对话框。

这里使用匿名内部类创建监听器。你已经学过 Lambda；因为 `ActionListener` 是函数式接口，简单场景也可以写成：

```java
jb.addActionListener(e -> JOptionPane.showMessageDialog(jf, "有人点击了登录"));
```

## 12.键盘焦点与 KeyListener：

**键盘焦点**表示当前由哪个组件接收键盘输入。窗口处于活动状态，并不等于 `JFrame` 自己拥有键盘焦点；点击按钮后，按钮可能成为焦点组件。

最初你把 `KeyListener` 注册在 `JFrame` 上：

```java
jf.addKeyListener(new KeyAdapter() {
    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_UP) {
            System.out.println("up");
        }
    }
});

jf.setVisible(true);
jf.requestFocus();
```

`KeyAdapter` 允许只重写关心的 `keyPressed()`，不用写完 `KeyListener` 的全部方法；`getKeyCode()` 得到按键编码，`KeyEvent.VK_UP` 代表上箭头。

之所以需要 `requestFocus()`，是因为监听器加在 `jf` 上，`jf` 需要取得键盘焦点才能接收这个键盘事件。把调用放在 `setVisible(true)` 后面，是因为窗口显示后才可能获得焦点。`requestFocus()` 只是提出请求，不能保证一定成功；之后点击按钮也可能让焦点转移到按钮。

## 13.按键绑定：

要让方向键在**窗口处于活动状态**时都能起作用，可以使用 Swing 的按键绑定。当前 `Test` 把方向键绑定在窗口的 `rootPane` 上，不需要再调用 `requestFocus()`：

```java
bindArrowKey(jf.getRootPane(), KeyEvent.VK_UP, "up");
```

`bindArrowKey` 是我们自己写的辅助方法，不是 Java 自带的 API。三个参数分别是：绑定到哪个窗口、监听哪个键、执行时打印什么。方法内部建立两层对应关系：

```text
InputMap：按下上箭头 → 找到名为 "up" 的操作
ActionMap："up" 操作 → 执行打印 "up" 的代码
```

关键设置是 `JComponent.WHEN_IN_FOCUSED_WINDOW`：窗口处于活动状态时，即使按钮拥有键盘焦点，这个绑定仍可生效。原理可以先记住：**KeyListener 依赖监听目标的键盘焦点；按键绑定可以指定在窗口活动时生效。**

## 14.事件监听器的几种写法：

`addActionListener(...)` 需要的是一个 `ActionListener` 对象。你在 `Test`、`Test2` 和 `LoginFrame` 中见到了几种提供这个对象的方法：

| 写法 | 代码形式 | 适合的情况 |
| --- | --- | --- |
| 单独的实现类 | `new MyActionListener(jf)` | 处理逻辑较多、需要复用 |
| 匿名内部类 | `new ActionListener() { ... }` | 在注册处直接写完整实现 |
| Lambda | `e -> { ... }` | 接口只有一个抽象方法，逻辑较短 |
| 窗口自己实现接口 | `jb.addActionListener(this)` | 窗口自身处理自己的事件 |

在 `Test2` 中，`MyActionListener implements ActionListener`，所以可以把它的对象交给按钮：

```java
jb.addActionListener(new MyActionListener(jf));
```

`jf` 通过构造方法传给监听器，因此 `MyActionListener` 中的 `actionPerformed()` 可以用它作为弹窗的父窗口。`Test2` 注释掉的 `e -> { ... }` 是 **Lambda 表达式**，与匿名内部类有关联，但不是匿名内部类的语法。

## 15.让窗口自己成为监听器：

`Test3` 创建 `LoginFrame`；这个自定义类既继承了 `JFrame`，又实现了 `ActionListener`：

```java
public class LoginFrame extends JFrame implements ActionListener {
    @Override
    public void actionPerformed(ActionEvent e) {
        JOptionPane.showMessageDialog(this, "Login!");
    }

    private void init() {
        JPanel panel = new JPanel();
        JButton jb = new JButton("Login");
        jb.addActionListener(this);
        panel.add(jb);
        this.add(panel);
    }
}
```

这里的 `this` 始终指向**当前这个 `LoginFrame` 对象**。因为它继承 `JFrame`，`this.add(panel)` 可以调用窗口添加组件的方法；因为它实现 `ActionListener`，`jb.addActionListener(this)` 可以把同一个对象注册为按钮监听器。`showMessageDialog(this, ...)` 中又把它当作弹窗的父窗口。

```text
点击按钮
→ JButton 通知已注册的 ActionListener（即当前 LoginFrame 对象）
→ 调用这个对象的 actionPerformed(e)
→ 弹出对话框
```

`addActionListener(this)` **只负责注册**，执行到这一行时不会立刻调用 `actionPerformed()`。这里体现了接口多态：方法要求 `ActionListener`，而 `LoginFrame` 实现了该接口，所以同一个 `LoginFrame` 对象可以直接传入，无需再创建监听器对象。

这个写法很适合当前只有一个按钮的小窗口。如果多个按钮都注册 `this`，它们会进入同一个 `actionPerformed()`，可以通过 `e.getSource()` 判断事件来自哪个按钮；界面变复杂时，也可以分别使用 Lambda 或独立监听器。

## 16.JLabel、JTextField 和 JPasswordField：

这三个组件分别负责**显示提示文字**、**输入普通文本**和**输入密码**。你的登录界面中，登录名一行使用 `JLabel + JTextField`，密码一行使用 `JLabel + JPasswordField`。

```java
JLabel loginNameLabel = new JLabel("登录名：");
JTextField loginNameField = new JTextField(15);

JLabel passwordLabel = new JLabel("密码：");
JPasswordField passwordField = new JPasswordField(15);

JPanel formPanel = new JPanel(new GridLayout(2, 2, 10, 15));
formPanel.add(loginNameLabel);
formPanel.add(loginNameField);
formPanel.add(passwordLabel);
formPanel.add(passwordField);
```

`new JTextField(15)` 和 `new JPasswordField(15)` 中的 `15` 表示**列数**，用于计算输入框的合适宽度，不是最多只能输入 15 个字符。组件最终显示的大小仍受布局管理器影响。

### JLabel：显示文字

```java
JLabel label = new JLabel("登录名：");
label.setText("账号：");
label.setFont(new Font("宋体", Font.PLAIN, 18));
label.setForeground(Color.BLUE);
label.setHorizontalAlignment(SwingConstants.RIGHT);
```

`JLabel` 用来显示说明文字，用户不能像输入框那样直接编辑它。`setFont()` 设置字体、样式和字号，`setForeground()` 设置文字颜色，`setHorizontalAlignment()` 设置文字在标签区域内的水平对齐方式。

### JTextField：输入单行普通文本

```java
String loginName = loginNameField.getText().trim();
loginNameField.setText(""); // 清空输入框
```

`getText()` 取得输入内容；`trim()` 去掉首尾空格。`setText()` 可以填入或清空内容。你把登录名输入框保存为 `LoginFrame` 的成员变量，这样按钮事件处理方法也能读取它。

### JPasswordField：输入密码

```java
char[] passwordChars = passwordField.getPassword();
String password = new String(passwordChars); // 当前练习中便于与用户密码比较
passwordField.setText("");                  // 清空输入框
```

`JPasswordField` 是密码输入框，输入时通常显示掩码字符。它继承自 `JTextField`，但读取密码推荐用 `getPassword()`，得到 `char[]`；不要用 `getText()` 读取密码。你的当前练习将字符数组转为 `String`，用于和内存中的用户密码比较。

## 17.常用 API 汇总：

| 对象 | 常用 API | 作用 |
| --- | --- | --- |
| `JFrame` | `new JFrame(title)` | 创建带标题的窗口 |
| `JFrame` | `setSize(width, height)` | 设置窗口大小 |
| `JFrame` | `setLocationRelativeTo(null)` | 窗口居中 |
| `JFrame` | `setDefaultCloseOperation(...)` | 设置关闭行为 |
| `JFrame` | `setLayout(layout)` | 设置布局管理器 |
| `JFrame` | `add(component)` | 添加组件 |
| `JFrame` | `setVisible(true)` | 显示窗口 |
| `JPanel` | `new JPanel()` | 创建面板 |
| `JPanel` | `setLayout(layout)` | 设置面板的布局 |
| `JPanel` | `add(component)` | 向面板添加组件 |
| `JButton` | `new JButton(text)` | 创建按钮 |
| `JButton` | `addActionListener(listener)` | 注册按钮动作监听器 |
| `JLabel` | `new JLabel(text)`、`setText(text)` | 创建或修改提示文字 |
| `JLabel` | `setFont(font)`、`setForeground(color)` | 设置字体、字号和文字颜色 |
| `JTextField` | `new JTextField(columns)`、`getText()`、`setText(text)` | 创建单行输入框、读取或修改内容 |
| `JPasswordField` | `new JPasswordField(columns)`、`getPassword()` | 创建密码输入框、读取密码字符数组 |
| `ActionEvent` | `getSource()` | 获取触发事件的对象 |
| `JOptionPane` | `showMessageDialog(parent, message)` | 显示消息对话框 |
| `JFrame` | `requestFocus()` | 请求让窗口获得键盘焦点，不保证成功 |
| `KeyEvent` | `getKeyCode()` | 获取按键编码 |
| `JRootPane` | `getInputMap(...)`、`getActionMap()` | 建立按键与操作的绑定 |
| `Box` | `createVerticalStrut(height)` | 创建固定垂直间距 |

最重要的使用原则：

```text
JFrame 是窗口，JPanel 是用来组织组件的面板
组件使用 add() 放入容器
布局管理器决定组件的位置和大小
复杂界面可以通过嵌套 JPanel 组合多种布局
通常完成所有组件和布局设置后，最后调用 setVisible(true)
按钮的点击操作通过事件监听器实现
键盘事件与焦点有关；窗口范围的快捷键可使用按键绑定
窗口类实现 ActionListener 后，可以把 this 注册为自身按钮的监听器
```
