# String 和 ArrayList 笔记

本章总结 `String` 和 `ArrayList` 的基本使用及常用 API。

## 1.String 的特点：

`String` 表示字符串，是引用数据类型，不属于 Java 的 8 种基本数据类型。

```java
String name = "Java";
```

`String` 对象创建后内容不能改变，称为不可变字符串。对字符串进行拼接、替换、截取等操作时，得到的是一个新字符串，原字符串不会改变。

```java
String text = "Java";
text.toUpperCase();
System.out.println(text); // Java

text = text.toUpperCase();
System.out.println(text); // JAVA
```

固定文本和少量拼接适合使用 `String`；循环中反复拼接大量内容时，通常使用 `StringBuilder`。

## 2.创建字符串：

1.直接使用字符串字面量：

```java
String s1 = "Hello World";
```

这是最常用的创建方式。

2.使用构造方法：

```java
String s2 = new String("Hello World");
```

通常没有必要把已有字符串再次传给 `new String()`，直接赋值即可。

3.通过字符数组创建：

```java
char[] chars = {'H', 'e', 'l', 'l', 'o'};
String s3 = new String(chars);
```

4.通过字节数组创建：

```java
byte[] bytes = {65, 66, 67};
String s4 = new String(bytes);
System.out.println(s4); // ABC
```

字节转换为文字时涉及字符编码。实际项目中建议明确指定编码：

```java
import java.nio.charset.StandardCharsets;

String text = new String(bytes, StandardCharsets.UTF_8);
```

## 3.字符串常量池与 `new`：

使用字符串字面量创建的字符串会使用字符串常量池。内容相同的字面量通常复用同一个对象：

```java
String s1 = "abc";
String s2 = "abc";

System.out.println(s1 == s2); // true
```

每次使用 `new String()` 都会创建新的字符串对象：

```java
String s3 = new String("abc");
String s4 = new String("abc");

System.out.println(s3 == s4); // false
```

`==` 比较两个引用是否指向同一个对象，不适合判断字符串内容是否相同。

## 4.字符串内容比较：

使用 `equals()` 比较内容：

```java
String loginName = "admin";
String input = "admin";

System.out.println(loginName.equals(input)); // true
```

使用 `equalsIgnoreCase()` 忽略英文字母大小写：

```java
System.out.println("Java".equalsIgnoreCase("JAVA")); // true
```

处理用户输入时，可以把确定不为 `null` 的固定字符串写在前面：

```java
if ("admin".equals(input)) {
    System.out.println("登录成功");
}
```

即使 `input` 为 `null`，这种写法也不会抛出 `NullPointerException`。

## 5.长度、字符和空字符串：

| 方法 | 作用 | 示例结果 |
| --- | --- | --- |
| `length()` | 返回字符串长度 | `"Java".length()` → `4` |
| `charAt(index)` | 获取指定下标的字符 | `"Java".charAt(0)` → `'J'` |
| `isEmpty()` | 长度是否为 0 | `"".isEmpty()` → `true` |
| `isBlank()` | 是否为空或只含空白字符 | `"  ".isBlank()` → `true` |
| `toCharArray()` | 转换为字符数组 | `"abc".toCharArray()` |

字符串下标从 `0` 开始，合法范围是 `0 ~ length() - 1`。下标越界会抛出 `StringIndexOutOfBoundsException`。

`null` 和空字符串不同：

```java
String a = null; // 没有指向 String 对象
String b = "";   // 存在 String 对象，但长度为 0
```

不能对 `null` 调用 `length()`、`isEmpty()` 等方法。

## 6.查找和判断：

| 方法 | 作用 | 示例 |
| --- | --- | --- |
| `contains(text)` | 是否包含指定内容 | `"Hello".contains("ell")` |
| `startsWith(text)` | 是否以指定内容开头 | `"Java.java".startsWith("Java")` |
| `endsWith(text)` | 是否以指定内容结尾 | `"Java.java".endsWith(".java")` |
| `indexOf(text)` | 第一次出现的位置 | `"banana".indexOf("na")` → `2` |
| `lastIndexOf(text)` | 最后一次出现的位置 | `"banana".lastIndexOf("na")` → `4` |

没有找到时，`indexOf()` 和 `lastIndexOf()` 返回 `-1`。

这些方法也有接收字符或指定开始位置的重载版本：

```java
"banana".indexOf('a');       // 1
"banana".indexOf("na", 3); // 4，从下标 3 开始找
```

## 7.截取字符串：

