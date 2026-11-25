# Java 集合笔记

本章对应 `13-collection` 的集合练习，以及 `14-map-stream` 中的 `hashset`、`map` 和 `practice` 练习，并结合两张课堂截图整理集合体系与常用方法。

## 1.集合体系：

`Collection<E>` 是**单列集合**的根接口，规定了添加、删除、判断、遍历等通用操作。`List` 和 `Set` 继承它，具体实现类再提供各自的特点。

```text
Collection<E>（接口）
├── List<E>（接口）
│   ├── ArrayList<E>（实现类）
│   └── LinkedList<E>（实现类）
└── Set<E>（接口）
    ├── HashSet<E>（实现类）
    │   └── LinkedHashSet<E>（实现类）
    └── TreeSet<E>（实现类）
```

这里讨论的是单列集合；存储“键 → 值”的 `Map` 不属于 `Collection` 这棵继承树。

## 2.`List` 与 `Set` 的区别：

| 集合 | 元素顺序 | 重复元素 | 按索引访问 |
| --- | --- | --- | --- |
| `List` | 保留元素的位置顺序 | 允许 | 可以 |
| `Set` | 由具体实现决定 | 不允许 | 不可以 |

`CollectionDemo1` 中，`List<String>` 加入两次 `"Java"` 后，两份都会保留；`Set<String>` 加入两次相同字符串后只保留一份。

代码里的 `list.getFirst()` 读取列表第一个元素；你当前的 JDK 25 支持它。若使用较旧的 JDK，也可以在列表非空时用 `list.get(0)`。

这里的 **`List`“有序”是指元素有先后位置，不是自动按字母或数字排序**。图片中把 `Set` 概括为“无序”，作为入门记忆可以，但更准确地说，`Set` 接口本身**不保证一种统一的迭代顺序**：

| 实现类 | 迭代时的顺序 | 重复元素 | 索引 |
| --- | --- | --- | --- |
| `ArrayList`、`LinkedList` | 按列表中的位置顺序 | 可重复 | 有 |
| `HashSet` | 不保证顺序 | 不重复 | 无 |
| `LinkedHashSet` | 按插入顺序 | 不重复 | 无 |
| `TreeSet` | 默认按自然顺序排序，也可指定比较规则 | 不重复 | 无 |

`Set` 判断“重复”不是看 `toString()` 是否一样；使用自定义对象时，还会涉及 `equals()`、`hashCode()` 或排序比较规则，学到这些实现类时再展开。

## 3.`Collection` 常用方法：

截图中的方法是 `List`、`Set` 等单列集合共享的基础操作。下面按 Java 实际方法签名整理：

| 方法 | 作用 | 常见返回值 |
| --- | --- | --- |
| `add(E e)` | 添加元素 | 是否使集合发生变化 |
| `clear()` | 清空集合 | 无返回值 |
| `remove(Object o)` | 删除一个匹配的元素 | 是否成功删除 |
| `contains(Object o)` | 判断是否包含某元素 | `boolean` |
| `isEmpty()` | 判断集合是否为空 | `boolean` |
| `size()` | 获取元素数量 | `int` |
| `toArray()` | 转为 `Object[]` | `Object[]` |

截图把删除写为 `remove(E e)`，但 `Collection` 中的实际签名是 **`remove(Object o)`**。注意 `Set.add()` 遇到已存在的元素时通常返回 `false`，因为集合没有变化。

你的 `CollectionDemo2` 用 `Collection<String> list = new ArrayList<>();` 说明：**左边用接口类型，也能调用接口规定的通用方法；右边决定实际使用哪种集合实现。**

```java
Collection<String> words = new ArrayList<>();
words.add("a");
words.add("b");
System.out.println(words.size());       // 2
System.out.println(words.contains("a")); // true
words.remove("a");
words.clear();
System.out.println(words.isEmpty());    // true
```

因为变量类型是 `Collection<String>`，它不能直接调用只属于 `List` 的 `get(index)`；要按索引取元素，可以声明为 `List<String>` 或 `ArrayList<String>`。

### 转成数组

```java
Object[] arr1 = words.toArray();
String[] arr2 = words.toArray(String[]::new);
```

无参 `toArray()` 返回 `Object[]`。带 `String[]::new` 的写法按集合元素类型创建 `String[]`，这里的构造器引用与你在函数式编程中学过的知识相连。

