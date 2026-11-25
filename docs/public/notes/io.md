# 文件与 IO 流笔记

对应 `15-file-io` 中目前完成的 `File`、递归、字符编码、文件字节输入流和文件字节输出流示例。

## 1.`File`：表示文件或目录的路径

`new File(路径)` 创建的是**路径对象**，不会自动在磁盘上创建文件或文件夹。相对路径通常相对于程序运行时的工作目录；在本项目根目录运行时，`15-file-io/src/anran.txt` 指向该模块中的文件。也可以使用绝对路径。

| 方法 | 含义 |
| --- | --- |
| `exists()` | 路径是否存在 |
| `isFile()` / `isDirectory()` | 是否为普通文件 / 目录 |
| `getName()` / `getAbsolutePath()` | 名称 / 绝对路径 |
| `length()` | 文件大小，单位是**字节** |
| `createNewFile()` | 文件不存在时创建空文件，可能抛出 `IOException` |
| `mkdir()` / `mkdirs()` | 创建单级目录 / 连同缺失的父目录一起创建 |
| `delete()` | 删除文件或**空目录**；返回是否成功，不会自动删除非空目录 |

```java
File file = new File("15-file-io/src/anran.txt");
System.out.println(file.exists());
System.out.println(file.length());
```

`File` 负责描述和管理路径，不负责读取或写入文件内容；读写内容要用后面的 IO 流。

### 遍历目录

- `list()` 返回当前目录下的一级名称数组 `String[]`。
- `listFiles()` 返回当前目录下的一级 `File[]`，便于继续判断文件类型或递归进入子目录。
- 空目录通常返回空数组；路径不存在、不是目录或无法访问时，可能返回 `null`。遍历前要判断 `files != null`。

## 2.递归与文件搜索

递归就是方法调用自身，关键是**终止条件**和**问题逐步变小**。`RecursionDemo1` 用 `f(n) = n * f(n - 1)` 计算阶乘，并用 `n == 0 || n == 1` 结束递归。

`FileSearchDemo1` 的搜索步骤：检查目录参数 → `listFiles()` 取一级内容 → 遇到文件则检查名称 → 遇到子目录则递归搜索。目录不可访问时 `listFiles()` 可返回 `null`，因此代码先判断再遍历。

注意：当前 `searchFile()` 在找到匹配文件后使用的 `return` 只结束**当前这一次方法调用**，外层递归仍可能继续搜索其他目录；它不是“找到一个就终止整个搜索”的实现。另外，`contains(filename)` 是包含匹配；需要精确文件名时可用 `equals(filename)`。

## 3.字符编码：`String` 与字节之间转换

**编码**：字符 → 字节；**解码**：字节 → 字符。写入和读取文本时应使用相同字符集，否则可能出现乱码。

```java
byte[] bytes = "我爱你中国".getBytes("GBK"); // 按 GBK 编码
String text = new String(bytes, "GBK"); // 按 GBK 解码
```

`CharSetDemo1` 还用 `Arrays.toString(bytes)` 观察编码后的字节。`getBytes()` 和 `new String(bytes)` 不指定字符集时使用默认字符集，不要依赖运行环境碰巧一致；实际项目通常明确指定，例如 `StandardCharsets.UTF_8`。

## 4.文件字节输入流：读文件

`InputStream` 是字节输入流的父类；`FileInputStream` 从文件读取字节。**输入**是相对于程序而言：文件 → 程序。`read()` 返回 `int`，读取结束时返回 `-1`。

| 方式 | 示例 | 特点 |
| --- | --- | --- |
| 每次一个字节 | `int b = is.read()` | 简单，但频繁读取效率较低；不能直接把中文的单个字节转成字符 |
| 每次读入缓冲数组 | `int len = is.read(buffer)` | 只使用本次实际读到的 `len` 个字节；汉字等多字节字符可能跨两次读取 |
| 一次性读取 | `byte[] all = is.readAllBytes()` | 可一次解码完整内容；文件较大时会占用大量内存 |

```java
try (InputStream is = new FileInputStream("15-file-io/src/test1.txt")) {
    byte[] bytes = is.readAllBytes();
    System.out.println(new String(bytes, StandardCharsets.UTF_8));
}
```

`read(buffer)` 可能只读入一部分，所以处理时用 `new String(buffer, 0, len, StandardCharsets.UTF_8)`，不能无视 `len`。但即使这样，**每批单独解码**仍可能切断一个汉字；完整文本可先读完再解码，后续还会学到专门处理字符的流。`try` 后的括号是自动关闭资源的写法；当前 `FileInputStreamDemo1/2/3` 尚未关闭输入流，练习后应养成关闭习惯。

