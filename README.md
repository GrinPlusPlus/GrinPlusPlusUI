## Grin++

### The most private crypto wallet.

#### Based on Grin++

Grin++ was **designed** and **coded** to be **secure**, **fast**, and **reliable**. It serves as a robust backend for lightning fast desktop, mobile, and server applications to be built on top of.

Grin++ is **heavily modularized**, and was built to be **able to scale with the Grin network**. Components were designed with a clear separation of concerns using simple, easy-to-use APIs. This makes it straight-forward for users to build custom, drop-in implementations of any one of the components to better suit their needs.

Grin++ offers several advantages. Here are just a few:

- Windows, Linux, MacOS X support.
- Simple to use UX/UI.
- Multi-user support.
- Lightning fast refreshes & wallet restores.
- Full AES w/scrypt encryption to protect your coins and privacy.
- Passwords never stored in memory.
- Send/Receive coins via Tor.

### Building

#### macOS

```bash
#!/usr/bin/env bash

brew install tor
brew install rocksdb
brew install cmake
git submodule update --init
cd GrinPlusPlus
rm -Rf build
mkdir build && cd build
CC=gcc-9 CXX=g++-9 cmake ..
cmake --build . --config RelWithDebInfo
cd ..
npm install
npm run dev
```

#### Now, Let's talk about Grin a little bit

Grin is a lightweight implementation of the Mimblewimble protocol. The main goal and characteristics of the Grin project are:

- **Privacy by default**. This enables complete fungibility without precluding the ability to selectively disclose information as needed.
- **Scales** mostly with the number of users and minimally with the number of transactions (<100 byte kernel), resulting in a large space saving compared to other blockchains.
- **Strong and proven cryptography**. Mimblewimble only relies on Elliptic Curve Cryptography which has been tried and tested for decades.
- Design **simplicity** that makes it easy to audit and maintain over time.
- Community driven, encouraging mining **decentralization**.

#### Privacy and Fungibility

There are 3 main properties of Grin transactions that make them private:

1. There are no addresses.
2. There are no amounts.
3. 2 transactions, one spending the other, can be merged in a block to form only one, removing all intermediary information.

The 2 first properties mean that all transactions are indistinguishable from one another. Unless you directly participated in the transaction, all inputs and outputs look like random pieces of data (in lingo, they're all random curve points). `Moreover, there are no more transactions in a block. A Grin block looks just like one giant transaction and all original association between inputs and outputs is lost.

#### Wait, what!? No address?

Nope, no address. All outputs in Grin are unique and have no common data with any previous output. Instead of relying on a known address to send money, transactions have to be built interactively, with two (or more) wallets exchanging data with one another. This interaction **does not require both parties to be online at the same time**. Practically speaking, there are many ways for two programs to interact privately and securely. This interaction could even take place over email or Signal (or carrier pigeons).
