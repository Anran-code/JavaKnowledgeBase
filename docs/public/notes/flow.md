# 程序流程控制笔记

程序默认按照从上到下的顺序执行。流程控制语句可以根据条件选择不同的代码，或让一段代码重复执行。

## 1.if 分支语句：

`if` 用于根据条件决定是否执行一段代码。条件表达式的结果必须是 `boolean` 类型。

```java
if (条件) {
    // 条件为 true 时执行
}
```

```java
int age = 18;

if (age >= 18) {
    System.out.println("已成年");
}
```

1.`if...else`：

当条件不成立时，执行 `else` 中的代码。

```java
if (age >= 18) {
    System.out.println("已成年");
} else {
    System.out.println("未成年");
}
```

2.`if...else if...else`：

用于多个互斥条件的判断。程序会从上到下依次判断，遇到第一个为 `true` 的条件后，执行对应代码并跳过后续分支。

```java
double bmi = 22.63;

if (bmi < 18.5) {
    System.out.println("体重不足");
} else if (bmi < 24.0) {
    System.out.println("体重正常");
} else if (bmi < 28.0) {
    System.out.println("体重超重");
} else {
    System.out.println("肥胖");
}
```

前一个分支已经不成立，因此后续条件通常不必重复写下限。例如执行到 `else if (bmi < 24.0)` 时，可以确定 `bmi >= 18.5`。

3.条件中的比较运算符：

```java
age > 18;   // 大于
age >= 18;  // 大于等于
age < 18;   // 小于
age <= 18;  // 小于等于
age == 18;  // 是否相等
age != 18;  // 是否不相等
```

4.逻辑运算符：

多个条件可以通过逻辑运算符组合。

```java
double bmi = 22.0;

if (bmi >= 18.5 && bmi < 24.0) {
    System.out.println("体重正常");
}
```

`&&` 表示“并且”，两边条件都为 `true` 时，整个结果才为 `true`。

```java
boolean hasIdCard = true;
boolean hasTicket = false;

if (hasIdCard || hasTicket) {
    System.out.println("可以进入");
}
```

`||` 表示“或者”，两边只要有一个条件为 `true`，整个结果就是 `true`。

`!` 表示逻辑非，可以将 `true` 变为 `false`，将 `false` 变为 `true`。

```java
boolean isRainy = false;
if (!isRainy) {
    System.out.println("可以出门");
}
```

5.BMI 分支练习的边界：

使用多个范围判断时，要保证范围连续，不要遗漏边界值。中国成年人常用的 BMI 分级可以写成：

```text
bmi < 18.5：体重不足
18.5 <= bmi < 24.0：正常体重
24.0 <= bmi < 28.0：超重
bmi >= 28.0：肥胖
```

从小到大连续判断时，可以使用第 2 节的简化写法，避免出现 `23.9`、`24.0` 等边界之间的空档。

## 2.switch 分支语句：

当一个变量需要和多个固定值比较时，可以使用 `switch`。`switch` 中的表达式会依次与每个 `case` 的值比较，匹配后执行对应代码。

```java
String gender = "男";

switch (gender) {
    case "男":
        System.out.println("你是男性");
        break;
    case "女":
        System.out.println("你是女性");
        break;
    default:
        System.out.println("输入有误");
        break;
}
```

1.`case`：

`case` 后面写要匹配的固定值。上例中，`gender` 为 `"男"` 时，执行第一个 `case`。

2.`break`：

`break` 用于结束当前 `switch`。如果不写 `break`，程序会继续执行后面的 `case`，这种现象叫作穿透。

```java
int day = 1;

switch (day) {
    case 1:
        System.out.println("星期一");
        // 没有 break，会继续执行 case 2
    case 2:
        System.out.println("星期二");
        break;
    default:
        System.out.println("其他日期");
}
```

3.`default`：

当所有 `case` 都不匹配时，执行 `default`。`default` 不是必须的，但处理用户输入时通常应该保留它。

4.`switch` 和 `if` 的选择：

- 判断一个变量是否等于多个固定值时，适合使用 `switch`。
- 判断范围或多个复杂条件时，适合使用 `if...else if...else`。

例如性别、菜单选项适合使用 `switch`；BMI、年龄、分数等范围判断适合使用 `if`。

## 3.while 循环：

`while` 会先判断条件；条件为 `true` 时执行循环体，然后再次判断条件。条件一开始为 `false` 时，循环体一次也不会执行。

