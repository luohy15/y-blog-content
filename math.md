# Common Math Problems in Programming

## Gauss Formula

$$
1 + 2 + 3 + ... + n = \frac{n(n+1)}{2}
$$

$$
(1 + 2 + 3 + ... + n) \newline +
(n + n-1 + n-2 + ... + 1) \newline
= (n+1) + (n+1) + ... + (n+1) \newline
= n(n+1)
$$

- [lc 3430](https://leetcode.com/problems/maximum-and-minimum-sums-of-at-most-size-k-subarrays/)


## Pascal's Law

$$
C_{n+1}^k = C_n^k + C_n^{k-1} \newline
C_n^k = \frac{n!}{k!(n-k)!} \newline
=\frac{(n-1)!}{k!(n-1-k)!} × \frac{n}{n-k} \newline
=C_{n-1}^k × \frac{n}{n-k}
$$

- [lc 3428](https://leetcode.com/problems/maximum-and-minimum-sums-of-at-most-size-k-subsequences/)


$$
\sum_{j=0}^{k-1} C_{i+1}^{j} \newline
=\sum_{j=0}^{k-1} (C_{i}^{j} + C_{i}^{j-1}) \newline
=\sum_{j=0}^{k-1} C_{i}^{j} + \sum_{j=0}^{k-1} C_{i}^{j-1} \newline
=\sum_{j=0}^{k-1} C_{i}^{j} + \sum_{j=0}^{k-2} C_{i}^{j} \newline
=\sum_{j=0}^{k-1} C_{i}^{j} + \sum_{j=0}^{k-1} C_{i}^{j} - C_{i}^{k-1} \newline
=2\sum_{j=0}^{k-1} C_{i}^{j} - C_{i}^{k-1} \newline
$$
