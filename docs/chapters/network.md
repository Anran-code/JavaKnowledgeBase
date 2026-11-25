---
title: 网络通信
prev: false
next: false
---
<div class="catalog-breadcrumb"><a href="/">总目录</a><span>/</span><a href="/parts/systems">IO 与并发网络</a><span>/ 网络通信</span></div>

# 网络通信

::: info 目录已导入 · 正文待整理
下方知识点来自你的现有笔记。后续会逐节补上讲解、真实代码和易错点。
:::

## 已有知识点

- 网络通信的基本要素
- `InetAddress`：表示 IP 地址
- UDP：以数据包为单位通信
- 一次发送：`demo2udp1.UDPClientDemo1`
- 一次接收：`demo2udp1.UDPServiceDemo2`
- 循环收发：`demo3udp2`
- 运行示例时注意什么
- TCP：建立连接后通过流通信
- 对话重点：为什么 UDP 能接多个客户端，TCP 要加线程
- TCP 示例的退出与资源关闭
- 浏览器访问：TCP 上的 HTTP 通信
- 线程池优化：一个连接对应一个任务
- 对话补充：通信角色、IP 与端口
- 本模块总结

## 原始笔记

来源：`notes/17网络通信.md`。

[下载现有笔记](/notes/network.md){download}

## 对应源码

以下路径相对于你的 `D:\JavaCode` 项目。这里只展示位置，后续整理时再把具体代码嵌入知识点。

### 17-net

- `src/com/ranan/demo1inetaddress/`
- `src/com/ranan/demo2udp1/`
- `src/com/ranan/demo3udp2/`
- `src/com/ranan/demo4tcp1/`
- `src/com/ranan/demo5tcp2/`
- `src/com/ranan/demo6tcp3/`
- `src/com/ranan/demo7tcp4/`
- `src/com/ranan/demo8api/`

[返回IO 与并发网络](/parts/systems) · [返回总目录](/)