```java
while (条件) {
    // 循环执行的代码
}
```

1.复利翻倍练习：

```java
double money = 100000;
double rate = 0.017;
int years = 0;

while (money < 200000) {
    money += money * rate;
    years++;
}

System.out.println(years + "年");
```

每循环一次，代表经过一年：本金按利率增加一次，`years` 加一。直到本金不再小于 `200000` 时循环结束。

2.纸张折叠练习：

```java
int height = 8848860; // 珠峰高度，单位 mm
double thickness = 0.1;
int times = 0;

while (thickness < height) {
    thickness *= 2;
    times++;
}

System.out.println(times + "次");
```

每折一次，纸的厚度会变为原来的两倍。循环结束时，`times` 就是厚度超过目标高度所需的次数。

3.避免死循环：

循环条件最终必须能变为 `false`。例如上面两个练习中，`money`、`thickness` 和计数变量都会随着循环改变。

```java
int i = 0;

while (i < 3) {
    System.out.println(i);
    i++;
}
```

如果遗漏 `i++`，`i < 3` 会一直成立，程序就会无限循环。

## 4.do...while 循环：

`do...while` 会先执行一次循环体，再判断条件。因此无论条件一开始是否成立，循环体至少会执行一次。

```java
do {
    // 循环执行的代码
} while (条件);
```

```java
int i = 0;

do {
    System.out.println("HelloWorld");
    i++;
} while (i < 3);
```

输出三次 `HelloWorld`。

`do...while` 的结尾必须有分号：

```java
} while (i < 3);
```

它适合“至少要执行一次”的场景，例如先显示菜单，再询问用户是否继续。

## 5.for 循环：

已知循环次数时，通常使用 `for` 循环。

```java
for (初始化; 条件判断; 更新变量) {
    // 循环执行的代码
}
```

```java
for (int i = 0; i < 3; ++i) {
    System.out.println("HelloWorld");
}
```

执行顺序：

1.执行初始化：`int i = 0`，只执行一次。
2.判断条件：`i < 3`。
3.条件为 `true` 时，执行循环体。
4.执行更新变量：`++i`。
5.回到第 2 步继续判断。

`i++` 和 `++i` 都能让 `i` 加一。单独作为循环的更新语句时，它们效果相同。

```java
for (int i = 1; i <= 5; i++) {
    System.out.println(i);
}
```

注意循环条件的边界：`i < 5` 会执行 `0~4`，`i <= 5` 会执行 `1~5`，要根据实际需求选择。

## 6.嵌套循环：

一个循环内部再写另一个循环，称为嵌套循环。外层循环每执行一次，内层循环都会完整执行一遍。

1.九九乘法表：

```java
for (int i = 1; i <= 9; ++i) {
    for (int j = 1; j <= i; j++) {
        System.out.printf("%d*%d=%-4d", i, j, i * j);
    }
    System.out.println();
}
```

外层的 `i` 控制行数；内层的 `j` 控制每一行输出多少个算式。`%-4d` 让计算结果左对齐且至少占 4 个位置，使输出更整齐。

2.金字塔：

```java
public static void printPyramid(int layer) {
    for (int i = 0; i < layer; ++i) {
        for (int j = 0; j < layer - 1 - i; ++j) {
            System.out.print(" ");
        }
        for (int j = 0; j < 2 * i + 1; ++j) {
            System.out.print("*");
        }
        System.out.println();
    }
}
```

第 `i` 行的规律：

- 左侧空格数量：`layer - 1 - i`。
- 星号数量：`2 * i + 1`，每一行比前一行多两个星号。

当 `layer` 为 `4` 时，输出结果：

```text
   *
  ***
 *****
*******
```

3.嵌套循环的执行次数：

如果外层循环执行 `n` 次，内层每次执行 `n` 次，内层代码总共约执行 `n × n` 次。数据量较大时，嵌套循环会比单层循环消耗更多时间。

## 7.流程控制语句总结：

| 语句 | 适用场景 | 特点 |
| --- | --- | --- |
| `if...else` | 范围或复杂条件判断 | 可以组合多个条件 |
| `switch` | 多个固定值的选择 | 常配合 `case`、`break`、`default` 使用 |
| `while` | 循环次数未知 | 先判断，可能一次都不执行 |
| `do...while` | 循环体至少执行一次 | 后判断，至少执行一次 |
| `for` | 循环次数明确 | 初始化、条件和更新写在一起 |
| 嵌套循环 | 表格、图形等二维重复任务 | 外层每次执行时，内层完整执行 |

