# 线程笔记

对应 `16-thread` 中的 `demo1create`～`demo8test`：线程创建、常用 API、线程安全、线程池及抢红包练习。

## 1.线程是什么

进程可以理解为正在运行的程序，线程是进程内执行代码的一条路径。`main()` 由主线程执行；调用 `start()` 启动新线程后，主线程和新线程可以各自执行任务。

多个线程可能交替执行，也可能在多个 CPU 核心上同时执行。**启动顺序不等于执行完成顺序**，控制台输出先后可能每次不同。取款示例中的小明、小红是同一个进程中的两个线程。

## 2.三种创建方式

| 示例 | 方式 | 任务方法 | 特点 |
| --- | --- | --- | --- |
| `ThreadDemo1` | 继承 `Thread` | 重写 `run()` | 直接创建子类对象再 `start()`；占用单继承的位置 |
| `ThreadDemo2` | 实现 `Runnable`，交给 `Thread` | 重写 `run()` | 任务与线程分开，任务类还可以继承其他类 |
| `ThreadDemo3` | 实现 `Callable<T>`，用 `FutureTask<T>` 包装后交给 `Thread` | 重写 `call()` | 可以返回结果，并声明受检异常 |

`run()` 是任务内容，**`start()` 才会启动新线程**。直接调用 `run()`，只是当前线程执行一次普通方法。同一个 `Thread` 对象只能启动一次。

`Runnable` 也可以用 Lambda 表示：

```java
Runnable task = () -> System.out.println("子线程执行任务");
Thread thread = new Thread(task);
thread.start();
```

### `Callable` 与结果接收

```java
Callable<Integer> task = () -> {
    int sum = 0;
    for (int i = 1; i <= 100; i++) sum += i;
    return sum;
};
FutureTask<Integer> future = new FutureTask<>(task);
new Thread(future).start();
Integer result = future.get(); // 需要处理或声明相关受检异常
```

`Callable` 不能直接传给 `Thread`；`FutureTask` 同时承担可执行任务和保存结果的作用。调用 `get()` 时，如果任务没完成，**调用者会等待**；已经完成则直接取得结果。

你的示例先启动两个求和线程，再依次 `get()`：等待第一个结果时，第二个任务仍可继续执行。按顺序取得结果，不代表两个任务按顺序运行。

## 3.常用线程 API

| API | 作用 |
| --- | --- |
| `start()` | 启动新线程，执行任务 |
| `getName()` / `setName(name)` | 获取 / 设置线程名称 |
| `Thread.currentThread()` | 获取当前正在执行这段代码的线程 |
| `Thread.sleep(毫秒)` | 让当前线程暂停一段时间，不释放已持有的锁 |
| `t.join()` | 让当前线程等待 `t` 执行结束 |

`sleep()` 是静态方法，影响的是**当前执行线程**。`sleep(1000)` 表示暂停约一秒，之后何时继续运行仍由调度决定。`sleep()` 和 `join()` 都可能抛出 `InterruptedException`，需要处理或声明。

`ThreadAPIDemo3` 中，主线程输出 `1` 后执行 `t1.join()`，因此主线程的 `2`～`5` 要等 `t1` 结束后才能输出。`join()` 不是强行让目标线程“插队”，也不保证它比其他所有线程先运行；如果 `t1` 已结束，调用会直接返回。

**读 `t.join()` 时要分清两个角色：当前执行这句代码的线程负责等待，`t` 是被等待结束的线程。** 在 `main()` 中调用时，主线程暂停等待，`t` 继续运行。`sleep(1000)` 等一段时间，`t.join()` 等目标线程完成；主线程等待不会暂停其他已启动的线程。

## 4.线程安全：共享账户取款

`demo3threadsafe` 中，两条 `DrawThread` 共用同一个 `Account acc`，账户有 10 万，每人尝试取 10 万。

如果没有同步，可能出现这样的交错：小明判断余额足够 → 小红也判断余额足够 → 两个人都执行扣款。**检查余额与扣款不是自动不可分割的一步**，因此可能重复取款、余额为负或出现其他错误结果。偶尔运行正常，也不能证明代码线程安全。

