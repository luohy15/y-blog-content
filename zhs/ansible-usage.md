# anbsible 使用说明

## 基础概念

{{< rawhtml >}}
<img src="https://cdn.luohy15.com/ansible.jpg" style="zoom: 50%;" />
{{< /rawhtml >}}

## 常用的 module

file

    state: touch/directory/absent/link

template

    src: /path/to/conf.j2 (local)
    dest: /path/to/conf (remote)

user

    name: xxx
    state: present/absent

authorized_key

    user: xxx
    state: present/absent
    key: /path/to/key.pub

blockinfile

    path: /path/to/file
    block: |
        ___.   .__                 __    
        \_ |__ |  |   ____   ____ |  | __
        | __ \|  |  /  _ \_/ ___\|  |/ /
        | \_\ \  |_(  <_> )  \___|    < 
        |___  /____/\____/ \___  >__|_ \
            \/                 \/     \/

## 变量优先级

常见变量优先级（越靠后优先级越高）

1. inventory file
2. inventory groups_vars/all
3. inventory host_vars/*
4. include_vars
5. 传入-e key=value

更多优先级参考 [文档](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html#variable-precedence-where-should-i-put-a-variable)

## 自定义 filter

ansible 基于 Jinja2 实现模板替换及数据 [filter](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html)

内置的 filter 不一定满足需求，这时候可以 [自定义 filter](https://docs.ansible.com/ansible/latest/dev_guide/developing_plugins.html#filter-plugins)

filter 的写法参考 [官方 filter](https://github.com/ansible/ansible/blob/devel/lib/ansible/plugins/filter/core.py) 

你需要

1. 在 playbook 目录下创建`filter_plugins`目录
2. 在目录中创建 py 文件，定义一个`FilterModule`类
3. 该类拥有`filters`方法并返回一个 dict，dict 的 key 是 filter 名称，value 是 filter 具体实现的函数
4. 把自己的逻辑写在具体实现里

注意：使用`ansible --version | grep "python version"`查看 ansible 使用的 Python 版本，若要使用 Python3, 参考 [此链接](https://docs.ansible.com/ansible/latest/reference_appendices/python_3_support.html)

## 总结

why ansible: 自动化，模块化，标准化（多机执行，封装抽象，模块复用）

what ansible missed: 状态管理（参考 terraform 和 k8s)