`substring(beginIndex)` 从指定下标截取到末尾：

```java
String text = "HelloWorld";
System.out.println(text.substring(5)); // World
```

`substring(beginIndex, endIndex)` 包含开始下标，不包含结束下标，范围是 `[beginIndex, endIndex)`：

```java
System.out.println(text.substring(0, 5)); // Hello
```

手机号码脱敏练习：

```java
String number = "15581572906";
String privateNumber = number.substring(0, 3)
        + "****"
        + number.substring(7);

System.out.println(privateNumber); // 155****2906
```

## 8.替换字符串：

`replace()` 按普通文本替换所有匹配内容：

```java
String result = "Java Java".replace("Java", "Python");
System.out.println(result); // Python Python
```

常用替换方法：

| 方法 | 作用 |
| --- | --- |
| `replace(old, new)` | 替换所有普通文本或字符 |
| `replaceFirst(regex, new)` | 替换第一个正则表达式匹配项 |
| `replaceAll(regex, new)` | 替换所有正则表达式匹配项 |

`replaceFirst()`、`replaceAll()` 的第一个参数是正则表达式，不是普通文本。尚未学习正则表达式时，普通替换优先使用 `replace()`。

## 9.大小写和去除空白：

```java
String text = "  Hello Java  ";

text.toUpperCase(); // "  HELLO JAVA  "
text.toLowerCase(); // "  hello java  "
text.trim();        // "Hello Java"
text.strip();       // "Hello Java"
```

常用方法：

| 方法 | 作用 |
| --- | --- |
| `toUpperCase()` | 转换为大写 |
| `toLowerCase()` | 转换为小写 |
| `trim()` | 去掉首尾传统空白字符 |
| `strip()` | 去掉首尾 Unicode 空白字符，Java 11 引入 |
| `stripLeading()` | 只去掉开头空白 |
| `stripTrailing()` | 只去掉结尾空白 |

这些方法不会改变原字符串，必须接收返回值。

## 10.拆分与拼接：

`split()` 按指定规则拆分字符串，返回 `String[]`：

```java
String text = "Java,C++,Python";
String[] languages = text.split(",");
```

`split()` 的参数是正则表达式，点号等特殊字符需要转义：

```java
String[] parts = "192.168.1.1".split("\\.");
```

使用 `String.join()` 将多个字符串连接起来：

```java
String result = String.join("-", "2026", "10", "18");
System.out.println(result); // 2026-10-18
```

其他拼接方式：

```java
String a = "Hello" + " " + "Java";
String b = "Hello".concat(" Java");
```

## 11.重复与格式化：

```java
"*".repeat(5); // "*****"
```

`repeat(count)` 将字符串重复指定次数。次数为 `0` 时返回空字符串，次数不能为负数。

格式化字符串：

```java
String info = String.format("姓名：%s，年龄：%d", "小明", 18);
```

Java 15 及以上也可以使用：

```java
String info = "姓名：%s，年龄：%d".formatted("小明", 18);
```

## 12.字符串转换：

其他数据转换为字符串：

```java
String a = String.valueOf(123);  // "123"
String b = String.valueOf(true); // "true"
String c = String.valueOf('A');  // "A"
```

字符串转换为基本数据类型，需要使用对应包装类：

```java
int number = Integer.parseInt("123");
double value = Double.parseDouble("3.14");
boolean flag = Boolean.parseBoolean("true");
```

字符串不是合法数字时，`parseInt()`、`parseDouble()` 会抛出 `NumberFormatException`。

字符串和字节数组互相转换时建议指定编码：

```java
byte[] data = "你好".getBytes(StandardCharsets.UTF_8);
String text = new String(data, StandardCharsets.UTF_8);
```

## 13.字符串顺序比较：

| 方法 | 作用 |
| --- | --- |
| `compareTo(other)` | 按字典顺序比较，区分大小写 |
| `compareToIgnoreCase(other)` | 按字典顺序比较，忽略英文大小写 |

返回值规律：

```text
负数：当前字符串排在参数字符串前面
0：两个字符串的比较结果相等
正数：当前字符串排在参数字符串后面
```

例如：

```java
"abc".compareTo("bcd");           // 负数
"Java".compareToIgnoreCase("JAVA"); // 0
```

## 14.常用 API 汇总：

