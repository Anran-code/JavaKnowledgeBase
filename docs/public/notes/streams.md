# Stream 流笔记

本章对应 `14-map-stream/src/com/ranan/stream` 中的 `StreamDemo1`～`StreamDemo4`，也记录 `testdemo` 的集合工具和扑克牌练习中用到的比较器。

## 1.Stream 是什么：

`Stream<T>` 可以理解成**按规则依次处理一批 `T` 类型数据的流水线**，例如：**取得数据 → 筛选 → 转换 → 收集结果**。它强调“对每个元素做什么”，而不是自己写循环管理每一步。

它与 `List` 不同：Stream **不负责长期存放元素，也没有 `add()`、`get(index)` 这类集合操作**。数据来自集合、数组等数据源；中间操作只描述处理规则，通常等终结操作执行时才真正开始读取和处理数据。一个流在终结后不能再用，想重新处理就要从数据源再获取一个流。[Java 官方文档](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/package-summary.html)也把它描述为“数据源 → 中间操作 → 终结操作”的流水线。

可以把 `List` 想成**装数据的盒子**，把 Stream 想成**经过盒子里数据的一条加工线**。加工线不会因为调用了 `filter()` 就自动产生一个新列表；要列表时还需 `collect(...)` 或 `toList()`。

## 2.为什么用 Stream：

`StreamDemo1` 的需求是：从名字列表里找出**姓张且名字为三个字**的人，放进新列表。

传统循环写法：

```java
List<String> result = new ArrayList<>();
for (String name : names) {
    if (name.startsWith("张") && name.length() == 3) {
        result.add(name);
    }
}
```

Stream 写法：

```java
List<String> result = names.stream()
        .filter(name -> name.startsWith("张"))
        .filter(name -> name.length() == 3)
        .collect(Collectors.toList());
```

这两个 `filter()` 相当于连续设置两个筛选条件：必须**同时通过**，才会进入结果。你的示例会得到“张无忌”“张三丰”“张翠山”，不包含只有两个字的“张强”。

`filter()` 接收一个判断条件（`Predicate` 函数式接口）；Lambda 的参数 `name` 是流中当前处理到的元素，返回 `true` 才保留。

## 3.一条流水线的三个部分：

| 部分 | 示例 | 作用 |
| --- | --- | --- |
| 获取流 | `names.stream()` | 从数据源得到 Stream |
| 中间操作 | `filter(...)` | 描述如何处理元素，通常还能继续接其他操作 |
| 终结操作 | `collect(...)`、`count()` | 真正触发处理并产生结果 |

```java
long count = names.stream()
        .filter(name -> name.startsWith("张"))
        .count();
```

中间操作通常是**惰性的**：只写 `filter()` 不会立刻把全部数据筛选完；遇到 `collect()`、`count()` 等终结操作，才开始执行整条流水线。终结后的同一个 Stream 不能再使用，需要从数据源重新获取一个流。

`collect(Collectors.toList())` 收集为 `List`；`count()` 统计元素数量，返回 `long`。筛选不会直接修改原来的 `names` 列表。

## 4.从不同数据源获取 Stream：

`StreamDemo2` 展示了下面几种方式：

| 数据源 | 写法 | 得到的元素类型 |
| --- | --- | --- |
| 单列集合 `Collection<String>` | `list.stream()` | `String` |
| `Map<String, Integer>` 的键 | `map.keySet().stream()` | `String` |
| `Map<String, Integer>` 的值 | `map.values().stream()` | `Integer` |
| `Map<String, Integer>` 的键值对 | `map.entrySet().stream()` | `Map.Entry<String, Integer>` |
| `String[]` 数组 | `Arrays.stream(arr)` | `String` |
| 给定元素或数组 | `Stream.of("a", "b", "c")`、`Stream.of(arr)` | `String` |

```java
String[] arr = {"a", "b", "c"};
Stream<String> stream = Arrays.stream(arr);
System.out.println(stream.count()); // 3
```

