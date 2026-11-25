# 网络通信笔记

对应 `17-net` 中的 `demo1inetaddress`～`demo7tcp4`：IP 地址、端口、UDP/TCP 通信、多客户端处理，以及浏览器访问和线程池优化。

## 1.网络通信的基本要素

网络通信需要知道**对方在哪里、交给哪个通信端点、遵守什么协议**。

| 要素 | 作用 | 本例 |
| --- | --- | --- |
| IP 地址 | 定位通信的主机地址 | `InetAddress.getLocalHost()` 取得本机地址 |
| 端口 | 配合 IP、协议找到对应的 Socket | 接收端绑定 UDP 端口 `8080` |
| 协议 | 规定数据通信方式 | UDP |

同一台电脑也可以运行发送端和接收端进行通信。本机练习可使用回环地址 `127.0.0.1`；跨电脑通信时，发送端应填写接收端电脑可达的 IP，不能仍把自己的本机地址当作目标。

## 2.`InetAddress`：表示 IP 地址

`InetAddressDemo1` 先查询本机，再用域名查询另一台主机的地址。

| API | 作用 |
| --- | --- |
| `InetAddress.getLocalHost()` | 根据本机主机名获取本机地址，不保证就是 `127.0.0.1` |
| `InetAddress.getByName("www.github.com")` | 根据域名或 IP 字符串获取地址对象；域名通常需要解析 |
| `getHostAddress()` | 返回 IP 地址字符串 |
| `getHostName()` | 获取主机名，可能涉及名称查询 |
| `isReachable(5000)` | 在给定超时时间内尝试探测地址是否可达，单位毫秒 |

`isReachable()` 返回 `false` 不一定表示网站打不开，也可能是探测被防火墙等限制；它并不检查某个业务端口是否正常服务。域名解析也不等于已连接到对方的应用程序。

## 3.UDP：以数据包为单位通信

UDP 发送前不需要先建立连接，发送端把数据和目标地址放入数据包，再通过 Socket 发出去。UDP 本身**不保证送达、顺序或不重复**；`send()` 正常返回，不等于接收端已经收到。

| Java 类 | 作用 |
| --- | --- |
| `DatagramSocket` | 通信端点，负责发送或接收数据包 |
| `DatagramPacket` | 保存待发送的数据与目标地址，或保存收到的数据与发送方地址 |

这两者可以理解为“收发工具”和“装消息的包”。发送端与接收端都使用 `DatagramSocket`，本例称作客户端、服务端，是代码分工，并不是 UDP 限制它们只能发或只能收。

## 4.一次发送：`demo2udp1.UDPClientDemo1`

流程：创建发送端 → 把字符串编码成字节 → 封装目标 IP 与端口 → 发送 → 关闭。

```java
try (DatagramSocket socket = new DatagramSocket(7777)) {
    byte[] bytes = "Hello World!".getBytes(StandardCharsets.UTF_8);
    DatagramPacket packet = new DatagramPacket(
            bytes, bytes.length,
            InetAddress.getByName("127.0.0.1"), 8080);
    socket.send(packet);
}
```

`new DatagramSocket(7777)` 绑定的是**发送端自己的本地端口**；数据包里的 `8080` 才是接收端目标端口。构造数据包时传入 `bytes.length`，单位是字节，不能拿字符串的字符数代替。

当前源码使用 `getBytes()` 的默认字符集；笔记示例显式使用 `StandardCharsets.UTF_8`，接收端也应一致。该常量需要导入 `java.nio.charset.StandardCharsets`。

## 5.一次接收：`demo2udp1.UDPServiceDemo2`

流程：绑定接收端口 → 准备接收缓冲区和数据包 → 等待数据 → 按实际长度解码。

```java
try (DatagramSocket socket = new DatagramSocket(8080)) {
    byte[] buffer = new byte[1024 * 4];
    DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
    socket.receive(packet);

    String text = new String(packet.getData(), packet.getOffset(),
            packet.getLength(), StandardCharsets.UTF_8);
    System.out.println(text);
}
```

`receive()` 默认会**阻塞当前线程**，也就是停在这一句等待数据；收到数据包后才继续执行。它不会自动创建新线程。当前例子只调用一次，所以只接收一个数据包。