## 4.遍历集合：

`CollectionTravelDemo3` 展示了几种写法。

### 迭代器

```java
Iterator<String> it = words.iterator();
while (it.hasNext()) {
    String word = it.next();
    System.out.println(word);
}
```

迭代器刚创建时位于第一个元素之前。`hasNext()` 判断后面是否还有元素，`next()` 取出下一个元素并向前移动。不能在没有下一个元素时继续调用 `next()`。

### 增强 `for`

```java
for (String word : words) {
    System.out.println(word);
}
```

适合只需依次读取元素的场景，不直接提供索引。底层也是利用迭代器进行遍历。

### `forEach`、Lambda 和方法引用

```java
words.forEach(word -> System.out.println(word));
words.forEach(System.out::println);
```

`forEach` 接收一个 `Consumer`，对每个元素执行操作。后一行是前一行的简化方法引用；你的示例也写了 `new Consumer<String>() { ... }` 的匿名内部类形式。

## 5.遍历时删除元素：

`CollectionTravelDemo4` 练习了删除所有包含“枸杞”的字符串。用下标从前往后删除时，后面的元素会前移；如果 `i` 仍继续加一，就可能**漏删**。可以删除后 `i--`，也可以倒序遍历。

使用迭代器遍历时，应通过**迭代器自己的 `remove()`** 删除刚刚由 `next()` 取出的元素：

```java
Iterator<String> it = list.iterator();
while (it.hasNext()) {
    String value = it.next();
    if (value.contains("枸杞")) {
        it.remove();
    }
}
```

不要在迭代器、增强 `for` 或 `forEach` 遍历过程中直接调用 `list.remove(...)` 修改同一个集合；这可能触发 `ConcurrentModificationException`。这里的“并发修改”**不一定涉及多线程**，单线程遍历时结构被其他方式改动也可能发生。

如果只是“按条件删除”，还可以直接用 `list.removeIf(value -> value.contains("枸杞"))`。因此不是说 Lambda 完全不能用于删除，而是不要在 `forEach` 内直接改动正在遍历的集合。

## 6.`LinkedList` 实现队列和栈：

你的 `LinkListDemo1/2` 用 `LinkedList` 练习了两种数据进出规则。

| 结构 | 规则 | 入 | 出 |
| --- | --- | --- | --- |
| 队列 | 先进先出（FIFO） | `addLast(e)` 或 `add(e)` | `removeFirst()` |
| 栈 | 后进先出（LIFO） | `addFirst(e)` 或 `push(e)` | `removeFirst()` 或 `pop()` |

```java
LinkedList<String> queue = new LinkedList<>();
queue.add("a");
queue.add("b");
System.out.println(queue.removeFirst()); // a：先入先出

LinkedList<String> stack = new LinkedList<>();
stack.push("a");
stack.push("b");
System.out.println(stack.pop()); // b：后入先出
```

`push(e)` 相当于把元素放到链表头部，`pop()` 从头部取出并删除。`removeFirst()`、`pop()` 在空集合上调用会抛异常，取之前可先判断是否为空。

**本章核心：先区分 `List` 与 `Set` 的需求，再选具体实现；遍历中删除元素时，注意使用迭代器的 `remove()` 或集合的 `removeIf()`。**

## 7.综合练习：电影信息操作系统

`practice1` 把前面学过的集合、对象、方法拆分、循环和异常处理组合到一个控制台小项目中：

```text
Test.main() → 创建 MovieService 并启动菜单
MovieService → 保存电影列表，负责上架、下架、查询、按演员批量删除
Movie → 保存电影名、评分、主演、票价
```

`Movie` 使用 Lombok 的 `@Data`、`@AllArgsConstructor`、`@NoArgsConstructor` 自动生成常用方法和构造方法。Lombok 是额外的工具库，不是 Java 语言自带的关键字；项目要正确配置 Lombok 才能使用这些自动生成的方法。

### 集合保存与查询

`MovieService` 用 `ArrayList<Movie>` 保存多部电影。上架时创建 `Movie` 对象并加入列表；`queryMovieByName(name)` 用增强 `for` 逐个查找，找到就返回对象，找不到返回 `null`：

```java
for (Movie movie : movies) {
    if (movie.getName().equals(name)) {
        return movie;
    }
}
return null;
```