## 5.文件字节输出流：写文件

`OutputStream` 是字节输出流的父类；`FileOutputStream` 向文件写入字节。**输出**是程序 → 文件。

```java
try (OutputStream os = new FileOutputStream("15-file-io/src/test2.txt")) {
    os.write(97); // 写入单个字节：字母 a
    os.write("我爱你666".getBytes(StandardCharsets.UTF_8));
}
```

| 方法 | 作用 |
| --- | --- |
| `write(int b)` | 写一个字节；不是把整数转成十进制文字 |
| `write(byte[] bytes)` | 写整个字节数组 |
| `write(bytes, offset, length)` | 从数组的 `offset` 开始写 `length` 个字节 |
| `new FileOutputStream(path, true)` | 追加写入；不传 `true` 时会覆盖原有内容 |

`FileOutputStreamDemo1` 中 `write(bytes, 0, 3)` 写的是**前 3 个字节**，不是前 3 个汉字；若编码是 UTF-8，示例里的第一个汉字通常占 3 字节。`"\r\n"` 是换行的两个控制字符。写完要关闭流，`try-with-resources` 能自动完成。

## 6.复制文件：输入流与输出流配合

`CopyDemo1`、`CopyDemo2` 都用字节流复制图片：从源文件读取一批字节，再把**本次实际读到的字节数**写入目标文件。全程不把图片转成字符串，因此也适用于其他二进制文件。

```java
byte[] buffer = new byte[1024];
int len;
while ((len = fis.read(buffer)) != -1) {
    fos.write(buffer, 0, len);
}
```

最后一次读取可能不足 1024 字节，所以必须写 `len`，不能每次都写完整个 `buffer`。`FileOutputStream(destPath)` 中的目标路径要包含文件名；目标文件已存在时会被覆盖，父目录则须事先存在。复制时不要让源路径和目标路径指向同一个文件。

### 两种关闭资源的写法

| 示例 | 写法 | 要点 |
| --- | --- | --- |
| `CopyDemo1` | `try-catch-finally` | 在 `finally` 中分别判断流是否创建成功，再调用 `close()` |
| `CopyDemo2` | `try-with-resources` | 在 `try (...)` 中声明资源，离开代码块时自动关闭，包括发生异常时 |

`try-with-resources` 可以管理实现 `AutoCloseable` 的对象；`CopyDemo2` 里的 `Myclose implements Closeable` 用于演示自定义对象也能自动调用 `close()`，实际复制只需要管理输入流和输出流。资源按声明的**相反顺序**关闭。

`CopyDemo1` 的 `finally` 中要先判断 `fis != null`：如果创建输入流时就抛异常，`fis` 仍是 `null`，没有资源可关。即使外层有 `try-catch`，直接执行 `fis.close()` 也只会多产生一个无意义的 `NullPointerException`。**判空决定是否需要关闭；内层 `catch` 处理真正调用 `close()` 时可能出现的异常。**

注意当前两个 `copyFile()` 都在方法内部 `catch` 异常并打印，没有再次抛出；因此虽然方法声明了 `throws Exception`，调用方通常收不到复制过程中的异常。并且“复制成功”打印在关闭输出流之前。如果以后要让调用方可靠地判断复制是否成功，可让异常继续传给调用方，并在资源正常关闭后再报告成功。

## 7.字符流：按字符读写文本

`Reader` / `Writer` 是字符输入流 / 输出流的父类；`FileReader` / `FileWriter` 用于读取、写入文本文件。字符流负责在**文件字节**和**Java 字符**之间进行解码或编码，适合文本；图片等二进制文件仍用字节流。

### `FileReaderDemo1`：读取文本

```java
try (Reader reader = new FileReader("15-file-io/src/test1.txt")) {
    char[] buffer = new char[3];
    int len;
    while ((len = reader.read(buffer)) != -1) {
        System.out.println(new String(buffer, 0, len));
    }
}
```

`read(buffer)` 返回本次读入的**字符数**，到文件结尾返回 `-1`。最后一次可能不足 3 个字符，所以构造字符串时要用 `len`。与每批字节直接解码相比，`FileReader` 会按字符集处理跨批次的字节，不会把一个汉字的编码字节拆开后分别解码。Java 的 `char` 是 UTF-16 代码单元，少数补充字符（如部分 emoji）仍可能占两个 `char`，不能认为每个 `char` 都是一个完整的可见字符。