| 接收后读取的方法 | 含义 |
| --- | --- |
| `packet.getLength()` | 本次实际收到的字节数，不是缓冲区总容量 |
| `packet.getData()` / `getOffset()` | 存放数据的字节数组 / 本次数据的起始位置 |
| `packet.getAddress()` | 发送方的 IP 地址 |
| `packet.getPort()` | 发送方的端口 |

只解码实际收到的那一段，避免把未使用的缓冲区也当文本。每次 `receive()` 接收一个数据报；如果数据报超过本次接收容量，超出部分会被截断，并不会像文件流那样留到下次继续读取。

## 6.循环收发：`demo3udp2`

发送端用 `Scanner.nextLine()` 在循环中读输入，每输入一行就发送一个数据包。这里使用无参数的 `new DatagramSocket()`，本地端口由系统分配，因此服务端打印的发送方端口不一定是 `7777`。

接收端将 `receive()` 放进 `while (true)`，收到一个包就解析、打印，然后等待下一个。多个客户端可以把消息发往同一个接收端；这个服务端按包逐个处理，不代表每个客户端都有一个专属线程。

客户端输入 `exit` 时，代码先判断、关闭客户端 Socket 并退出循环，**没有把 `exit` 发给服务端**。所以服务端不会跟着退出，仍会在下一次 `receive()` 等待数据；它的循环目前需要手动停止程序。

## 7.运行示例时注意什么

- 先启动对应的服务端，再启动客户端；服务端未准备好时发送的 UDP 消息可能丢失。
- 两个包中的服务端都绑定本机 UDP `8080`，按当前写法不要同时运行，否则通常会出现端口被占用的绑定异常。
- 目标 IP 和目标端口都要对应接收端；端口号是 `8080` 并不意味着本例使用 HTTP，这里仍是 UDP。
- 字符集要一致。尤其跨电脑发送中文时，可在编码和解码两侧都明确指定 UTF-8。
- Socket 不再使用时应关闭，释放本地端口等资源；一次接收的源码目前没有显式关闭，笔记示例用 `try-with-resources` 自动关闭。

## 8.TCP：建立连接后通过流通信

TCP 提供可靠、有序的**字节流**通信，先建立连接，再通过 Socket 的输入流和输出流传输数据。连接中断等情况仍可能导致通信失败，写入正常返回也不代表对方的业务代码已经处理完成。

| API | 作用 |
| --- | --- |
| `new ServerSocket(9999)` | 服务端绑定 TCP 端口并监听连接 |
| `ss.accept()` | 等待并接收一个连接，返回服务端这一侧的 `Socket` |
| `new Socket("127.0.0.1", 9999)` | 客户端连接本机的 TCP `9999` 端口 |
| `socket.getInputStream()` | 取得当前连接的字节输入流 |
| `socket.getOutputStream()` | 取得当前连接的字节输出流 |
| `socket.getInetAddress()` / `getPort()` | 获取对端 IP / 对端端口 |

`ServerSocket` 负责接待新连接；`accept()` 返回的 `Socket` 负责与**本次连接的客户端**通信。客户端和服务端各有自己的 Socket 对象，分别代表连接两端。一个 TCP 连接支持双向通信，当前示例只实现客户端发送、服务端接收。

### 一次收发：`demo4tcp1`

客户端取得输出流并包装为 `DataOutputStream`，先写编号，再写消息；服务端用 `DataInputStream` 按相同顺序读取：

```java
// 客户端
dos.writeInt(1);
dos.writeUTF("你好");

// 服务端
int id = dis.readInt();
String msg = dis.readUTF();
```

两边的**数据类型与顺序必须一致**。TCP 本身不保留应用消息边界，不能认为每次 `write()` 就一定对应对方一次普通 `read()`。本例的 `writeUTF()` 写入长度信息和特定 UTF 编码的数据，`readUTF()` 按此格式读取一条完整字符串；它们需要配对使用，不能简单替换为原始 UTF-8 字节读写。

### 循环收发：`demo5tcp2`

客户端在循环中读键盘输入，再调用 `writeUTF()`；服务端在循环中调用 `readUTF()`，可以持续读取**同一个客户端**的消息。