调用处要判断是否为 `null`，再读取电影信息。下架时先找到目标对象，再用 `movies.remove(movie)` 删除；电影重名时，当前方法只会找到并删除**第一部**匹配的电影。

### 按演员批量删除

“封杀某个明星”需要删除该演员的**所有电影**，你的代码使用迭代器遍历，并通过 `it.remove()` 安全删除当前元素：

```java
Iterator<Movie> it = movies.iterator();
while (it.hasNext()) {
    Movie movie = it.next();
    if (movie.getActor().equals(actor)) {
        it.remove();
    }
}
```

`hasActor` 用于记录是否真的删到了电影；若一部都没有，就提示用户重新输入。这里很好地应用了前一节“遍历时不能随意用 `movies.remove(...)`”的知识。

### 输入与异常处理

菜单使用 `while (true)` 持续运行，输入 `5` 时 `return` 结束 `start()`。评分和票价读取使用 `try-catch`：输入不是数字时，`Scanner.nextDouble()` 抛出 `InputMismatchException`；捕获后用 `sc.next()` 消费错误输入，再让用户重试。负数则通过条件判断提示不合法，也可以不专门抛一个异常。这里捕获具体的异常类型通常比一律 `catch (Exception e)` 更清楚。

### 练习中修正的地方

`addMovie()` 原先在“请输入票价”时再次给 `score` 赋值，并把 `score` 同时传给评分和票价字段，导致原评分被覆盖。现已改为让票价输入、校验、创建对象和成功提示都使用 `price`：

```java
price = sc.nextDouble();
// 验证 price 后：
movies.add(new Movie(name, score, actor, price));
```

另外，`Scanner.next()` 通常会跳过空白并等待下一个词，因此 `name.equals("")`、`actor != null` 这类检查不能有效验证“用户只按了回车”；若以后需要允许带空格的电影名或演员名，再考虑按整行读取。

## 8.`Set` 集合专题：

`Set` 不保留重复元素，也没有索引；它可以像 `Collection` 一样用 `add()`、`remove()`、`contains()` 和增强 `for` 等方法。具体的**迭代顺序和判重规则**要看实现类，不能把所有 `Set` 都理解成“随机摆放”。

### `HashSet` 与 `LinkedHashSet`

`SetDemo1` 对比了两者：

```java
Set<String> names = new LinkedHashSet<>();
names.add("Anran");
names.add("Anran");
names.add("Bobo");
System.out.println(names); // [Anran, Bobo]
```

两者都不重复、无索引。`HashSet` **不保证遍历顺序**，不能依赖某一次打印结果；`LinkedHashSet` 保留元素的**插入顺序**。对于自定义对象，`HashSet` 要正确去重，通常需要让对象的 `equals()` 和 `hashCode()` 配合：

1. `hashCode()` 帮助集合定位元素；哈希值相同**不一定**代表对象相等。
2. 再用 `equals()` 判断两个对象在业务意义上是否相同。
3. 若两个对象 `equals()` 为 `true`，它们的 `hashCode()` 必须相同。

`SetDemo2` 两次添加字段相同的 `Student`。类上的 Lombok `@Data` 生成了 `equals()` 和 `hashCode()`，因此相同字段的学生会被当作重复对象，只保留一份。`SetDemo1` 打印字符串的 `hashCode()`，只是帮助观察哈希值；**不能单看哈希值就判定两个对象相等**。

从实现结构看，可以先把 `HashSet` 理解为借助哈希表存储元素；哈希冲突时会用链表等结构，条件满足时也可能用树结构。学习应用时，先掌握“去重依赖 `equals()`/`hashCode()`”比记内部细节更重要。

### `TreeSet`：排序与比较规则

`TreeSet` 也不重复、无索引，但遍历时按比较规则排序。`SetDemo1` 的 `TreeSet<Integer>` 会按整数的自然顺序输出；自定义的 `Teacher` 则需要提供比较规则，常见两种方式：

| 方式 | 写在哪里 | 对应示例 |
| --- | --- | --- |
| 自然排序：实现 `Comparable<Teacher>` 并重写 `compareTo()` | `Teacher` 类内部 | 你的 `Teacher.compareTo()` 按年龄比较 |
| 外部排序：创建 `TreeSet` 时传入 `Comparator<Teacher>` | 集合创建处 | `SetDemo3` 中的匿名内部类按年龄比较 |