解决思路：把“判断余额 → 扣款 → 展示本次结果”放到同一段受锁保护的代码中，让操作同一账户的线程依次进入。

## 5.同步代码块与锁对象

`demo4synchronized_code` 使用：

```java
public void drawMoney(double amount) {
    synchronized (this) {
        if (this.money >= amount) {
            this.money -= amount;
        }
    }
}
```

同一时间，只有一个线程能持有同一对象的监视器锁。离开同步代码块时会自动释放锁，包括抛异常离开时；随后取得同一把锁的线程能看到之前受保护的修改。

### 为什么实例方法常用 `this`

`this` 是当前账户对象。两个人调用同一个 `acc.drawMoney()`，`this` 就是同一个 `acc`，使用同一把锁。不同账户是不同对象，可以分别处理取款。

**关键是锁对象相同，不是代码看起来相同。** 不能在方法里每次 `new Object()` 作为锁，否则每次拿的是不同锁。锁也不会自动保护对象所有操作：其他读写共享数据的路径，仍需遵守相同的同步规则。

你之前写的 `synchronized ("")` 也能起作用，因为字符串字面量对应共享的对象；但不同账户甚至其他代码都可能争抢这个锁，所以此例用 `this` 更合适。`ThreadDemo1` 注释里保留的负余额输出，是无锁时的例子。

### 静态数据可以使用 `类名.class`

静态方法没有 `this`。如果保护的是整个类共享的静态数据，可以用代表该类的 `Account.class` 对象作为锁：

```java
synchronized (Account.class) {
    // 操作所有账户共享的静态数据
}
```

`this` 与 `Account.class` 是两把不同的锁，不能用它们分别保护同一份数据，并期待相互排斥。

## 6.同步方法

`demo5synchronized_method` 直接在方法上加 `synchronized`：

```java
public synchronized void drawMoney(double money) {
    // 判断余额并扣款
}
```

| 写法 | 锁对象 |
| --- | --- |
| 实例同步方法 | 当前对象 `this` |
| 静态同步方法 | 当前类的 `类名.class` 对象 |
| 同步代码块 | 括号中指定的对象 |

同步方法写法简洁，保护整个方法；同步代码块可以只保护真正需要同步的部分。

## 7.`Lock`：显式上锁与解锁

`demo6lock` 在每个 `Account` 对象里保存一把 `ReentrantLock`：

```java
private final Lock lock = new ReentrantLock();

public void drawMoney(double amount) {
    lock.lock();
    try {
        if (this.money >= amount) {
            this.money -= amount;
        }
    } finally {
        lock.unlock();
    }
}
```

`lock()` 获取锁，`unlock()` 释放锁。解锁必须放进 `finally`，防止扣款代码发生异常时一直占着锁。`final` 防止锁字段被重新赋值，让同一账户始终使用同一把锁；**真正实现同步的是加锁操作，单独写 `final` 不会让余额线程安全**。

三种写法都能解决当前共享账户的取款问题：同步代码块、同步方法自动释放锁；`Lock` 需要显式释放。它们都不意味着线程一定按启动顺序获得锁。

## 8.线程池：复用线程执行任务

`demo7executorService` 使用线程池统一管理线程：把任务提交给池，线程完成一个任务后可以继续处理下一个任务，减少反复创建、销毁线程的开销，并控制同时工作的线程数量。

`ExecutorService` 是常用接口，`ThreadPoolExecutor` 是实现类；`Executors` 是创建线程池的工具类。任务提交后由线程池安排执行，不需要自己再为每个任务 `new Thread(...).start()`。

### `ThreadPoolExecutor` 的七个参数

你的两个示例使用同一组配置：

```java
ExecutorService pool = new ThreadPoolExecutor(
        3, 5, 10, TimeUnit.SECONDS,
        new ArrayBlockingQueue<>(3),
        Executors.defaultThreadFactory(),
        new ThreadPoolExecutor.AbortPolicy());
```