`accept()` 等待的是新连接；`readUTF()` 等待的是当前连接上的完整字符串。没有足够数据、也没有遇到流结束或错误时，当前线程会停在那里等待。

## 9.对话重点：为什么 UDP 能接多个客户端，TCP 要加线程

关键在于**这次读取在等谁的数据**：

| 当前示例 | 接收范围 | 等待行为 |
| --- | --- | --- |
| UDP 的 `socket.receive(packet)` | 不同客户端发往这个 UDP Socket 的数据包 | 等下一个数据包，不固定等某个客户端 |
| TCP 的 `socket` 输入流 | 只属于这一个客户端连接的数据 | 当前客户端不发消息，就等待这个连接 |

`demo5tcp2` 只在循环外执行了一次 `ss.accept()`。假设接收的是 A，后面的循环就一直读取 A 的消息，B 的消息不会进入 A 的输入流。其他客户端可能已经建立连接、正在等待服务端接待，但这段程序没有再次 `accept()` 并处理它们。

即使把 `accept()` 放进外层循环，若同一线程接收 A 后就进入读取 A 的内层循环，也无法及时回到外层接待 B。因此 `demo6tcp3` 把工作分给不同线程：

```java
while (true) {
    Socket socket = ss.accept();
    new ServerReader(socket).start();
}
```

```text
主线程：循环 accept()，接收新连接并交给子线程
线程 A：读取客户端 A 的消息
线程 B：读取客户端 B 的消息
线程 C：读取客户端 C 的消息
```

`ServerReader` 用成员变量保存分配给自己的 `socket`，在 `run()` 中持续读取。A 没发消息时，只让负责 A 的线程等待；主线程仍能接待新客户端，其他读取线程也能继续工作。这里要调用 `start()`；直接 `run()` 会让主线程自己执行读取循环。

**UDP 也会阻塞，只是等待范围不同；TCP 也不是协议上强制要求多线程。** 当前学的是阻塞式 IO，用独立线程处理各连接容易理解。以后还可以用 NIO 等方式让一个线程管理多个连接。UDP 如果处理一个包耗时很长，也可能需要线程池协助处理。

## 10.TCP 示例的退出与资源关闭

`demo5tcp2` / `demo6tcp3` 客户端输入 `exit` 时，没有把该文本发送出去，而是调用 `dos.close()`：关闭 Socket 输出流也会关闭关联的 Socket。服务端读完已有数据后，再执行 `readUTF()` 通常会因流结束抛出 `EOFException`。

`demo6tcp3.ServerReader` 捕获异常、打印下线提示后结束当前读取线程；主线程仍在 `accept()`，所以服务端可以继续接收其他客户端。当前代码把所有异常统一打印为“下线”，但其他读取错误也可能进入这里，不能仅凭提示认定都是正常退出。

`demo4tcp1`～`demo6tcp3` 的服务端尚未完整关闭资源：单连接示例用完应关闭连接和监听 Socket；多客户端示例应在每个读取线程结束时关闭它负责的 Socket，监听 Socket 则在服务端整体停止时关闭。这三个 TCP 服务端都绑定 `9999`，按当前写法一次运行一个即可。

## 11.浏览器访问：TCP 上的 HTTP 通信

`demo7tcp4` 练习 B/S 架构（Browser/Server，浏览器与服务端）：浏览器访问 `http://127.0.0.1:8080`，Java 服务端读取请求头，然后返回一份固定的 HTML 页面。

这里仍使用 TCP Socket 通信，但双方还要遵守 **HTTP 的消息格式**。浏览器不会按之前的 `DataInputStream.readUTF()` 格式读取数据，所以服务端需要写出 HTTP 响应：

```text
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Connection: close

<html>……页面内容……</html>
```

| 部分 | 作用 |
| --- | --- |
| 状态行 `HTTP/1.1 200 OK` | 协议版本、状态码和说明，`200` 表示请求成功 |
| `Content-Type` | 声明正文是 HTML，并指定字符集 |
| `Connection: close` | 告知浏览器本次响应后关闭连接 |
| 空行 | 分隔响应头与正文，不能省略 |
| HTML 正文 | 浏览器解析后展示的页面 |

HTTP/1.1 头部各行使用 `\r\n` 分隔；当前 Windows 环境的 `println()` 正好使用这种换行，跨系统编写时应明确使用协议要求的换行。这个简单示例没有设置 `Content-Length`，通过关闭连接表示响应正文结束。

