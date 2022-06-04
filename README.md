# ZK-Crush-Break

Rainbow Table attack to break zkcrush.xyz and reveal your crush. 

## Background

[Amir](https://twitter.com/amirbolous) released a project called [zkcrush.xyz](https://www.zkcrush.xyz/) that allowed a user to hash the name of their crush and reveal it to the public. Pretty cool project! This project implements a [Rainbow Table Attack](https://en.wikipedia.org/wiki/Rainbow_table) that can map hashes to names. To do this, we took the most common 5,000 first & last names for a total permutation of 25,000,000, calculated the hash of these names, and stored them in [Cockroach DB](https://www.cockroachlabs.com/). 

![zk-Crush - 4 June 2022](https://user-images.githubusercontent.com/97858468/172028596-39e63be5-d00f-4392-aa69-dd942b4011c9.gif)

## Credits

Original idea from Eva's tweet [here](https://twitter.com/evayzh/status/1532783063888969729).

