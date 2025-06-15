# How I Analyze My Bills

## Final Result

1. I can clearly know my financial status at any given time (assets, liabilities, income, expenses).

2. The time cost for maintaining and updating bills each month is approximately 2 hours.

3. ~~Although all this is pretty useless, haha, as someone said: "What's the point of keeping track of a few hundred bucks?"~~

4. My approach: I don't keep accounts; I only analyze bills. Don't be a **data annotator**; be a **data analyst**.

## Overall Process

1. Obtain bills (manual): On the last weekend of each month, I export bills from all payment applications. Since these websites require login, I currently download them manually.

2. Expense categorization (semi-automatic): A large part of accounting is expense categorization. For certain payees, like Didi/Ele.me, expenses can be matched to corresponding categories (taxi/bike rides, breakfast/lunch/dinner) based on time/cost. Others are fine-tuned according to actual situations. Basically, after a few iterations, it can cover over 80% of expense items.

3. View reports (automatic): After expense categorization, importing into Beancount allows me to view income/expense statements and balance sheets, and query any data I'm interested in.

## Obtaining Bills

Alipay: Open the web version of [My Bills](https://consumeprod.alipay.com/record/standard.htm) on a computer, select the query range, and download the results.

WeChat: Go to Wallet - Bills - Common Problems - Download Bills on your phone.

Others are exported manually.

## Expense Categorization

Match to corresponding categories (Beancount accounts) based on transaction information (object, description, time, etc.).

```python
# Based on transaction time
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

# Based on transaction description
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

## Viewing Reports

### Viewing Expense Treemap/Sunburst

![fava tree circle](https://cdn.luohy15.com/fava-tree-circle.png)

### Filter by Account

![fava account](https://cdn.luohy15.com/fava-account.png)

### Filter by Time

The top right corner allows selecting different time intervals.

The input box also allows entering a time range.

The range selection function is very powerful, examples are as follows:

#### Relative Dates

Yesterday to today: `day-1 - day`

#### Absolute Dates

`2020-04-12 - 2020-04-22`

#### Common Dates

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

#### Relative & Absolute

10th of this month: `(month)-10`