### `ServerReader` 的处理流程

读取请求行与请求头，直到遇到空行 → 输出响应头与 HTML → `flush()` → 自动关闭资源。本例只处理浏览器获取固定页面的场景，暂未解析不同路径或请求正文。

`PrintStream` 显式指定 UTF-8，使实际输出字节与 `charset=utf-8` 一致。`try-with-resources` 关闭 Socket 的流时，也会关闭关联的 Socket。浏览器一次访问可能还会请求网站图标等资源，因此控制台看到多次连接不一定是程序重复执行了同一个请求。

### 本次排错：为什么浏览器下载文件而不显示文字

- 原来写成 `Content-Type::text/html...`，多了一个冒号，内容类型无法被正确识别，浏览器可能按下载处理。应写 `Content-Type: text/html; charset=utf-8`。
- `<title>` 是标签页标题；页面上的标题文字应放在 `<body>` 内的 `<h1>` 中。
- CSS 属性用冒号，字号应写 `font-size:20px`，不是 `font-size=20px`。
- 先读完浏览器请求头，再发送响应并关闭连接，避免尚未读取的请求数据导致连接被重置。修改后需要停止旧服务端、重新编译运行。

## 12.线程池优化：一个连接对应一个任务

之前是每接收一个连接，就 `new ServerReader(socket).start()` 创建一条新线程。现在主线程继续负责 `accept()`，将连接封装成任务交给线程池：

```java
ExecutorService pool = new ThreadPoolExecutor(
        3, 10, 10, TimeUnit.SECONDS,
        new ArrayBlockingQueue<>(100),
        Executors.defaultThreadFactory(),
        new ThreadPoolExecutor.AbortPolicy());

while (true) {
    Socket socket = ss.accept();
    pool.execute(new ServerReader(socket));
}
```

| 配置 | 本例含义 |
| --- | --- |
| 核心线程数 `3` | 默认随任务提交逐步创建，通常保留的工作线程数 |
| 最大线程数 `10` | 工作线程总数上限，包含核心线程 |
| 空闲时间 `10 SECONDS` | 默认仅针对超过核心数量的线程，空闲超时后回收 |
| 队列容量 `100` | 暂存最多 100 个等待执行的连接处理任务 |
| `AbortPolicy` | 无法接收任务时抛出拒绝异常 |

线程池先创建核心线程，再尝试让任务排队；队列满时才尝试增加线程至上限。**线程数到核心数量后，不会因为还有空余的最大线程名额就立刻扩容。** 工作线程完成响应后可以继续执行下一项任务，减少创建、销毁线程的开销；排队的任务暂时还没有开始读取对应 Socket。

### 为什么 `Thread` 对象也能作为任务提交

`Thread` 实现了 `Runnable`，所以当前 `ServerReader extends Thread` 可以传给 `execute(Runnable)`。此时线程池工作线程调用该对象的 `run()`，**没有启动这个 `ServerReader` 对象自身代表的新线程**。使用线程池时不再调用它的 `start()`；以后也可以直接改成 `implements Runnable`，更明确地表示它只是任务。

此优化控制了工作线程数量，但阻塞读取仍会占用工作线程，不能理解为自动支持无限客户端。当前示例尚未处理任务拒绝：如果 `execute()` 抛异常，主线程会退出接收循环，该连接也没有交给任务关闭。进一步完善时应处理拒绝并关闭未接收的 Socket，服务端整体退出时关闭监听 Socket 和线程池；不要每处理完一个请求就关闭线程池。

## 13.对话补充：通信角色、IP 与端口

### 客户端与服务端怎么确定

客户端和服务端是**程序在一次通信中扮演的角色**，不是电脑固定的身份。通常主动请求、使用服务的一方是客户端，等待请求、提供服务的一方是服务端。

| 场景 | 客户端 | 服务端 |
| --- | --- | --- |
| 浏览网页 | 浏览器 | 返回网页的网站程序 |
| 当前 TCP 示例 | `new Socket(ip, port)` 主动连接 | `ServerSocket` 监听并 `accept()` 接收连接 |
| 当前 UDP 示例 | 向指定地址发送消息的程序 | 绑定固定端口、等待消息的程序 |
| Java 程序访问数据库 | Java 程序 | 数据库程序 |

