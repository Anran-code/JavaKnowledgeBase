# 实战01：人事管理系统

这个项目用 Java Swing 实现一个简单的人事管理系统：用户登录或注册后，可以查看职员信息，并对职员进行搜索、添加、编辑和删除。当前版本的数据保存在程序内存中，没有接入数据库。

## 1.项目结构：

```text
anran-employee-sys/
├── design.txt                         需求说明
└── src/
    ├── App.java                       程序入口
    └── com/ranan/
        ├── bean/
        │   ├── User.java              登录用户的数据类
        │   └── Employee.java          职员的数据类
        └── ui/
            ├── LoginFrame.java        登录、注册界面
            ├── EmployeeSystemFrame.java  职员列表与操作入口
            ├── AddEmployeeUI.java     添加职员弹窗
            └── EditEmployeeUI.java    编辑职员弹窗
```

`App` 使用 `SwingUtilities.invokeLater(LoginFrame::new)`，让 Swing 界面在事件派发线程中创建。`bean` 包中的类负责保存数据，`ui` 包中的类负责界面和用户操作。

## 2.数据设计：

| 类 | 保存的信息 |
| --- | --- |
| `User` | 用户名 `username`、密码 `password`、登录名 `loginName` |
| `Employee` | ID、姓名、性别、年龄、电话、职位、入职时间、薪水、部门 |

登录和注册实际使用的是 **`loginName`**，不是 `username`。当前注册界面没有单独填写用户名的输入框，所以注册时暂时把 `username` 设为与 `loginName` 相同。

`Employee` 将字段设为 `private`，通过构造方法和 getter、setter 读写，是封装的应用。表格显示 ID、姓名、性别、电话、职位、入职时间、薪水和部门；年龄保存在 `Employee` 中，并能在添加、编辑弹窗里填写，但目前不显示在表格中。

## 3.登录与注册：

`LoginFrame` 继承 `JFrame`，同时实现 `ActionListener`。登录和注册按钮都注册 `this`，再通过 `e.getSource()` 判断点击了哪个按钮：

```java
if (e.getSource() == loginButton) {
    handleLogin();
} else if (e.getSource() == registerButton) {
    handleRegister();
}
```

登录流程：读取登录名和密码 → 检查是否为空 → 按 `loginName` 查找用户 → 比对密码 → 创建职员管理窗口，并关闭登录窗口。密码输入框使用 `getPassword()` 读取。

注册流程：读取输入 → 检查登录名是否重复 → 创建 `User` → 加入 `allUsers`。`allUsers` 是静态 `ArrayList<User>`，启动时由静态代码块放入几个练习用户；新注册用户只在本次程序运行期间保留。

登录成功时，传给 `EmployeeSystemFrame` 的是 `loginName`，用于显示欢迎信息。其构造方法的参数目前叫 `username`，但实际传入的值仍是登录名。

## 4.界面布局：

登录界面把 `BorderLayout` 和多个 `JPanel` 组合起来：

```text
LoginFrame（JFrame）
├── NORTH：系统标题 JLabel
├── CENTER：表单面板
│   ├── 登录名：JLabel + JTextField
│   └── 密码：  JLabel + JPasswordField
└── SOUTH：登录按钮 + 注册按钮
```

职员管理界面上方是搜索框、搜索按钮和添加按钮；中间是放在 `JScrollPane` 中的 `JTable`。右键职员行会出现“修改 / 删除”菜单。右键时先选中鼠标所在行，再显示菜单，因此后续操作能定位正确职员。

添加和编辑界面使用 `JOptionPane.showConfirmDialog(...)` 弹出表单。添加弹窗从空白输入开始；编辑弹窗先把原职员的全部字段填入输入框。点击取消或关闭时返回 `null`，不修改数据。

## 5.集合与表格的分工：

```text
ArrayList<Employee> allEmplotees  →  保存完整职员数据
DefaultTableModel tableModel      →  保存当前表格要显示的行
JTable employeeTable             →  把 tableModel 显示在窗口中
```

程序启动时，20 个虚构的职员对象先加入 `allEmplotees`，表格再从集合读取。`allEmplotees` 是 `static`，同一次运行中由管理窗口共享；`employeeTable` 和 `tableModel` 不是 `static`，每个管理窗口各有自己的表格。