| 分类 | 常用 API |
| --- | --- |
| 长度和字符 | `length()`、`charAt()`、`toCharArray()` |
| 判空 | `isEmpty()`、`isBlank()` |
| 内容比较 | `equals()`、`equalsIgnoreCase()` |
| 顺序比较 | `compareTo()`、`compareToIgnoreCase()` |
| 查找判断 | `contains()`、`startsWith()`、`endsWith()`、`indexOf()`、`lastIndexOf()` |
| 截取 | `substring()` |
| 替换 | `replace()`、`replaceFirst()`、`replaceAll()` |
| 大小写 | `toUpperCase()`、`toLowerCase()` |
| 去空白 | `trim()`、`strip()`、`stripLeading()`、`stripTrailing()` |
| 拆分拼接 | `split()`、`String.join()`、`concat()` |
| 重复格式化 | `repeat()`、`String.format()`、`formatted()` |
| 类型转换 | `String.valueOf()`、`getBytes()`、`new String(bytes)` |

最重要的使用原则：

```text
比较字符串内容使用 equals()，不要使用 ==
String 不可变，处理方法通常返回新字符串
字符串下标从 0 开始，结束下标通常不包含
split()、replaceAll() 的参数涉及正则表达式
```

---

## 15.ArrayList 概述：

`ArrayList` 是一种长度可以动态变化的集合，适合保存一组类型相同的数据。

数组创建后长度固定，而 `ArrayList` 可以继续添加或删除元素：

```java
import java.util.ArrayList;

ArrayList<String> names = new ArrayList<>();
```

`<String>` 是泛型，用来限制集合中元素的类型。上面的集合只能直接存放字符串：

```java
names.add("安染");
names.add("Java");
// names.add(10); // 编译错误
```

`ArrayList` 的主要特点：

- 集合长度可以动态变化。
- 元素按照添加顺序保存。
- 可以保存重复元素，也可以保存 `null`。
- 下标从 `0` 开始。
- 泛型不能直接写基本数据类型，要使用对应的包装类。

```java
ArrayList<Integer> numbers = new ArrayList<>();
ArrayList<Double> scores = new ArrayList<>();
ArrayList<Character> chars = new ArrayList<>();
```

例如 `int` 对应 `Integer`，`double` 对应 `Double`，`char` 对应 `Character`。

## 16.添加元素：

### `add(element)`：添加到末尾

```java
ArrayList<String> list = new ArrayList<>();
list.add("Java");
list.add("C++");

System.out.println(list); // [Java, C++]
```

### `add(index, element)`：插入到指定位置

```java
list.add(1, "Python");
System.out.println(list); // [Java, Python, C++]
```

原来位于该位置及其后面的元素会向后移动。插入下标可以是 `0 ~ size()`。

### `addAll(collection)`：添加另一组元素

```java
ArrayList<String> other = new ArrayList<>();
other.add("Go");
other.add("Rust");

list.addAll(other);
```

也可以从指定位置开始插入：

```java
list.addAll(1, other);
```

## 17.获取元素和集合大小：

### `get(index)`：获取指定下标的元素

```java
String first = list.get(0);
```

### `size()`：获取元素个数

```java
System.out.println(list.size());
```

数组使用 `array.length`，字符串使用 `string.length()`，集合使用 `list.size()`。

下标合法范围为 `0 ~ size() - 1`，下标越界会抛出 `IndexOutOfBoundsException`。

## 18.修改元素：

`set(index, element)` 用新元素替换指定位置的旧元素，并返回被替换的旧元素：

```java
String oldValue = list.set(0, "Java SE");
System.out.println(oldValue);
```

`set()` 只能修改已经存在的位置，不能用它添加新位置。

## 19.删除元素：

### `remove(index)`：按下标删除

返回被删除的元素：

```java
String removed = list.remove(1);
```

### `remove(object)`：按内容删除

只删除第一次出现的匹配元素，并返回是否删除成功：

```java
boolean success = list.remove("Java");
```

### 整数集合的易错点

`ArrayList<Integer>` 调用 `remove(1)` 时，Java 会把 `1` 当作下标，而不是要删除的数字：

```java
ArrayList<Integer> numbers = new ArrayList<>();
numbers.add(10);
numbers.add(20);
numbers.add(30);

numbers.remove(1);                  // 删除下标 1，即数字 20
numbers.remove(Integer.valueOf(30)); // 按内容删除数字 30
```

### 其他删除方法

```java
list.removeAll(other);            // 删除 other 中包含的元素
list.removeIf(s -> s.length() < 3); // 删除所有满足条件的元素
list.clear();                     // 删除全部元素
```

## 20.查找和判断：

