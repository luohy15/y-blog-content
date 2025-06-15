# Learning Go Notes

Original link: [Learning Go Notes](https://hoblovski.github.io/2020/06/13/%E5%AD%A6%E4%B9%A0-Go-%E7%AC%94%E8%AE%B0.html)

GOPATH:

    GO installation, including the installation location of related libraries.

    Default is /usr/local/go, can be set by yourself.

    $GOPATH/src stores all go program files.

    Execute go install in a directory to install the package in that directory.

`go build` compiles.

`go get remote` fetches packages remotely, e.g.:

    go get github.com/xxx/xxx

    -u can automatically resolve dependencies.

`go fmt`

    Formats code.

`go test`

    Reads `*_test.go` files and executes tests.

Every package has a reserved function: `init`.

The `main` package also has a reserved function: `main`.

Structs allow anonymous fields, which is equivalent to direct embedding.

```go
type A struct { x int }

type B struct { A ; y int }
```

Then you can access `B.x`, `B.y`, and `B.A.x`.

Anonymous fields can partially implement inheritance, and their mechanism can painlessly implement multiple inheritance.

The principle is:

    If a struct has an anonymous field that implements an interface, then this struct also implements that interface.

Interfaces can also inherit, just by using anonymous fields of interfaces, e.g., `interface kid { sup.Interface ; foo(int) int; }`.

## Basic Concepts

Importing Modules

    In a module, only symbols starting with an uppercase letter can be exported (used by other modules).

    Importing modules, e.g.:

        import "strings"      is equivalent to  import strings as s

        import . "strings"      is equivalent to  import * from strings

        import s "strings"      is equivalent to  import strings as s

Basic Types

    string bool

    {|u}int{|8|16|32|64}

    float{32|64}

    rune    is equivalent to char

    Variables default to zero values.

    Type conversion, e.g., `int8(i)`.

Other Types

    `type` is equivalent to `typedef`.

    type XXX struct

    type XXX interface

    type XXX []int

Variable Declaration

    var x int = 25

    var x := 25

    var a [10]int

    Assigning to `_` is equivalent to discarding the value (>/dev/null).

    var t = `Hello
        world`  is a way to declare multi-line strings.

    Batch assignment is possible:

        x, y = y, x

Dynamically Allocated Variables

    Basic type variables use `new`:

        a := new(int)   returns an `*int`

        *a = 5

    For slices, maps, and channels, use `make`.

Constant Declaration

    const x int = 0xDEADBEEF

    Auto-incrementing constant sequence:

    const (
        x = iota    // 0
        y = iota    // 1
        z = iota    // 2
    )

`for` and `if` statements

    Similar to C, but without parentheses; curly braces are mandatory.

    Go uses `for` to achieve `while` loops.

    Go does not have a ternary operator; `?:` needs to be done with `if`.

`goto` statement

    Labels must be within the current function.

`switch-case` statement

    Automatically breaks unless `fallthrough` is used.

    Can be used without a condition to replace `if-elseif-elseif-else`.

    Labels don't necessarily have to be integers.

    A `case` can have multiple comma-separated conditions.

`defer`

    Defers a function call until the outer function finishes execution.

    Parameters are evaluated immediately.

    With multiple `defer` calls, they are executed in LIFO order (defer stack).

    Common usage:

        open file xxx
        defer close file xxx

        lock
        defer unlock

Pointers

    Go has pointers, but no pointer arithmetic.

    Nil pointer is `nil`.

Structs

    Similar to C structs, but `p->a` is written as `p.a`, which is equivalent to `(*p).a`.

    Initialization, e.g.:

    p := Point(2, 3)

    p := Point(x:2, y:3)

    p := new(Point)

Arrays and Slices

    Array declaration, e.g.: `var a [10]int {1,2,3,4,5}`
               `b := [...]int {5,6,7,8,9}`
               `c := [2][2]int {{1,2}, {3,4}}`

    Dynamic allocation, e.g.: `a := make([]int, 10)`
               `a := make([]int, 2, 10)`  // capacity is 10, length is 2

    A slice is a reference to the original array, with properties:

        len(slice), cap(slice)

    Constructed via `slice := make([]type, len, [cap])`.

    In C, an array is similar to `int(*)[3]`, while a slice is similar to `int*`.

    Array/slice assignment is shallow copy; deep copy requires `copy(dst, src)`.

Maps

    Declaration, e.g.: `maps := map[string]int {"one": 1, "two": 2}`

    Dynamic allocation, e.g.: `maps := make(map[int]int)`

    Maps can be dynamically added. Non-existent keys correspond to zero values.

Methods

    Go does not have classes, but it has member functions for structs (can be called as `a.fn(b)`).

    (In fact, they are ordinary functions, but with a receiver).

    Definition, e.g.: `func (Type a) fnname(args)`, where `a` becomes the receiver.

    If a method is defined with `(T a)` as the receiver, then `T` has that method.

    When the receiver type is a pointer, `a.method()` is equivalent to `(&a).method()`.

    When the receiver type is a value, `(&a).method()` is equivalent to `a.method()`.

Interfaces

    Define an interface, e.g.: `type Name interface { funcs }`

    A struct type implements an interface's functions by simply filling in the methods of the interface with itself as the receiver.

    An empty interface is similar to Java's `Object` (C's `void*`).

    `i.(type)` is used to determine the type of `i`, only in a `switch` statement:

    i interface ...
    switch v := i.(type)

    `fmt.Stringer` defines a `String()` method; implementing it allows `fmt` to print.