刷新表格时，先清空模型中的旧行，再根据集合重新添加：

```java
tableModel.setRowCount(0);
for (Employee employee : allEmplotees) {
    tableModel.addRow(createTableRow(employee));
}
```

`setRowCount(0)` **只清空表格模型**，不会删除 `ArrayList` 中的职员。`DefaultTableModel` 发生变化时会通知 `JTable` 更新显示，不必重新创建窗口或手动调用 `repaint()`。

## 6.搜索功能：

点击“搜索”或在搜索框按回车，都会调用 `refreshEmployeeTable()`：

1.读取搜索框内容，并用 `trim()` 去掉首尾空格。
2.清空 `tableModel` 中当前显示的行。
3.如果输入的是现有职员的完整 ID，优先只显示该职员。
4.否则遍历 `allEmplotees`，检查表格各列的文字是否包含搜索词；匹配的职员才重新加入表格。

搜索词为空时，`keyword.isEmpty()` 为 `true`，遍历得到的每一行都会加入模型，因此显示全部职员。搜索只是**筛选显示**，不会修改集合中的原始数据。英文比较前使用 `toLowerCase(Locale.ROOT)`，实现不区分大小写的包含匹配。

## 7.添加、编辑与删除：

### 添加职员

`AddEmployeeUI.showDialog(...)` 负责显示表单、检查必填项和数字格式，并验证 ID 是否重复。确认有效输入后，它返回一个新的 `Employee`；`EmployeeSystemFrame` 再执行：

```java
allEmplotees.add(employee);
refreshEmployeeTable();
```

这种分工让弹窗负责**收集数据**，主窗口负责**保存数据和刷新列表**。

### 编辑职员

右键选择“修改”后，程序通过表格选中行取得职员 ID，再从 `allEmplotees` 找到原对象。`EditEmployeeUI` 预填全部字段，允许修改；确认后返回**新对象**，主窗口用 `allEmplotees.set(i, updated)` 替换原对象并刷新表格。取消时返回 `null`，原对象保持不变。修改 ID 时会检查是否与**其他职员**重复。

### 删除职员

右键选择“删除”并确认后，程序通过 ID 在集合中找到职员，调用：

```java
allEmplotees.remove(i);
refreshEmployeeTable();
```

`ArrayList.remove(i)` 会自动让后面的元素在集合中前移；表格重新读取集合后，该行也会被后续行填上，**不需要手动搬移元素**。前移的是集合下标和表格位置，职员 ID 不会重新编号。

表格行号和职员 ID 不是一回事。`getSelectedEmployeeId()` 先取得选中行，再通过 `convertRowIndexToModel(...)` 找到模型行并读取 ID；实际编辑、删除都以 ID 查找职员，而不是把表格行号当作 `ArrayList` 下标。

## 8.本项目用到的技术：

| 技术 | 在项目中的用途 |
| --- | --- |
| 封装、构造方法 | 用 `User`、`Employee` 表示数据 |
| `ArrayList`、静态代码块 | 保存练习用户和初始 20 位职员 |
| `JFrame`、`JPanel`、布局管理器 | 组织两个主界面 |
| `JLabel`、`JTextField`、`JPasswordField` | 展示提示文字，读取登录输入 |
| `JTable`、`DefaultTableModel`、`JScrollPane` | 展示和刷新职员列表 |
| `ActionListener`、Lambda | 处理登录、注册、搜索、添加按钮 |
| `MouseAdapter`、`JPopupMenu` | 处理表格行右键菜单 |
| `JOptionPane` | 表单弹窗、确认删除和结果提示 |
| `Integer.parseInt()`、`Double.parseDouble()` | 把输入框的字符串转成数值 |

## 9.当前版本的边界：

- 数据只在内存中：关闭程序后，新增用户和职员、编辑及删除的结果都会丢失；重新启动会恢复静态代码块中的初始数据。
- 初始职员是虚构练习数据，电话号码做了脱敏。
- 入职时间目前按字符串保存，界面提示 `yyyy-MM-dd`，但尚未检查日期是否真实有效。
- 密码目前用普通字符串保存在内存中，没有数据库、密码哈希或权限控制，适合作为 Swing 与集合练习，不适合作为真实人事系统直接使用。

这个练习的核心思路是：**数据放在集合中，表格只负责显示；用户操作先修改集合，再刷新表格。**