## 8.简易计算器练习复盘：

练习文件：`03-flow-control/src/com/ranan/practice/SimpleCalculator.java`。

这个练习的目标是读取一个形如 `12.5*3` 的简单表达式，拆分出两个数字和运算符，再根据运算符完成加、减、乘、除。

1.当前程序的处理流程：

```text
读取整行表达式
    -> 查找 +、-、*、/ 的位置
    -> 将运算符左、右两侧的字符串转换为 double
    -> 使用 switch 选择运算
    -> 输出结果
```

例如输入：

```text
12.5*3
```

程序得到的数据是：

```java
double num1 = 12.5;
char operate = '*';
double num2 = 3.0;
```

2.表达式拆分：

当前代码使用循环查找运算符下标：

```java
int index = 0;
for (int i = 0; i < s.length(); ++i) {
    if (s.charAt(i) == '+' || s.charAt(i) == '-'
            || s.charAt(i) == '*' || s.charAt(i) == '/') {
        index = i;
        break;
    }
}
```

找到下标后，可以用 `substring()` 分别取得左右两部分：

```java
num1 = Double.parseDouble(s.substring(0, index));
operate = s.charAt(index);
num2 = Double.parseDouble(s.substring(index + 1));
```

`substring(0, index)` 包含开头但不包含运算符；`substring(index + 1)` 从运算符后一位截取到末尾。

3.`switch` 适合选择运算：

运算符是几个固定值，因此使用 `switch` 比连续的 `if...else if` 更清晰。

```java
switch (op) {
    case '+':
        return num1 + num2;
    case '-':
        return num1 - num2;
    case '*':
        return num1 * num2;
    case '/':
        if (num2 == 0) {
            throw new IllegalArgumentException("除数不能为 0");
        }
        return num1 / num2;
    default:
        throw new IllegalArgumentException("不支持的运算符：" + op);
}
```

`char` 使用单引号，例如 `'+'`；`String` 使用双引号，例如 `"+"`。

4.当前代码已经做得好的地方：

- 将“读取和解析表达式”放在 `getAnswerOfExpression()`，将“实际计算”放在 `calculate()`，职责有所拆分。
- 两个操作数使用 `double`，可以支持 `1.5+2.3` 这样的小数运算。
- 除法前判断除数是否为 `0`，避免得到没有实际意义的结果。
- 使用 `nextLine()` 读取完整表达式，输入中即使有空格也可以先读取到。

5.当前版本的边界问题：

1.没有运算符时，`index` 保持为 `0`，例如输入 `123`，左侧子串为空，`Double.parseDouble()` 会抛出 `NumberFormatException`。
2.输入 `1+2+3` 时，只会按第一个 `+` 切分，右侧的 `2+3` 不能转换为一个数字。

## 9.随机验证码练习复盘：

练习文件：`03-flow-control/src/com/ranan/practice/VerificationCode.java`。

该程序读取用户输入的验证码长度，生成由数字、大写字母和小写字母组成的随机验证码。

1.输入长度校验：

`getLength()` 使用 `while(true)` 重复读取输入。`hasNextInt()` 判断输入是否为整数，且只有长度大于 `0` 时才返回，避免生成空验证码。

2.随机下标：

```java
int index = (int) (Math.random() * 62);
```

`Math.random()` 的范围是 `[0.0, 1.0)`，因此 `index` 的范围是 `0~61`，一共对应 62 个可选字符：10 个数字、26 个大写字母和 26 个小写字母。

3.下标转换为字符：

```text
0~9   -> '0'~'9'
10~35 -> 'A'~'Z'
36~61 -> 'a'~'z'
```

`indexToChar()` 根据下标所在区间，通过 ASCII 编码计算并返回对应的 `char`。三个范围连续且不重叠，转换逻辑正确。

4.拼接验证码：

```java
StringBuilder code = new StringBuilder();

for (int i = 0; i < len; i++) {
    int index = (int) (Math.random() * 62);
    code.append(indexToChar(index));
}

return code.toString();
```

循环每次生成一个随机字符，`StringBuilder` 负责追加；循环执行 `len` 次后，得到指定长度的验证码。这个练习综合使用了循环、分支、随机数、字符转换、`Scanner` 输入和 `StringBuilder`。