```java
TreeSet<Teacher> teachers = new TreeSet<>(
        (a, b) -> Integer.compare(a.getAge(), b.getAge()));
```

**当前 `SetDemo3` 传入了 `Comparator`，所以采用的是这个外部规则；`Teacher.compareTo()` 此时不会参与排序。** 比较结果小于 `0`、等于 `0`、大于 `0`，分别表示排在前面、视为相等、排在后面。

`TreeSet` 把**比较结果为 `0`** 的两个元素视为重复。你的比较器只比较年龄，因此“老陈”和“老李”虽然姓名、薪水不同，但都为 40 岁，只会保留一个。如果想按年龄排序，同时保留不同姓名的老师，可以在年龄相同时继续比较姓名：

```java
TreeSet<Teacher> teachers = new TreeSet<>((a, b) -> {
    int result = Integer.compare(a.getAge(), b.getAge());
    return result != 0 ? result : a.getName().compareTo(b.getName());
});
```

这里仍会把**同年龄且同姓名**的两位老师视为重复；如果业务上连他们也要区分，就需要再比较一个能区分身份的字段。与 `HashSet` 不同，`TreeSet` 的这个判重依据来自比较规则，不是单纯看对象的 `equals()`。

**选用提示：需要普通去重用 `HashSet`；还要保持插入顺序用 `LinkedHashSet`；要排序去重用 `TreeSet`，并特别留意比较结果为 `0` 的含义。**

## 9.`Map`：用键找到值

`Map<K, V>` 保存一组组**键 → 值**，例如“用户名 → 年龄”“景点 → 选择人数”。它是双列集合，不继承 `Collection`：

```java
Map<String, Integer> ages = new HashMap<>();
ages.put("Anran", 20);
ages.put("Bobo", 21);
ages.put("Anran", 25); // 同一个键再次 put，替换原来的值
System.out.println(ages.get("Anran")); // 25
```

**键不能重复，值可以重复。**这里的“不重复”只约束键；`put` 已存在的键时覆盖旧值，通常不增加 `size()`。`Map` 没有按数字索引取元素的 `get(index)`；`get(key)` 是**根据键**取值。

| 实现类 | 键的遍历顺序 | 键的判重依据 | 适合场景 |
| --- | --- | --- | --- |
| `HashMap` | 不保证顺序 | `hashCode()`、`equals()` | 按键快速查找，不关心顺序 |
| `LinkedHashMap` | 默认按键的插入顺序 | `hashCode()`、`equals()` | 需要按加入顺序展示 |
| `TreeMap` | 按键的自然顺序或指定比较器排序 | 比较结果为 `0` | 需要按键排序展示 |

`MapDemo1` 用 `LinkedHashMap`，所以替换 `"Anran"` 的值后，它仍处于原来的插入位置。`HashMap` 的一次打印结果不能当作固定顺序；`MapDemo2`、`MapTraverseDemo3` 中注释写的“有序”和示例输出顺序，不是 `HashMap` 的保证。

你的 `HashMap`、`LinkedHashMap` 示例放入了一个 `null` 键和 `null` 值；`TreeMap` 在默认自然排序下不能直接比较 `null` 键。`get(key)` 返回 `null` 时，可能是键不存在，也可能是键存在但值为 `null`，可用 `containsKey(key)` 区分。

### `Map` 常用 API

| 方法 | 用途 |
| --- | --- |
| `put(key, value)` | 添加键值对；键已存在时替换旧值 |
| `get(key)` | 根据键取值；找不到通常返回 `null` |
| `remove(key)` | 删除指定键及其值，返回旧值 |
| `containsKey(key)` | 判断是否包含键 |
| `containsValue(value)` | 判断是否包含值 |
| `size()`、`isEmpty()`、`clear()` | 数量、判空、清空 |
| `keySet()` | 取得所有键的 `Set` 视图 |
| `values()` | 取得所有值的 `Collection` 视图，值可以重复 |
| `entrySet()` | 取得所有键值对的 `Set<Map.Entry<K, V>>` 视图 |

`put()` 返回该键原来的值；若原本没有该键，一般返回 `null`。`keySet()`、`values()`、`entrySet()` 是与原 `Map` 关联的**视图**，不是各自独立复制的一份数据。

### 遍历 `Map`