### `FileWriterDemo1`：写入文本

| 写法 | 作用 |
| --- | --- |
| `write('s')`、`write(98)` | 写一个字符；整数 `98` 对应字符 `b`，不是文字 `98` |
| `write("abc")` | 写字符串 |
| `write(char[])` | 写字符数组 |
| `write("\r\n")` | 写入换行字符 |
| `flush()` | 将流中尚未写出的内容刷新出去，流仍可继续使用 |
| `close()` | 关闭流；关闭时也会刷新 |

`new FileWriter(path)` 默认覆盖原文件；`new FileWriter(path, true)` 用于追加。示例中的 `try-with-resources` 会自动关闭流，因此末尾单独的 `flush()` 不是必须的；需要**保持流打开并让已写内容及时可见**时才主动调用。`FileReader` / `FileWriter` 不指定字符集时使用默认字符集，实际读写应确保字符集与文件一致，必要时使用可指定 `Charset` 的构造方法。

## 8.缓冲流：给基础流加一层缓冲

缓冲流用**包装**的方式增强已有的文件流：先创建基础流，再把它交给对应的 `Buffered...` 流。它们仍按原来的方向读写，字节流处理字节，字符流处理文本。

| 基础流 | 缓冲流 | 用途 |
| --- | --- | --- |
| `FileInputStream` | `BufferedInputStream` | 缓冲读取字节 |
| `FileOutputStream` | `BufferedOutputStream` | 缓冲写入字节 |
| `FileReader` | `BufferedReader` | 缓冲读取字符，并提供 `readLine()` |
| `FileWriter` | `BufferedWriter` | 缓冲写入字符，并提供 `newLine()` |

`demo9bufferedinputstream.CopyDemo1` 用 `BufferedInputStream` 和 `BufferedOutputStream` 包装文件流，再循环 `read(buffer)` / `write(buffer, 0, len)` 复制图片。缓冲可减少底层读写操作；代码里的计数 `i` 统计的是**循环读取次数**，不是实际磁盘访问次数。输出流中的数据可能还停留在缓冲区，`flush()` 会将其送往下层流，正常 `close()` 也会刷新。

```java
try (BufferedInputStream in = new BufferedInputStream(new FileInputStream(src));
     BufferedOutputStream out = new BufferedOutputStream(new FileOutputStream(dest))) {
    byte[] buffer = new byte[1024];
    int len;
    while ((len = in.read(buffer)) != -1) {
        out.write(buffer, 0, len);
    }
}
```

关闭外层缓冲流时，也会关闭其包装的基础流。你的示例把内外两层都放进 `try (...)`，能运行；只管理最外层通常更简洁。`BufferedWriterDemo1` 与之前的 `FileWriterDemo1` 写法相似，只是把 `FileWriter` 包装为 `BufferedWriter`。

### 按行读取与写入

`BufferedReader.readLine()` 一次返回一行**不含换行符**的文本，文件结束时返回 `null`。不能用 `-1` 判断，因为它返回的是 `String`。写回多行时，要自己补换行；`BufferedWriter.newLine()` 可写入当前系统的行分隔符。

```java
String line;
while ((line = reader.readLine()) != null) {
    writer.write(line);
    writer.newLine();
}
```

## 9.实践：乱序句子重排

`BufferedTest2` 的流程是：从 `practice.txt` **逐行读取** → 放进 `List<String>` → 按编号排序 → 写入 `out.txt`。这把缓冲字符流、集合和 `Comparator` 结合起来了。

```java
list.sort((a, b) -> Character.compare(a.charAt(0), b.charAt(0)));
```

这段比较器只看每行的**第一个字符**。当前输入恰好是 `1.`～`9.`，所以能得到正确顺序；若出现 `10.`、空行或行首空格，就需要先解析完整编号再比较。这里直接 `list.sort(null)` 也能按当前文本的字典顺序排好，因为编号都是一位数。

要兼容多位编号和多余空格，可以读取时跳过空行，排序时取出句号前的完整数字：

```java
while ((line = br.readLine()) != null) {
    if (!line.isBlank()) {
        list.add(line);
    }
}

list.sort((a, b) -> {
    String left = a.trim();
    String right = b.trim();
    int numA = Integer.parseInt(left.substring(0, left.indexOf('.')));
    int numB = Integer.parseInt(right.substring(0, right.indexOf('.')));
    return Integer.compare(numA, numB);
});
```

