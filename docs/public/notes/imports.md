# Java 类的导入笔记

在 Java 中使用其他位置的类时，要区分三个概念：包、模块依赖和访问权限。

## 1.同一个包：

同一个包中的类可以直接使用类名，不需要 `import`。

```java
package com.ranan.student;

public class Student {}
```

```java
package com.ranan.student;

public class Test {
    Student student = new Student();
}
```

## 2.同一个模块、不同包：

同一模块中的包已经能够互相看见，不需要添加模块依赖，通常只需要导入目标类。

```java
package com.ranan.app;

import com.ranan.student.Student;

public class Test {
    public static void main(String[] args) {
        Student student = new Student();
    }
}
```

`import` 的格式：

```text
import 包名.类名;
```

也可以不写 `import`，直接使用完整类名：

```java
com.ranan.student.Student student =
        new com.ranan.student.Student();
```

## 3.不同模块：

跨模块使用类时，需要先让调用方模块依赖提供类的模块，再使用 `import`。

在 IDEA 中添加依赖：

```text
File
→ Project Structure
→ Modules
→ 选择调用方模块
→ Dependencies
→ +
→ Module Dependency
→ 选择提供类的模块
→ Apply
```

例如 `08-interface` 要使用 `09-more-advanced-oop2` 中的类，依赖方向为：

```text
08-interface
      ↓ 依赖
09-more-advanced-oop2
```

添加依赖后再导入：

```java
import com.ranan.innerclass3.Stu;
```

`import` 不会自动建立模块依赖。二者的作用不同：

```text
模块依赖：让当前模块能够看见目标模块
import：让代码可以省略类的完整包名
```

## 4.访问权限：

能够找到类，不代表一定能够使用它。跨包使用的类通常要声明为 `public`：

```java
public class Student {
    public Student() {}

    public void show() {}
}
```

如果类没有写 `public`：

```java
class Student {}
```

它只有包访问权限，只能在同一个包中使用。构造方法、成员变量和方法也需要具有合适的访问权限。

`import` 和模块依赖都不能绕过 `private`、默认、`protected`、`public` 等访问限制。

## 5.三种情况总结：

| 类的位置 | 是否需要模块依赖 | 是否需要 `import` |
| --- | --- | --- |
| 同一模块、同一个包 | 不需要 | 不需要 |
| 同一模块、不同包 | 不需要 | 通常需要 |
| 不同模块 | 需要 | 通常需要 |

简单记忆：

```text
同包直接用
同模块跨包要 import
跨模块先加依赖，再 import
最后还要检查访问权限
```

## 6.`module-info.java`：

如果以后使用 Java 模块系统，提供类的模块还需要导出包：

```java
module student.module {
    exports com.ranan.student;
}
```

调用方模块需要声明依赖：

```java
module app.module {
    requires student.module;
}
```

当前 IDEA 基础练习没有使用 `module-info.java` 时，只需配置 IDEA 模块依赖和普通 `import`。
