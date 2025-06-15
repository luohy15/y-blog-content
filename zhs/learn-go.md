# [转载] 学习 Go 笔记

原文链接：[学习 Go 笔记](https://hoblovski.github.io/2020/06/13/%E5%AD%A6%E4%B9%A0-Go-%E7%AC%94%E8%AE%B0.html)

GOPATH:

    GO 的安装, 包括相关库的安装位置

    默认是 /usr/local/go, 可以自己设置

    $GOPATH/src 中保存了 go 所有的程序文件.

    在某一个目录中执行 go install 即可安装该目录下的包

go build 是编译

go get remote 是远程获取包, 如

    go get github.com/xxx/xxx

    -u 可以自动解析依赖关系

go fmt

    格式化代码

go test

    读取 *_test.go 文件并执行测试

每个 package 都有一个保留函数: init

main package 还有保留函数: main

struct 允许匿名字段, 这相当于直接导入

type A struct { x int }

type B strcuct { A ; y int }

然后就可以访问 B.x B.y 以及 B.A.x 了

匿名字段可以部分实现继承, 而且它的机理可以直接无痛实现多继承

原理是

    如果某个 struct 有个匿名字段实现了某接口, 那么这个 struct 也实现了那个接口

接口也可以继承, 只需要接口的匿名字段即可  interface kid { sup.Interface ; foo(int) int; }

## 基础概念

导入模块

    某个模块中, 只有大些字母开头的符号才能被导出 (被其他模块使用)

    导入模块如

        import "strings"      相当于  import strings as s

        import . "strings"      相当于  import * from strings

        import s "strings"      相当于  import strings as s

基本类型

    string bool

    {|u}int{|8|16|32|64}

    float{32|64}

    rune    相当于 char

    变量默认给零值

    类型转换如 int8(i)

其他类型

    type 就相当于 typedef

    type XXX struct

    type XXX interface

    type XXX []int

变量声明

    var x int = 25

    var x := 25

    var a [10]int

    给 _ 赋值相当于丢弃这个值 (>/dev/null)

    var t = `Hello

        world`  是多行字符串的方法

    可以批量赋值

        x, y = y, x

动态分配内存变量

    基本类型变量使用 new

        a := new(int)   返回一个 *int

        *a = 5

    对于列表, 映射和管道, 使用 make

常量声明

    const x int = 0xDEADBEEF

    自增的常量序列

    const (

        x = iota    // 0

        y = iota    // 1

        z = iota    // 2

    )

for 和 if 语句

    类似 C, 但是没有圆括号, 花括号是必须的

    go 中使用 for 来完成 while

    go 中没有三元操作符, ?: 需要用 if 完成

goto 语句

    标签必须在当前函数内

switch-case 语句

    除非使用 fallthrough, 不然自动 break

    可以没有条件, 用来代替 if-elseif-elseif-else

    标签不一定要是整数

    一个 case 可以多个逗号隔开的条件

defer

    将函数调用推迟到外层函数结束时执行

    参数是立即求值的

    多个 defer 的情况下, 后进先出 (defer 栈)

    一般用法是

        open file xxx

        defer close file xxx

        lock

        defer unlock

指针

    go 有指针, 但是没有指针运算

    空指针是 nil

struct

    类似 C 的 struct, 但是 p->a 写成 p.a, 等于 (*p).a

    初始化如

    p := Point(2, 3)

    p := Point(x:2, y:3)

    p := new(Point)

数组 slice

    数组声明如 var a [10]int {1,2,3,4,5}

               b := [...]int {5,6,7,8,9}

               c := [2][2]int {{1,2}, {3,4}}

    动态分配如 a := make([]int, 10)

               a := make([]int, 2, 10)  // capacity 为 10, len 为 2

    数组 slice 是原数组的引用, 有属性

        len(slice), cap(slice)

    通过 slice := make([]type, len, [cap]) 构建

    在 C 中, 数组类似于 int(*)[3], 而 slice 类似于 int*

    数组 / slice 赋值是浅复制, 深复制需要 copy(dst, src)

映射

    声明如 maps := map[string]int {"one": 1, "two": 2}

    动态分配如 maps := make(map[int]int)

    映射可以动态添加. 不存在的 key 对应 zero value

方法

    Go 没有类, 但是有结构体的成员函数 (可以如 a.fn(b) 来调用)

    (事实上就是普通函数, 只不过有个接受者 Receiver)

    定义如 func (Type a) fnname(args), a 成为接受者

    定义了以 (T a) 为接受者的方法, 那么 T 就有了一个方法

    接受者类型是指针的时候, 可以直接  a.method()  等于 (&a).method()

    接受者类型是类型的时候, 可以直接  (&a).method()  等于 a.method()

接口

    定义接口如 type Name interface { funcs }

    某个结构类型实现某个接口中的函数, 只要填充以它为接受者的接口中方法就好了

    空接口类似于 java 中的 Object (C 中的 void*)

    i.(type) 用来判断 i 的类型, 只能如下荣法

    i interface ...

    switch v := i.(type)

    fmt 中的 Stringer 定义了 String() 方法, 实现了就能被 fmt 打印

错误处理

    go 中通常使用一个单独的返回值来表示错误, 而不是使用异常, 也不是负数代码

    如果返回值是 nil, 那么没有错误

    否则, 返回一个实现 error 接口的类型, 有错误.

    函数返回实现 error 接口的类型, 然后调用时

    if err := fn(); err != nil {

        // error handling

    }

goroutine

    特点

        * go 的运行时系统管理

        * 可以看成轻量级的线程, !!比线程还轻量级

        * 通过消息通信 (而不是共享)

    启动 goroutine: 必须指定一个函数

        有名函数    go f(x, y, z)

        匿名函数    go func() {

                        // some clumsy crap

                    }() // notice the pair of parenthesis here

    消息传递

        建立信道    ch := make(chan string)     // 传递 string 消息

        建立信道    ch := make(chan string, buffer_sz) // 有缓冲区的信道, 类似 mailbox

        接受消息    v := <- ch      或者    v, closed := <-ch

        发送消息    ch <- v

        发送和接受在另一方未准备好之前都是阻塞的

            (当然, 缓冲区中没有已经准备好的数据 / 没有满)

        关闭信道    close(ch)       使用 v,closed:=<-ch 的接受者可以察觉

            关闭信道之后, 其中缓冲的数据还是被保留的,

            只是不能继续送入数据了

        信道作为函数参数的时候, 可以指明方向如 done chan<- bool (只能发送)

    select 语句

        用于实现从多个信道接受消息

            select {

            case v := <-ch1:      // some clumsy crap

            case v2, eof := <-ch2 // crap here

            default:              // 其他信道都阻塞的情况下

            }

使用 goroutine 的设计模式

    fan-in:

        producer1 --\

                     v

                    fan: hide the fact that there are multiple producers -->  consumer

                     ^

        producer2 --/

    管道

        producer  -->  processor  --> processor  --> consumer

定时

    需要    import "time"

    用法

        一次性定时器

            <-timer.NewTimer(time.Duration(2) * time.Second).C

                阻塞一秒    (还有更好的方法是 time.Sleep())

            可以调用 stop() 来停止一个 timer

        周期定时器

特别重要的库

字符串

    import s "strings"

        s.Contains;     s.HasPrefix;    s.HasSuffix; ...

正则表达式

    import re "regexp"

    matchOrNot, err := re.MatchString("a?b", "b")

    matcher, err := re.Compile("^a*$")

    matcher := re.MustCompile("^a*$")   // guaranteed to compile

    var matchOrNot bool = a.MatchString("")

    var firstMatch string = a.FindString("adaaasd")

JSON

    网路通讯现在主要都是用 json.

    jsonObj, err := json.Marshal(structOrMapOrSliceOrPODObj)   // encode

时间

    import "time"

    time.Now()  time.Date(..)

    timeObj.Year, Month, Minute ...

    timeObj.Before, After ...

随机数

    import "math/rand"

    rand.Intn(100)  0 <= rand.Float64() < 1

    r1 := rand.New(rand.NewSource(time.Now().UnixNano()))

数字解析

    import "strconv"

    v, err := strconv.ParseInt("233", /*from=*/0, /*maxwidth*/=32)

读文件

    import ("bufio" "fmt" "io" "io/ioutil" "os")

    dat, err := ioutil.ReadFile("/tmp/dat")

    f, err := os.Open(path)             相当于 fd = open(path, O_RDONLY)

    f.Read(size) ([]byte, error)        没有缓冲, 相当于 unistd.h:read()

    r := bufio.NewReader(f)             相当于 fopen(path, "r")

    r.Read(data []byte) (int, error)    相当于 stdio.h:fread()

    f, err := os.Create(path)           相当于 fd = open(path, O_WRONLY, O_CREAT|O_TRUNC)

    标准输入输出错误是

        os.Stdin    os.Stdout   os.Stderr

命令行参数

    import "os"

    os.Args[1:]

    一般需要先编译再使用命令行参数

## HTTP

Go http 服务器

基础:

    使用 net/http 包

    需要一个处理函数

        func handler(rw http.ResponseWriter, r *http.Request)

        ->

        通过 HandleFunc 的包装实现了

        type Handler interface {

            ServeHTTP(ResponseWriter, Request)

        }

    然后在 main 当中注册这个 handler 到路由

        http.HandleFunc("/", handler)

    然后在 main 中启动服务

        err := http.ListenAndServe(":8080", nil)

        // nil: 使用默认的 ServeMux. 第二个参数也是 Handler

Conn

    服务每个连接的都是独立的 goroutine, 保证并发性

表单处理

    展现有表单的页面最简单的方法是

        t, _ := template.ParseFiles("page1.template")

        t.Execute(w, nil)

	// template 自动防止注入攻击

    在处理表单的页面处理函数中, 为了识别表单需要先

        r.ParseForm()

    这个即解析 GET 的表单也解析 POST 的表单

    访问表单值可以使用

        r.Form["key"]

        // r.Form 类型是 map[string][]string

        // 因为 html 允许多个同名控件

    验证表单通常是使用正则表达式的方式

	转义可以使用如下函数

	func HTMLEscape(w io.Writer, b []byte)

	func HTMLEscapeString(s String) string

	防止多次递交表单可以在表单中增加一个随机的隐藏项 (只能针对非恶意的用户)

网页模板

	https://golang.org/pkg/text/template/

	使用 html/template. 如上,

		t.Execute(w, obj)

	的 obj 是用于渲染模板的一个 struct. 模板文件中使用

		{{ .Field }}

			访问 obj.Field. 必须是 exported 字段

		{{ if .Flag }} ... {{ else }} ... {{ end }}

		{{ range .Arr }} {{ ... }} {{ end }}

上载文件

	为了能够上载文件, 表单的编码方式必须设置

		<form enctype="multipart/form-data" action="/upload" method="post"> ...

	并且加入文件输入域

		<input type="file" name="uploadedfile"/>

	在处理上载文件的页面, 需要首先解析表单

		r.ParseMultipartForm(1 << 20)

		mimeFile, mimeHeader, err := r.FormFile("uploadedfile");

		if err != nil { ... }

		defer mimeFile.Close()

	其中 1<<20 指内存缓冲区为 1M, 文件超过 1M 的部分放到磁盘上

	合理设置可以减少磁盘负担

	可以使用  mimeHeader.Filename  访问文件名;

	mimeFile  实现了  Reader, ReaderAt, Seeker, Closer, 可以直接使用

		nread, err := mimeFile.Read(size)

	也可以使用

		ntrans, err := io.Copy(dstFile, mimeFile)

	但是不可混用: io.Copy 不会做 rewind

## RPC

GO RPC

	有不同的框架, 这里使用 net/rpc.

	RPC 基本就是服务器注册一个物件, 作为一个服务暴露给外部.

	外部可以调用这个物件的方法.

	能够暴露的服务必须是

		func (t *T) MethodName(argType T1, replyType *T2) error;

	其中 argType, replyType 要能被 gob 序列化 (marshal)

	参数传入在 T1 中, 执行顺利返回值在 T2 中, 否则只返回 error