UDP 不需要建立连接，角色主要根据用途划分。**发送或接收数据不会改变角色**：服务端返回网页、主动推送消息时仍是服务端。一个程序还可以同时承担两种角色，例如 Java 程序对浏览器提供服务，同时作为客户端查询数据库。同一台电脑也可以运行客户端和服务端两个程序。

### 为什么浏览器访问 `127.0.0.1:8080`

`127.0.0.1` 是回环地址，表示**发起访问的这台电脑自己**。本例浏览器与 Java 服务端在同一台电脑上，而服务端监听 `8080`，所以访问：

```text
http://127.0.0.1:8080
协议    IP 地址    端口号
```

`localhost` 通常解析到本机回环地址，也可以用于本机访问。如果换手机或另一台电脑访问，就要填写服务端电脑可达的 IP，例如 `http://192.168.1.10:8080`；在手机上输入 `127.0.0.1` 指向的是手机自身。

### 服务端只写端口就够了吗

`new ServerSocket(8080)` 默认绑定本机通配地址，监听本机可用的网络接口，因此示例不需要指定某个 IP。但监听后仍要调用 `accept()` 接收连接，并实现读取请求、返回响应的逻辑。

若只想允许本机访问，可以明确绑定回环地址：

```java
ServerSocket ss = new ServerSocket(
        8080, 50, InetAddress.getByName("127.0.0.1"));
```

其中 `50` 是等待被接收的连接队列长度参数，不是最多只能服务 50 个客户端。其他电脑访问服务时，需要服务端监听可被它访问的地址，并且网络与防火墙允许该端口的通信。

### 客户端只知道 IP 就够了吗

还要知道**端口与通信协议**：IP 定位主机地址，端口定位对应的服务端点，协议约定如何交流。Java 的 `new Socket("127.0.0.1", 8080)` 指定了 TCP 目标地址和端口；连接后，还要按照对方理解的格式发送数据，例如当前 B/S 示例使用 HTTP。

浏览器也可以使用域名，由 DNS 解析地址。网址省略端口时，HTTP 默认使用 `80`，HTTPS 默认使用 `443`；当前服务端使用 `8080`，所以访问时需要明确写上。

## 14.本模块总结

| 内容 | 解决什么问题 | 主要类或方法 |
| --- | --- | --- |
| 地址与端口 | 确定通信位置 | `InetAddress`、端口号 |
| UDP | 按数据报收发，不保证送达和顺序 | `DatagramSocket`、`DatagramPacket` |
| TCP | 建立连接，传输可靠有序的字节流 | `ServerSocket`、`Socket`、IO 流 |
| 多线程 | 避免一个连接的阻塞读取拖住其他连接 | `accept()` + 独立读取线程 |
| HTTP | 约定浏览器与服务端的请求、响应格式 | 状态行、响应头、空行、正文 |
| 线程池 | 复用工作线程、限制并发处理数量 | `ThreadPoolExecutor`、`execute()` |

UDP 和 TCP 是传输层协议；HTTP 是应用层协议。本例使用 HTTP/1.1，通过 TCP 连接传输 HTTP 消息，不能把 HTTP 和 TCP 理解成互相替代的两种方案。

```text
发送：字符串 → 编码为 byte[] → DatagramPacket（目标 IP、端口）→ send()
接收：绑定端口 → receive() 等待 → 取得实际长度 → 按相同字符集解码
TCP：ServerSocket 监听 → accept() 得到连接 Socket → 使用 IO 流读写
TCP 多客户端：主线程接收连接 → 每个连接交给独立读取线程
浏览器访问：HTTP 请求 → 线程池执行连接任务 → HTTP 响应 → 浏览器渲染 HTML
```

`InetAddress` 表示地址，`DatagramSocket` 负责收发，`DatagramPacket` 装数据。循环就能实现连续收发，但 UDP 的可靠性仍需要应用自己考虑，不能因程序没有报错就认定对方一定收到了。

TCP 的“连续收多条消息”和“处理多个客户端”是两个层次：前者循环读取同一连接，后者需要持续接收并分别处理多个连接。