Error Handling

    In Go, a separate return value is typically used to indicate errors, rather than exceptions or negative error codes.

    If the return value is `nil`, there is no error.

    Otherwise, a type implementing the `error` interface is returned, indicating an error.

    If a function returns a type implementing the `error` interface, then when calling it:

    if err := fn(); err != nil {
        // error handling
    }

Goroutines

    Features:

        * Managed by Go's runtime system.

        * Can be seen as lightweight threads, even lighter than threads.

        * Communicate via messages (rather than sharing memory).

    Starting a goroutine: A function must be specified.

        Named function: `go f(x, y, z)`

        Anonymous function: `go func() {
                                // some clumsy crap
                            }()` // notice the pair of parentheses here

    Message Passing

        Creating a channel: `ch := make(chan string)`     // passes string messages

        Creating a buffered channel: `ch := make(chan string, buffer_sz)` // buffered channel, similar to a mailbox

        Receiving messages: `v := <- ch`      or    `v, closed := <-ch`

        Sending messages: `ch <- v`

        Sending and receiving are blocking until the other side is ready.

            (Of course, if the buffer has no ready data / is not full).

        Closing a channel: `close(ch)`       can be detected by the receiver using `v,closed:=<-ch`.

            After closing a channel, buffered data is still retained,
            but no more data can be sent into it.

        When a channel is a function parameter, its direction can be specified, e.g., `done chan<- bool` (send-only).

    `select` statement

        Used to receive messages from multiple channels.

            select {
            case v := <-ch1:      // some clumsy crap
            case v2, eof := <-ch2 // crap here
            default:              // if all other channels are blocked
            }

Design Patterns using Goroutines

    fan-in:

        producer1 --\
                     v
                    fan: hide the fact that there are multiple producers -->  consumer
                     ^
        producer2 --/

    Pipelines:

        producer  -->  processor  --> processor  --> consumer

Timing

    Requires `import "time"`.

    Usage:

        One-time timer:

            <-timer.NewTimer(time.Duration(2) * time.Second).C

                Blocks for one second (a better way is `time.Sleep()`).

            Can call `stop()` to stop a timer.

        Periodic timer:

Particularly Important Libraries

Strings

    import s "strings"

        s.Contains;     s.HasPrefix;    s.HasSuffix; ...

Regular Expressions

    import re "regexp"

    matchOrNot, err := re.MatchString("a?b", "b")

    matcher, err := re.Compile("^a*$")

    matcher := re.MustCompile("^a*$")   // guaranteed to compile

    var matchOrNot bool = a.MatchString("")

    var firstMatch string = a.FindString("adaaasd")

JSON

    Network communication primarily uses JSON now.

    jsonObj, err := json.Marshal(structOrMapOrSliceOrPODObj)   // encode

Time

    import "time"

    time.Now()  time.Date(..)

    timeObj.Year, Month, Minute ...

    timeObj.Before, After ...