| API | 作用 |
| --- | --- |
| `contains(element)` | 判断是否包含指定元素 |
| `indexOf(element)` | 返回第一次出现的下标，找不到返回 `-1` |
| `lastIndexOf(element)` | 返回最后一次出现的下标，找不到返回 `-1` |
| `isEmpty()` | 判断集合是否没有元素 |
| `containsAll(collection)` | 判断是否包含另一个集合中的全部元素 |

```java
ArrayList<String> languages = new ArrayList<>();
languages.add("Java");
languages.add("C++");
languages.add("Java");

languages.contains("Java");   // true
languages.indexOf("Java");    // 0
languages.lastIndexOf("Java"); // 2
languages.isEmpty();           // false
```

这些方法判断自定义对象是否相同时，会使用对象的 `equals()` 方法。

## 21.遍历 ArrayList：

### 普通 `for` 循环

需要使用下标时使用：

```java
for (int i = 0; i < list.size(); i++) {
    System.out.println(i + "：" + list.get(i));
}
```

### 增强 `for` 循环

只需要依次读取元素时更加简洁：

```java
for (String value : list) {
    System.out.println(value);
}
```

### `forEach()` 和 Lambda 表达式

```java
list.forEach(value -> System.out.println(value));
```

也可以使用方法引用：

```java
list.forEach(System.out::println);
```

遍历时不要在增强 `for` 循环中直接删除元素，否则容易出现异常。普通 `for` 循环删除时也要注意下标移动，否则可能漏删。按条件批量删除优先使用 `removeIf()`。

## 22.排序：

`sort(comparator)` 可以根据比较规则对集合本身进行排序：

```java
ArrayList<Integer> numbers = new ArrayList<>();
numbers.add(30);
numbers.add(10);
numbers.add(20);

numbers.sort((a, b) -> Integer.compare(a, b)); // 升序
numbers.sort((a, b) -> Integer.compare(b, a)); // 降序
```

也可以使用 `Comparator` 提供的现成规则：

```java
import java.util.Comparator;

numbers.sort(Comparator.naturalOrder()); // 自然顺序，升序
numbers.sort(Comparator.reverseOrder()); // 反向顺序，降序
```

## 23.转换为数组：

```java
String[] array = list.toArray(new String[0]);
```

这样可以把 `ArrayList<String>` 转换成 `String[]`。

## 24.结合你的代码理解增删改查：

你在 `ArrayListDemo` 中已经完成了集合最基本的 CRUD 操作：

```java
ArrayList<String> list = new ArrayList<>();

list.add("java");     // Create：添加
list.get(0);          // Read：读取
list.set(0, "java3"); // Update：修改
list.remove(2);       // Delete：删除
```

遍历部分也正确：

```java
for (int i = 0; i < list.size(); i++) {
    System.out.println(list.get(i));
}
```

## 25.ArrayList 常用 API 汇总：

| 分类 | API | 说明 |
| --- | --- | --- |
| 添加 | `add(element)` | 在末尾添加元素 |
| 添加 | `add(index, element)` | 在指定位置插入元素 |
| 批量添加 | `addAll(collection)` | 添加另一个集合中的所有元素 |
| 获取 | `get(index)` | 获取指定位置的元素 |
| 数量 | `size()` | 获取元素个数 |
| 修改 | `set(index, element)` | 替换指定位置的元素 |
| 删除 | `remove(index)` | 按下标删除 |
| 删除 | `remove(object)` | 删除第一次出现的指定元素 |
| 条件删除 | `removeIf(condition)` | 删除所有满足条件的元素 |
| 批量删除 | `removeAll(collection)` | 删除另一个集合中包含的元素 |
| 清空 | `clear()` | 删除所有元素 |
| 包含判断 | `contains(element)` | 判断是否包含元素 |
| 查找位置 | `indexOf(element)` | 获取元素第一次出现的位置 |
| 查找位置 | `lastIndexOf(element)` | 获取元素最后一次出现的位置 |
| 判空 | `isEmpty()` | 判断集合是否为空 |
| 遍历 | `forEach(action)` | 对每个元素执行操作 |
| 排序 | `sort(comparator)` | 按指定规则排序 |
| 转换 | `toArray(array)` | 转换为数组 |

最重要的使用原则：

```text
ArrayList 的下标从 0 开始，元素个数使用 size()
泛型只能使用引用类型，基本类型要换成包装类
get()、set()、remove(index) 都不能使用越界下标
注意 remove(index) 和 remove(object) 是两个不同的方法
只读取元素时可以使用增强 for，需要下标时使用普通 for
```