`trim()` 去掉编号前后的空格；`indexOf('.')` 找到编号结束位置；`substring()` 截出编号，再由 `Integer.parseInt()` 转为整数。因此 `2.` 会排在 `10.` 前面。此写法仍假设每个非空行都有“整数`.`正文”的格式。

写出时使用 `bw.write(s)` 再写 `"\r\n"`，因为 `readLine()` 已去掉原来的换行符。跨系统运行可改用 `bw.newLine()`。此案例只整理文本顺序，不改变原来的 `practice.txt`。

## 10.转换流：指定文本的编码

`demo12inputstreamreader.Demo1` 用 `InputStreamReader` 把**字节输入流转换成字符输入流**，并指定源文件的编码，再用 `BufferedReader` 按行读取：

```java
try (BufferedReader br = new BufferedReader(
        new InputStreamReader(
                new FileInputStream("15-file-io/src/test1_GBK.txt"), "GBK"))) {
    String line;
    while ((line = br.readLine()) != null) {
        System.out.println(line);
    }
}
```

关键是**解码使用的字符集要与文件实际编码一致**。程序源代码使用 UTF-8，并不意味着读取的每个文件都是 UTF-8。`InputStreamReader` 负责解码，`BufferedReader` 在外层提供 `readLine()`；反向写文本时，可用 `OutputStreamWriter` 指定编码。

## 11.打印流与数据流

### `PrintStream`：方便地打印文本

`PrintStreamDemo1` 把 `97`、`'a'`、`true` 用 `println()` 写入文件，每次会转成可读文本并换行。`new PrintStream(path)` 默认覆盖文件；示例中注释的 `new PrintStream(new FileOutputStream(path, true))` 可追加。与 `FileOutputStream.write(97)` 写单个字节 `a` 不同，`ps.println(97)` 写的是文本 `97`。`PrintStream` 的写入方法通常不抛 `IOException`，需检查写入错误时可调用 `checkError()`。

### `DataOutputStream` / `DataInputStream`：按类型写读数据

`DataStreamDemo2` 依次写入 `byte`、`char`、UTF 字符串、`double`；`DataStreamDemo3` 按**相同顺序和类型**读取：

```java
dos.writeByte(34);
dos.writeChar(97);
dos.writeUTF("你好");
dos.writeDouble(98.8);

// 读取端：readByte() → readChar() → readUTF() → readDouble()
```

数据流保存的是带类型约定的**二进制数据**，示例文件虽叫 `dos.txt`，也不能把它当普通文本直接打开阅读。读取顺序或类型不一致会得到错误数据或抛异常；文件读完继续读取也会抛 `EOFException`。`writeUTF()` 使用数据流规定的 UTF 格式，与直接写 UTF-8 字节不同。

## 12.简单 IO 框架：Apache Commons IO

`demo14commonsioframe.CommonsIoDemo1` 使用外部 JAR `15-file-io/lib/commons-io-2.22.0.jar` 提供的 `FileUtils`。这是第三方库，使用前要把 JAR 加入项目依赖或类路径。

| 示例调用 | 作用 |
| --- | --- |
| `FileUtils.copyFile(source, destination)` | 复制文件，省去自己写字节循环 |
| `FileUtils.delete(file)` | 删除指定文件或目录；属于实际磁盘操作 |

`FileUtils` 帮你封装常见 IO 步骤，但路径、目标文件和异常仍要正确处理。当前 `CommonsIoDemo1` 的删除目标是桌面上的截图，运行它会尝试删除那个真实文件；练习复制时可单独运行复制操作。

## 13.目前的知识串联

```text
File：定位、创建、遍历文件与目录
递归：进入多级目录
编码/解码：字符 ↔ 字节
输入流：文件 → 程序；输出流：程序 → 文件
复制文件：循环 read(buffer) → write(buffer, 0, len)
字符流：Reader 读文本；Writer 写文本
缓冲流：包装基础流；按行读写文本；辅助文件复制
转换流：按指定字符集把字节转换为字符
打印流：把值打印为文本；数据流：按类型写读二进制值
Commons IO：用第三方工具方法完成常见文件操作
```

读取文件时先判断内容是**字节数据还是文本**；文本必须按正确字符集解码，图片等二进制文件应直接用字节流。处理文本的行时可用 `BufferedReader` / `BufferedWriter`。