| 参数 | 本例取值 | 含义 |
| --- | --- | --- |
| `corePoolSize` | `3` | 核心线程数量，默认随提交任务逐步创建 |
| `maximumPoolSize` | `5` | 池内线程总数上限，包含核心线程 |
| `keepAliveTime` | `10` | 超出核心数量的线程允许空闲多久；不是任务最多执行多久 |
| `unit` | `SECONDS` | 空闲时间的单位 |
| `workQueue` | 容量为 `3` 的队列 | 暂存等待执行的任务 |
| `threadFactory` | 默认线程工厂 | 负责创建工作线程 |
| `handler` | `AbortPolicy` | 拒绝任务时抛出 `RejectedExecutionException` |

默认情况下，提交任务大致遵循：**线程数不足核心数量就创建线程 → 尝试放入队列 → 队列已满且未到最大线程数时再创建线程 → 无法接收则执行拒绝策略**。线程池关闭后再提交任务也会被拒绝。

如果任务一直未完成，本例可以有 5 个任务运行、3 个任务排队，再来任务就会被拒绝。但你的 `MyRunnable` 很短，提交过程中可能已有任务完成，因此“第 7、8 个必然创建临时线程，第 9 个必然被拒绝”并不一定发生，要看提交当时的状态。

### 提交任务、接收结果和关闭

| 方法 | 用途 |
| --- | --- |
| `execute(Runnable)` | 提交不需要返回结果的任务，没有 `Future` 返回值 |
| `submit(Callable<T>)` | 提交有结果的任务，返回 `Future<T>` |
| `future.get()` | 获取结果；未完成时让调用者等待，任务异常会通过 `ExecutionException` 传出 |
| `shutdown()` | 停止接收新任务，让已接收的任务继续完成；调用本身不等待全部完成 |

`ExecutorServiceDemo1` 多次提交同一个 `MyRunnable`，多个线程可能同时执行这个对象的 `run()`。本例没有共享的可变成员，能这样复用；如果任务对象里有共享状态，仍要考虑同步，线程池不会自动使业务代码线程安全。

`ExecutorServiceDemo2` 用 `submit(new MyCallable(100))` 取得 `Future<String>`，不需要自己再创建 `FutureTask`。按 `f1.get()`、`f2.get()` 的顺序打印，只决定接收结果的顺序，不代表任务串行执行。

线程池应在**不再使用时关闭**。当前 `ExecutorServiceDemo2` 和 `ExecutorsDemo3` 未调用 `shutdown()`，默认工作线程可能让主方法结束后程序仍保持运行。`ExecutorServiceDemo1` 若提交任务时抛出拒绝异常，也可能跳过末尾的关闭代码；可用 `finally` 确保关闭：

```java
ExecutorService pool = Executors.newFixedThreadPool(3);
try {
    Future<String> result = pool.submit(new MyCallable(100));
    System.out.println(result.get()); // 相关受检异常仍需 catch 或 throws
} finally {
    pool.shutdown();
}
```

### `Executors.newFixedThreadPool(3)`

`ExecutorsDemo3` 创建固定大小的线程池，最多 3 个工作线程，其他任务排队等待。它使用容量实际上很大的队列，持续提交超过处理能力的任务会导致任务积压和内存压力；自己构造 `ThreadPoolExecutor` 时，可以明确限制队列容量。

## 9.综合练习：100 人抢 200 个红包

`demo8test` 当前使用 100 个 `PeopleGetRedPacket` 线程，共享同一个 `List<Integer>`，不是通过线程池执行。

| 代码部分 | 实现内容 |
| --- | --- |
| `ThreadTest.getRedPacket()` | 创建 160 个 1～30 元红包、40 个 31～100 元红包，共 200 个 |
| `r.nextInt(30) + 1` | 产生 `[1, 30]` 的金额 |
| `r.nextInt(70) + 31` | 产生 `[31, 100]` 的金额 |
| 每位员工的 `while (true)` | 允许同一个人多次抢红包 |
| 随机索引 + `remove(index)` | 抢走一个红包，同时从共享集合中删除 |
| 删除最后一个红包后提示 | 输出一次“活动结束” |