Random Numbers

    import "math/rand"

    rand.Intn(100)  0 <= rand.Float64() < 1

    r1 := rand.New(rand.NewSource(time.Now().UnixNano()))

Number Parsing

    import "strconv"

    v, err := strconv.ParseInt("233", /*from=*/0, /*maxwidth*/=32)

Reading Files

    import ("bufio" "fmt" "io" "io/ioutil" "os")

    dat, err := ioutil.ReadFile("/tmp/dat")

    f, err := os.Open(path)             is equivalent to `fd = open(path, O_RDONLY)`

    f.Read(size) ([]byte, error)        No buffering, equivalent to `unistd.h:read()`

    r := bufio.NewReader(f)             is equivalent to `fopen(path, "r")`

    r.Read(data []byte) (int, error)    is equivalent to `stdio.h:fread()`

    f, err := os.Create(path)           is equivalent to `fd = open(path, O_WRONLY, O_CREAT|O_TRUNC)`

    Standard input/output/error are:

        os.Stdin    os.Stdout   os.Stderr

Command Line Arguments

    import "os"

    os.Args[1:]

    Generally requires compilation before using command line arguments.

## HTTP

Go HTTP Server

Basics:

    Uses the `net/http` package.

    Requires a handler function:

        func handler(rw http.ResponseWriter, r *http.Request)

        ->

        Implemented via `HandleFunc` wrapper:

        type Handler interface {
            ServeHTTP(ResponseWriter, Request)
        }

    Then register this handler to the router in `main`:

        http.HandleFunc("/", handler)

    Then start the service in `main`:

        err := http.ListenAndServe(":8080", nil)

        // nil: uses the default ServeMux. The second parameter is also a Handler.

Connections

    Each connection is served by an independent goroutine, ensuring concurrency.

Form Handling

    The simplest way to display a page with a form is:

        t, _ := template.ParseFiles("page1.template")
        t.Execute(w, nil)

    // template automatically prevents injection attacks.

    In the page handler function that processes the form, to identify the form, you first need to:

        r.ParseForm()

    This parses both GET and POST forms.

    Accessing form values can be done using:

        r.Form["key"]

        // r.Form type is map[string][]string
        // because HTML allows multiple controls with the same name.

    Form validation is usually done using regular expressions.

    Escaping can use the following functions:

    func HTMLEscape(w io.Writer, b []byte)

    func HTMLEscapeString(s String) string

    To prevent multiple form submissions, you can add a random hidden field to the form (only for non-malicious users).

Web Templates

    https://golang.org/pkg/text/template/

    Uses `html/template`. As above,

        t.Execute(w, obj)

    `obj` is a struct used to render the template. In the template file, use:

        {{ .Field }}

            to access `obj.Field`. Must be an exported field.

        {{ if .Flag }} ... {{ else }} ... {{ end }}

        {{ range .Arr }} {{ ... }} {{ end }}

Uploading Files

    To upload files, the form's encoding type must be set:

        <form enctype="multipart/form-data" action="/upload" method="post"> ...

    And add a file input field:

        <input type="file" name="uploadedfile"/>

    In the page that handles file uploads, you first need to parse the form:

        r.ParseMultipartForm(1 << 20)

        mimeFile, mimeHeader, err := r.FormFile("uploadedfile");

        if err != nil { ... }

        defer mimeFile.Close()

    Here, `1<<20` means the memory buffer is 1MB; parts of the file exceeding 1MB are written to disk.

    Proper settings can reduce disk burden.

    You can access the filename using `mimeHeader.Filename`;

    `mimeFile` implements `Reader`, `ReaderAt`, `Seeker`, `Closer`, and can be used directly:

        nread, err := mimeFile.Read(size)

    You can also use:

        ntrans, err := io.Copy(dstFile, mimeFile)

    But they cannot be mixed: `io.Copy` does not rewind.

## RPC

GO RPC

    There are different frameworks; here we use `net/rpc`.

    RPC basically means a server registers an object, exposing it as a service to the outside.

    The outside can call methods of this object.

    Exposed services must be:

        func (t *T) MethodName(argType T1, replyType *T2) error;

    Where `argType`, `replyType` must be serializable by `gob` (marshal).

    Parameters are passed in `T1`, successful execution returns value in `T2`, otherwise only `error` is returned.