`Map` 本身没有 `stream()` 方法，先通过 `keySet()`、`values()` 或 `entrySet()` 取得对应的集合视图，再调用 `.stream()`。需要同时使用键和值时，通常选择 `entrySet().stream()`。

`Arrays.stream(arr)` 和当前示例中的 `Stream.of(arr)` 都能把 `String[]` 中的三个字符串作为流元素；`Stream.of("a", "b", "c")` 则直接列出要放进流的元素。

## 5.常见 Stream 操作 API：

### 中间操作：仍返回 Stream，可以继续链式调用

| API | 作用 | 例子 |
| --- | --- | --- |
| `filter(predicate)` | 保留满足条件的元素 | `filter(s -> s.length() == 3)` |
| `map(function)` | 把每个元素转换成另一个值 | `map(String::length)`：名字变长度 |
| `distinct()` | 去重 | `distinct()`；对象去重依赖 `equals()`/`hashCode()` |
| `sorted()` | 按自然顺序排序 | `sorted()`；元素需能比较 |
| `sorted(comparator)` | 按指定规则排序 | `sorted(Comparator.reverseOrder())` |
| `limit(n)` | 最多保留前 `n` 个 | `limit(3)` |
| `skip(n)` | 跳过前 `n` 个 | `skip(2)` |
| `flatMap(function)` | 把每个元素变成一个流，再合并为一条流 | 一个句子列表展开成单词流；先认识即可 |

例如把名字按长度排序，再取前三个：

```java
List<String> firstThree = names.stream()
        .sorted(Comparator.comparingInt(String::length))
        .limit(3)
        .collect(Collectors.toList());
```

`map()` 与 `filter()` 不同：`filter()` 决定**留不留**，`map()` 决定**变成什么**。`sorted()`、`distinct()` 等操作可能需要观察多个元素，仍属于中间操作，不会单独触发整条流水线。

```java
List<Integer> lengths = names.stream()
        .map(String::length)
        .toList(); // 每个名字转换成对应的长度
```

### 终结操作：得到结果或执行动作，流随之结束

| API | 结果 | 说明 |
| --- | --- | --- |
| `forEach(action)` | `void` | 对每个元素执行操作；常用来打印，不是收集列表 |
| `count()` | `long` | 统计元素数量 |
| `findFirst()` | `Optional<T>` | 查找第一个元素；流可能为空 |
| `anyMatch(predicate)` | `boolean` | 是否至少有一个元素满足条件 |
| `allMatch(predicate)` | `boolean` | 是否所有元素都满足条件 |
| `noneMatch(predicate)` | `boolean` | 是否没有元素满足条件 |
| `min(comparator)`、`max(comparator)` | `Optional<T>` | 根据比较规则取最小、最大元素 |
| `collect(collector)` | 由收集器决定 | 常用于收集到集合或分组 |
| `toList()` | `List<T>` | 直接收集到一个不可修改的列表（当前 JDK 25 可用） |

`Optional<T>` 表示“可能有一个 `T`，也可能没有”，因此不要在流可能为空时直接调用 `get()`；入门时可用 `orElse(默认值)`：

```java
String first = names.stream()
        .filter(s -> s.startsWith("张"))
        .findFirst()
        .orElse("没找到");

boolean hasShortName = names.stream().anyMatch(s -> s.length() < 3);
```

`findFirst()` 的“第一个”取决于数据源的遍历顺序；若源是 `HashSet`，不要期待它始终对应某个固定元素。

### 常见收集器：配合 `collect()` 使用

| 写法 | 得到什么 |
| --- | --- |
| `collect(Collectors.toList())` | `List<T>`；你在 `StreamDemo1` 已使用 |
| `collect(Collectors.toSet())` | `Set<T>`；去重，具体遍历顺序不保证 |
| `collect(Collectors.joining(", "))` | 把字符串连接成一个字符串 |
| `collect(Collectors.groupingBy(...))` | 按指定规则分组，得到 `Map`；稍后学也可以 |
| `collect(Collectors.toMap(键函数, 值函数))` | 把元素转换成 `Map`；键不能重复，否则会抛异常 |

