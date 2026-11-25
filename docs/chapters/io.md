---
title: 文件与 IO 流
prev: false
next: false
---
<div class="catalog-breadcrumb"><a href="/">总目录</a><span>/</span><a href="/parts/systems">IO 与并发网络</a><span>/ 文件与 IO 流</span></div>

# 文件与 IO 流

::: info 目录已导入 · 正文待整理
下方知识点来自你的现有笔记。后续会逐节补上讲解、真实代码和易错点。
:::

## 已有知识点

- `File`：表示文件或目录的路径
- 递归与文件搜索
- 字符编码：`String` 与字节之间转换
- 文件字节输入流：读文件
- 文件字节输出流：写文件
- 复制文件：输入流与输出流配合
- 字符流：按字符读写文本
- 缓冲流：给基础流加一层缓冲
- 实践：乱序句子重排
- 转换流：指定文本的编码
- 打印流与数据流
- 简单 IO 框架：Apache Commons IO
- 目前的知识串联

## 原始笔记

来源：`notes/15文件与IO流.md`。

[下载现有笔记](/notes/io.md){download}

## 对应源码

以下路径相对于你的 `D:\JavaCode` 项目。这里只展示位置，后续整理时再把具体代码嵌入知识点。

### 15-file-io

- `src/com/ranan/demo10bufferedreader/`
- `src/com/ranan/demo11bufferedwriter/`
- `src/com/ranan/demo12inputstreamreader/`
- `src/com/ranan/demo13printstream/`
- `src/com/ranan/demo14commonsioframe/`
- `src/com/ranan/demo1file/`
- `src/com/ranan/demo2recursion/`
- `src/com/ranan/demo3charset/`
- `src/com/ranan/demo4fileinputstream/`
- `src/com/ranan/demo5fileoutput/`
- `src/com/ranan/demo6copy/`
- `src/com/ranan/demo7filereader/`
- `src/com/ranan/demo8filewriter/`
- `src/com/ranan/demo9bufferedinputstream/`

[返回IO 与并发网络](/parts/systems) · [返回总目录](/)