抢红包时，把**判断集合是否为空 → 随机取索引 → 删除红包**放进同一个同步块：

```java
synchronized (redPacket) {
    if (redPacket.isEmpty()) break;
    int index = (int) (Math.random() * redPacket.size());
    int money = redPacket.remove(index);
    // 打印抢取结果、检查是否抢完
}
```

100 个线程共享同一个 `redPacket` 对象，也就共享同一把锁。判空必须在锁内：等待锁的线程进入时，红包可能已经被其他人抢完，需要根据最新状态判断。本例通过所有线程共用一把锁，避免对 `ArrayList` 的并发删除及索引失效。

抢到后在**同步块外** `sleep(1000)`，给其他员工继续抢的机会。`sleep()` 不释放锁，如果放在同步块内，其他人就只能一起等。暂停能影响抢取节奏，但不保证公平，也不保证人人都能抢到红包。

### 排行榜：累计金额、等待结束后排序

当前已实现“按 100 名员工的红包总额降序展示”：每个 `PeopleGetRedPacket` 用成员变量 `totalMoney` 累计自己抢到的金额，并提供 `getTotalMoney()`。主线程把员工对象保存到 `people` 列表中，先启动全部线程，再逐个 `join()`，最后排序输出：

```java
people.sort((a, b) -> Integer.compare(b.getTotalMoney(), a.getTotalMoney()));
```

不要创建一个员工就立即 `join()`，否则会等这个员工结束才启动下一个。红包被抢光与所有线程结束不是同一时刻，有的线程可能仍在睡眠；`join()` 后再读取总金额，能确保统计的是最终结果。所有员工都保留在列表里，没抢到的显示 `0` 元。

```java
// 所有员工已在前面的循环中 start()
for (PeopleGetRedPacket person : people) {
    person.join(); // 主线程等这位员工结束，其他员工仍继续抢红包
}
// 循环正常结束后，所有员工都已结束，可以排序并展示最终金额
```

例如主线程等待员工 1 时，员工 2 可能已经抢完。之后执行员工 2 的 `join()` 就直接通过，不会再等待一次。**顺序等待各员工结束，不代表员工按顺序执行。** 不写这段等待，就可能在员工还在累加金额时提前排序、输出。

若用 `Map<员工, 总金额>` 保存结果，`TreeMap` 只能按**键**排序，不能直接按金额值排序。可以将 `entrySet()` 转成列表，再按值降序：

```java
List<Map.Entry<String, Integer>> ranking =
        new ArrayList<>(totals.entrySet());
ranking.sort((a, b) -> Integer.compare(b.getValue(), a.getValue()));
```

如果员工各自在自己的线程对象中记录总额，主线程可在 `join()` 后汇总；若多个线程直接写同一个普通 `HashMap`，也必须处理同步。要展示全部 100 人，没抢到红包的员工也应保留金额 `0`。

## 10.本次排错与小结

之前同一个包里存在 `MyThread` 和 `Mythread`，仅大小写不同。Java 区分大小写，但 Windows 通常不区分文件名大小写，编译产物发生冲突，导致 `NoClassDefFoundError ... wrong name`。已把创建示例中的类改为 `MyThread1`；以后避免同包类名只差大小写。

- 创建线程：`Thread` / `Runnable` / `Callable + FutureTask`，最终调用 `start()`。
- 等待：`sleep()` 暂停当前线程；`join()` 等目标线程结束；`get()` 等任务结果。
- 同步：共享数据的相关操作要使用同一把锁，并把检查与修改一起保护。
- 账户数据可锁 `this`，类级共享数据可锁 `类名.class`；独立的 `Lock` 对象也必须被相关线程共用。
- 线程池复用工作线程，任务通过 `execute()` / `submit()` 提交，不再使用时调用 `shutdown()`。
- 抢红包保护整段判空与删除操作；汇总排行榜前，要等所有抢取线程结束。
