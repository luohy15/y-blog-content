# Ansible Usage Guide

## Basic Concepts

{{< rawhtml >}}
<img src="https://cdn.luohy15.com/ansible.jpg" style="zoom: 50%;" />
{{< /rawhtml >}}

## Common Modules

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

## Variable Precedence

Common variable precedence (later ones have higher precedence)

1. inventory file
2. inventory groups_vars/all
3. inventory host_vars/*
4. include_vars
5. passed in -e key=value

For more on precedence, refer to the [documentation](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html#variable-precedence-where-should-i-put-a-variable)

## Custom Filters

Ansible implements template replacement and data [filters](https://docs.ansible.com/ansible/latest/user_guide/playbooks_filters.html) based on Jinja2.

Built-in filters may not always meet your needs, in which case you can [create custom filters](https://docs.ansible.com/ansible/latest/dev_guide/developing_plugins.html#filter-plugins).

For filter writing, refer to the [official filters](https://github.com/ansible/ansible/blob/devel/lib/ansible/plugins/filter/core.py).

You need to:

1. Create a `filter_plugins` directory in your playbook directory.
2. Create a Python file in this directory and define a `FilterModule` class.
3. This class should have a `filters` method that returns a dictionary, where the key is the filter name and the value is the function implementing the filter.
4. Write your logic within the implementation function.

Note: Use `ansible --version | grep "python version"` to check the Python version used by Ansible. If you want to use Python 3, refer to [this link](https://docs.ansible.com/ansible/latest/reference_appendices/python_3_support.html).

## Summary

Why Ansible: automation, modularity, standardization (multi-machine execution, encapsulation abstraction, module reuse)

What Ansible missed: state management (refer to Terraform and K8s)