```java
String joined = names.stream()
        .filter(s -> s.startsWith("张"))
        .collect(Collectors.joining("、"));
```

`toList()` 和 `collect(Collectors.toList())` 都能得到列表，但**不要假定两者得到的列表可修改性相同**：`Stream.toList()` 返回不可修改的列表；`Collectors.toList()` 不承诺具体列表实现及可修改性。[Stream API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/Stream.html)、[Collectors API](https://docs.oracle.com/en/java/javase/25/docs/api/java.base/java/util/stream/Collectors.html)可查完整方法说明。

## 6.结合 `StreamDemo3`：中间操作与合并流

```java
scores.stream().sorted().forEach(System.out::println); // Double 的自然顺序：升序
scores.stream().sorted((a, b) -> Double.compare(b, a))
        .limit(2).forEach(System.out::println);          // 降序后只取前两个
scores.stream().distinct().forEach(System.out::println); // 去重
scores.stream().map(s -> "加十分后：" + (s + 10))
        .forEach(System.out::println);                    // Double 转成 String
```

`sorted(比较器)` 可以临时指定排序规则；`map()` 可以改变流中的元素类型。这里的 `forEach()` 是终结操作，负责逐个输出，并不返回一个集合。

不同类型的流也能合并：

```java
Stream<String> names = Stream.of("Andy", "DouBao");
Stream<Integer> numbers = Stream.of(1, 2);
Stream<Object> both = Stream.concat(names, numbers);
```

合并后元素的共同类型是 `Object`；`names` 和 `numbers` 已作为合并流的输入，不要再单独使用它们。`concat()` 得到的流仍需终结操作才会处理。

## 7.结合 `StreamDemo4`：怎样接收处理结果

**中间操作返回的还是 Stream；真正接收结果，要看终结操作的返回类型。**

| 需求 | 写法 | 接收类型 |
| --- | --- | --- |
| 统计人数 | `teachers.stream().filter(t -> t.getAge() < 25).count()` | `long` |
| 找最高工资的老师 | `teachers.stream().max((a, b) -> Double.compare(a.getSalary(), b.getSalary()))` | `Optional<Teacher>` |
| 收集成列表 | `stream.collect(Collectors.toList())` | `List<Teacher>` |
| 收集成集合 | `stream.collect(Collectors.toSet())` | `Set<Teacher>` |
| 收集成数组 | `stream.toArray()` | `Object[]` |
| 收集成映射 | `stream.collect(Collectors.toMap(Teacher::getName, Teacher::getSalary))` | `Map<String, Double>` |
| 只逐个处理 | `stream.forEach(System.out::println)` | 没有返回值（`void`） |

`toMap()` 的两个参数分别是**从元素取得键**、**从元素取得值**的函数。`Teacher::getName` 和 `Teacher::getSalary` 是方法引用。若两个老师同名，默认 `toMap()` 会因重复键抛异常，需要另行指定合并规则；也不要依据普通 `Map` 的打印顺序判断流的排序结果。

```java
List<Teacher> result = teachers.stream()
        .filter(t -> t.getName().startsWith("A"))
        .collect(Collectors.toList());

Teacher highest = teachers.stream()
        .max((a, b) -> Double.compare(a.getSalary(), b.getSalary()))
        .orElse(null); // 空流时使用默认值；直接 get() 可能抛异常
```

一个 Stream 只能终结一次。`StreamDemo4` 中 `s1.collect(...)` 后若还要收集为 `Set`，必须重新从 `teachers.stream()` 建立流水线。若想得到 `Teacher[]`，可用 `toArray(Teacher[]::new)`；无参数的 `toArray()` 得到 `Object[]`。

## 8.`testdemo`：可变参数和 `Collections`

`ParamDemo1` 的 `int... num` 表示接收零个或多个 `int`；在方法内部，`num` 就是 `int[]`。所以 `sum()`、`sum(1, 2, 3)`、`sum(new int[]{1, 2, 3})` 都能调用同一个方法。一个方法最多只能有一个可变参数，且它必须放在参数列表最后。

`CollectionsDemo2` 用的是集合工具类 `Collections`：

| 方法 | 用途 |
| --- | --- |
| `Collections.addAll(list, "Anran", "Bobo", "Candy")` | 批量向已有集合添加元素，使用了可变参数 |
| `Collections.shuffle(list)` | 打乱列表中元素的顺序，会改变原列表 |
| `Collections.sort(list)` / `list.sort(rule)` | 对列表排序，会改变原列表；后者可传入 `Comparator` |

`Collections` 是工具类，`Collection` 是集合接口，`Collectors` 是 Stream 收集器工具类，名字相近但用途不同。

## 9.`Comparable` 与 `Comparator`：扑克牌排序练习

| 接口 | 实现位置 | 要重写的方法 | 适用情形 |
| --- | --- | --- | --- |
| `Comparable<Card>` | `Card` 类内部 | `compareTo(Card other)` | 牌自身有一个默认顺序 |
| `Comparator<Card>` | 独立的 `CardComparator` 类 | `compare(Card a, Card b)` | 把排序规则与牌的数据分开，或需要多套规则 |

你的扑克牌练习选择了第二种：`Card` 保存点数和花色，`CardComparator` 按**点数优先、花色其次**比较，再在 `Room` 中给三位玩家的手牌分别调用 `sort(new CardComparator())`。规则较长时，独立比较器比把大段 Lambda 写在 `sort()` 里更清楚；规则长短本身并不强制选择哪个接口。

比较结果遵循：负数表示前者小，0 表示按该规则相等，正数表示前者大。`List.sort()` / `Stream.sorted()` **不会因为比较结果为 0 就删除元素**；`TreeSet` 等有序去重集合则会用比较结果判断元素是否重复。因此 `Teacher.compareTo()` 中年龄相同返回 0，并不会让 `List` 排序时自动只剩一个老师。

### 扑克牌练习完整流程

| 类 | 职责 |
| --- | --- |
| `Card` | 保存牌的点数、花色，并用 `toString()` 显示牌面 |
| `CardComparator` | 规定点数 `3`～`2`、大小王及花色的比较顺序 |
| `Room` | 创建 54 张牌、洗牌、发牌、留底牌、给地主加底牌、排序与展示 |
| `Game` | 创建 `Room`，调用 `start()` 开始一局 |

`Room` 用实例代码块初始化牌堆：13 种点数各配 4 种花色，得到 52 张，再加入两张王。`Collections.shuffle(cards)` 打乱原列表；按索引 `i % 3` 轮流发前 51 张，每人先得 17 张。

```java
List<Card> lastCards = cards.subList(cards.size() - 3, cards.size());
a.addAll(lastCards); // 示例中指定 A 为地主，获得 3 张底牌
```

`subList(起始下标, 结束下标)` 左闭右开，这里取最后 3 张。它返回原列表的一段**视图**；`addAll()` 把这三张牌的引用加入 A 的手牌，最终 A 有 20 张，B、C 各 17 张。若以后需要独立的底牌列表，可写 `new ArrayList<>(cards.subList(...))`。

三副手牌分别用 `CardComparator` 排序，再遍历 `players.entrySet()` 输出。`HashMap` 不保证 A、B、C 的打印先后顺序；它不影响各人手牌的内容和排序。本练习目前做到发牌与展示，还没有实现真正的抢地主或出牌规则，代码中直接假设 A 是地主。

## 10.现阶段记住这些

```text
集合/数组 → 获取 Stream → 中间操作（可接多个）→ 终结操作
```

- Stream 是一次性的处理流水线，不是集合；执行终结操作后，要从数据源重新获取流。
- `filter()` 负责筛选，`map()` 负责转换，`sorted()` 负责排序。
- 终结操作的返回值决定接收类型：`count()` 是 `long`，`max()` 是 `Optional<T>`，`collect(...)` 由收集器决定。
- `Comparable` 写对象自身的默认顺序；`Comparator` 写可独立使用的比较规则。
