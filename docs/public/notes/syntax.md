# 语法笔记

## 1.读取首字符和后续数字：

有些输入由一个字符和后续数字组成，例如：

```text
A1010
```

如果直接使用：

```java
char letter = sc.next().charAt(0);
```

虽然可以得到 `'A'`，但 `next()` 已经读取并消耗了完整的 `"A1010"`，后面的 `1010` 不能再通过 `Scanner` 单独读取。

正确做法是先将完整输入读取为 `String`，再分别取得首字符和剩余部分：

```java
String input = sc.next(); // 输入：A1010

char letter = input.charAt(0);
int number = Integer.parseInt(input.substring(1));

System.out.println(letter); // A
System.out.println(number); // 1010
```

1.`charAt(0)`：

`charAt(下标)` 用于取得字符串中指定位置的字符。字符串下标从 `0` 开始，因此 `charAt(0)` 取得第一个字符。

```java
String input = "A1010";
char letter = input.charAt(0); // A
```

2.`substring(1)`：

`substring(开始下标)` 用于从指定下标开始截取字符串，一直截取到末尾。

```java
String input = "A1010";
String text = input.substring(1); // "1010"
```

下标 `1` 表示跳过第一个字符 `A`，取得后面的所有内容。

也可以指定开始和结束位置：

```java
String input = "A1010";
String text = input.substring(1, 3); // "10"
```

`substring(1, 3)` 的结果包含下标 `1`，但不包含下标 `3`。

3.`Integer.parseInt()`：

`Integer.parseInt()` 可以将只包含整数内容的字符串转换为 `int`。

```java
String text = "1010";
int number = Integer.parseInt(text);
```

如果字符串不是合法整数，例如 `"10x0"`，会抛出 `NumberFormatException` 异常。

4.输入长度检查：

输入至少要包含一个字符和一位数字。若只输入 `A`，调用 `substring(1)` 会得到空字符串，之后转换为整数时会报错。

```java
String input = sc.next();

if (input.length() < 2) {
    System.out.println("输入格式不合法");
    return;
}

char letter = input.charAt(0);
int number = Integer.parseInt(input.substring(1));
```

`return` 写在 `main()` 中时，表示提前正常结束程序。

5.使用场景：

这种写法适合固定格式的输入，例如：

```text
A1010  -> 字符：A，数字：1010
B25    -> 字符：B，数字：25
X999   -> 字符：X，数字：999
```

## 2.ASCII 码表：

ASCII 是一套将字符映射为数字的编码表。标准 ASCII 使用十进制 `0~127`，共 128 个值，能表示英文、数字、常用标点和控制字符，不能表示中文。

1.控制字符：

`0~31` 和 `127` 是控制字符，通常不会直接显示在屏幕上。

```text
  0 NUL    1 SOH    2 STX    3 ETX
  4 EOT    5 ENQ    6 ACK    7 BEL
  8 BS     9 TAB   10 LF    11 VT
 12 FF    13 CR    14 SO    15 SI
 16 DLE   17 DC1   18 DC2   19 DC3
 20 DC4   21 NAK   22 SYN   23 ETB
 24 CAN   25 EM    26 SUB   27 ESC
 28 FS    29 GS    30 RS    31 US
127 DEL
```

其中常见的控制字符：`TAB` 表示制表符，`LF` 表示换行，`CR` 表示回车。

2.可显示字符：

```text
 32 空格   33 !      34 "      35 #
 36 $      37 %      38 &      39 '
 40 (      41 )      42 *      43 +
 44 ,      45 -      46 .      47 /
 48 0      49 1      50 2      51 3
 52 4      53 5      54 6      55 7
 56 8      57 9      58 :      59 ;
 60 <      61 =      62 >      63 ?
 64 @

 65 A      66 B      67 C      68 D
 69 E      70 F      71 G      72 H
 73 I      74 J      75 K      76 L
 77 M      78 N      79 O      80 P
 81 Q      82 R      83 S      84 T
 85 U      86 V      87 W      88 X
 89 Y      90 Z      91 [      92 \
 93 ]      94 ^      95 _      96 `

 97 a      98 b      99 c     100 d
101 e     102 f     103 g     104 h
105 i     106 j     107 k     108 l
109 m     110 n     111 o     112 p
113 q     114 r     115 s     116 t
117 u     118 v     119 w     120 x
121 y     122 z     123 {     124 |
125 }     126 ~
```

3.常用规律：

```text
'0' ~ '9'：48 ~ 57
'A' ~ 'Z'：65 ~ 90
'a' ~ 'z'：97 ~ 122
```

小写字母比对应的大写字母大 `32`。数字字符是连续排列的，因此可以使用字符相减得到对应的数字。

```java
System.out.println((int) 'A'); // 65
System.out.println((int) 'a'); // 97
System.out.println('a' - 'A'); // 32

char c = '7';
int number = c - '0';
System.out.println(number); // 7
```

注意：`'7'` 是字符，ASCII 值为 `55`；`7` 是整数数值。Java 的 `char` 实际使用 Unicode（UTF-16）表示字符，ASCII 只是 Unicode 的前 128 个字符，中文不属于 ASCII。

## 3.StringBuilder 字符串拼接：

`StringBuilder` 用于高效地拼接和修改字符串。`String` 创建后内容不能改变；`StringBuilder` 创建后可以不断追加、插入或删除内容。

1.基本使用：

```java
StringBuilder sb = new StringBuilder();

sb.append("Hello");
sb.append(' ');
sb.append("Java");
sb.append('!');

System.out.println(sb); // Hello Java!
```

`append()` 可以添加字符串、字符、数字和布尔值等数据：

```java
StringBuilder sb = new StringBuilder();

sb.append("年龄：");
sb.append(18);
sb.append("，是否成年：");
sb.append(true);

System.out.println(sb); // 年龄：18，是否成年：true
```

2.转换为 `String`：

当需要得到普通字符串时，使用 `toString()`：

```java
StringBuilder sb = new StringBuilder();
sb.append("ABC");

String text = sb.toString();
System.out.println(text); // ABC
```

3.循环拼接：

循环中使用 `String` 的 `+=` 拼接，每次都会产生一个新的字符串。拼接次数较多时，使用 `StringBuilder` 更合适。

验证码练习可以写成：

```java
public static String randomKeyNumber(int len) {
    StringBuilder key = new StringBuilder();

    for (int i = 0; i < len; i++) {
        int num = (int) (Math.random() * 10);
        key.append(num);
    }

    return key.toString();
}
```

4.常用方法：

```java
StringBuilder sb = new StringBuilder("Hello");

sb.append(" Java"); // Hello Java
sb.insert(5, "!");  // Hello! Java，在下标 5 前插入
sb.delete(5, 6);     // Hello Java，删除下标 [5, 6) 的内容
sb.reverse();        // avaJ olleH，反转字符顺序

System.out.println(sb.length()); // 当前字符数量
System.out.println(sb.charAt(0)); // 下标为 0 的字符
```

5.链式调用：

`append()` 等方法会返回当前的 `StringBuilder` 对象，因此可以连续调用。

```java
String result = new StringBuilder()
        .append("姓名：")
        .append("小明")
        .append("，年龄：")
        .append(18)
        .toString();
```

简单总结：固定不变的文本使用 `String`；需要反复拼接或修改文本时使用 `StringBuilder`。