`MapTraverseDemo3` 练了三种方式：

```java
// 1.先遍历键，再按键取值
for (String key : map.keySet()) {
    System.out.println(key + " : " + map.get(key));
}

// 2.直接遍历键值对；键和值都要用时更直接
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    System.out.println(entry.getKey() + " : " + entry.getValue());
}

// 3.Lambda：forEach 接收两个参数的操作
map.forEach((key, value) -> System.out.println(key + " : " + value));
```

第三种的参数类型是 `BiConsumer<K, V>`，可理解为“接收键和值并执行一次操作”；你的代码还写了匿名内部类版本。遍历 `HashMap` 时，不要依赖键值对的出现顺序。

### `TreeMap` 的自定义键排序

`MapDemo4` 的键是 `Teacher` 对象。可以让 `Teacher implements Comparable<Teacher>` 并重写 `compareTo()`，也可以在创建 `TreeMap` 时传入 `Comparator<Teacher>`。若传入了比较器，就优先采用比较器，不再使用类自身的 `compareTo()`。

和 `TreeSet` 一样，**比较结果为 `0` 的两个键会被视为同一个键**。你的 `Teacher` 只按年龄比较；两位老师年龄相同，即使姓名不同，后一次 `put` 也会替换前一个键对应的值。若需要同时保留，可在年龄相同时继续比较姓名等字段。

注意 `MapDemo4` 第二段虽然创建了 `map1`，后面的 `put()` 和打印却仍使用 `map`，所以目前没有展示第二个比较器的效果；要观察它，需要操作并打印 `map1`。

## 10.综合练习：统计最热门景点

`14-map-stream` 的 `practice/Test` 先生成 80 个景点选择，保存在 `List<String>`；再用 `Map<String, Integer>` 记录每个景点出现的次数：

```java
for (String place : choices) {
    if (!counts.containsKey(place)) {
        counts.put(place, 1);
    } else {
        counts.put(place, counts.get(place) + 1);
    }
}
```

最后遍历 `entrySet()`，用 `max` 和 `maxName` 找到最高票数及景点名。这正是 `Map` 适合做的“**按键累计次数**”场景。这里用 `HashMap`，如果出现票数并列，哪一个景点先被遍历到不保证固定；若题目要求并列都输出，还需要单独处理并列情况。

## 11.集合大总结与选型比较：

先问自己：数据是**一个个元素**，还是**键值对应关系**？

```text
集合
├── 单列：Collection<E>
│   ├── List<E>：有位置，可重复
│   └── Set<E>：不重复，无索引
└── 双列：Map<K, V>：键 → 值，键不重复
```

| 类型 | 典型实现 | 重复规则 | 顺序规则 | 典型用途 |
| --- | --- | --- | --- | --- |
| `List` | `ArrayList` | 元素可重复 | 保留位置顺序，可按索引访问 | 电影列表、借书记录 |
| `List` | `LinkedList` | 元素可重复 | 保留位置顺序，可从两端操作 | 队列、栈练习 |
| `Set` | `HashSet` | 元素不重复 | 不保证遍历顺序 | 普通去重 |
| `Set` | `LinkedHashSet` | 元素不重复 | 按插入顺序 | 去重且保留加入顺序 |
| `Set` | `TreeSet` | 比较结果为 `0` 时视为重复 | 按元素排序 | 排序且去重 |
| `Map` | `HashMap` | 键不重复，值可重复 | 不保证遍历顺序 | 按键查值、计数 |
| `Map` | `LinkedHashMap` | 键不重复，值可重复 | 默认按键插入顺序 | 按加入顺序展示键值对 |
| `Map` | `TreeMap` | 键比较结果为 `0` 时视为重复 | 按键排序 | 按键排序展示 |

**选择口诀：要位置用 `List`；要去重用 `Set`；要通过键找值用 `Map`。再按是否需要插入顺序或排序，选择普通版、`LinkedHash...` 版或 `Tree...` 版。**

最后区分三个容易混淆的词：

- **有序**：`List` 有元素位置，`LinkedHashSet` / `LinkedHashMap` 保持插入顺序；不等于“自动排序”。
- **排序**：`TreeSet` 排元素，`TreeMap` 排键；比较规则同时影响判重。
- **无序**：`HashSet` / `HashMap` 不承诺迭代顺序，不代表每次打印都必然乱序。
