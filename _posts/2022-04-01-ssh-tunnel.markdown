---
layout: single
title:  SSH Tunnel
date: 2022-04-01 07:01:49 -0400
categories: cli terminal ssh
---
## tldr
```bash
$ ssh -L 6380:localhost:6379 secure-remote-server.example.com -N &
```
6380: port where I can access the service on my local machine localhost:6380<br />
6379: port that the server runs on on the remote machine<br />
-L: local socket:host:port does the heavy lifting creating the and exposing the tunnel<br />
-N: does not execute a command on the remote machine<br />
&: runs this command in the background<br />

Every time I need to do this, I have to search the web for instructions. Every time I search the web for instructions
I end up slogging through a bunch of results that either don't make sense to me, or are just different enough from what
I am trying to do that I can't accomplish my goal.

What I am almost always trying to do is expose a service running on some port on my server. My server is configured, for
security reasons, to open as few ports as necessary to outside requests. This means I open 80 & 443 for web traffic, and
22 for SSH and almost nothing else. I do not open ports for the database, or for Redis, or just about any other service
but I occasionally have a need to access these services from a remote machine. SSH Tunnel to the rescue!

An SHH tunnel creates a secure tunnel from one machine to another using SSH and it allows me to run a command on my local
machine to access a port (via the tunnel) on the remote machine that is not otherwise open to remote requests. So if I
want to view data from Redis on secure-remote-server.example.com on my local machine, and the remote server is running
Redis and serving it to it's localhost on port 6379 (localhost:6379), I would do the following on my local machine

```bash
$ ssh -L 6380:localhost:6379 secure-remote-server.example.com -N &
```

The above command assumes my username on the remote machine is the same as my username on my local machine. If not, I
prepend the username plus @ in front of the remote server.

```bash
$ ssh -L 6380:localhost:6379 user@secure-remote-server.example.com -N &
```
