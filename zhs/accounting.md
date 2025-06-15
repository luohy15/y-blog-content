# 我如何分析账单

## 最终效果

1. 我可以清晰地知道自己某个时间点的财务状况 （资产负债，收入支出）

2. 每个月的账单维护更新时间成本大约是 2h

3. ~~虽然这一切并没有什么卵用哈哈哈，引用某人的话：几百块钱有什么好记的~~

4. 我的思路：我不记账，我只分析账单，别做 **数据标注员**，要做 **数据分析师**

## 整体流程

1. 获取账单（手动）: 每个月的最后一个周末，我会导出所有支付应用的账单，由于这些网站都需要登录，所以暂时手动下载

2. 支出分类（半自动）: 记账的本质很大一部分上就是支出分类，一些确定的收款对象，比如滴滴/饿了么这种就可以根据时间/花费匹配到对应的分类（打车骑车/早午晚餐）, 其余根据实际情况微调，基本上经过几次迭代后可以覆盖到 80%以上的支出条项

3. 查看报告（自动）: 支出分类完成后导入 beancount 即可查看到收入支出表和资产负债表，可以随心所欲查询自己感兴趣的数据

## 获取账单

支付宝：电脑打开网页端 [我的账单](https://consumeprod.alipay.com/record/standard.htm), 选择查询范围，下载查询结果

微信：手机进入钱包-账单-常见问题-下载账单

其余手动导出

## 支出分类

根据交易信息（对象，描述，时间等）匹配到对应的分类 (beancount 账户）

```python
# 基于交易时间
def get_eating_account(time=None):
    if time == None or not hasattr(time, 'hour'):
        return 'Expenses:Food'
    if time.hour <= 3:
        return 'Expenses:Food:Snacks'
    elif time.hour <= 10:
        return 'Expenses:Food:Regular:Breakfast'
    elif time.hour <= 16:
        return 'Expenses:Food:Regular:Lunch'
    elif time.hour <= 21:
        return 'Expenses:Food:Regular:Dinner'
    else:
        return 'Expenses:Food:Snacks'

# 基于交易描述
descriptions = {
    '滴滴打车|滴滴快车|滴滴专车': 'Expenses:Transport:Taxi',
    '单车': 'Expenses:Transport:Public',
    '12306': 'Expenses:Transport:Railway',
    '便利蜂': 'Expenses:Food:Regular:Breakfast',
    '便利店': 'Expenses:Food:Snacks',
    '外卖订单': get_eating_account,
    '美团订单': get_eating_account
}
```

## 查看报告

### 查看支出的 Treemap/Sunburst

![fava tree circle](https://cdn.luohy15.com/fava-tree-circle.png)

### 按账户筛选

![fava account](https://cdn.luohy15.com/fava-account.png)

### 按时间筛选

右上角可以选择不同时间跨度 (interval)

同时输入框也可以输入时间范围 (range)

范围选取功能十分强大，示例如下：

#### 相对日期

昨天到今天：`day-1 - day`

#### 绝对日期

`2020-04-12 - 2020-04-22`

#### 常用日期

```plaintext
year
quarter
month
week
day
2020
2020-q2
2020-04
2020-w15
2020-04-20
```

#### 相对&绝对

本月 10 日：`(month)-10`