## MQTT

### 禁用函数检查

>   使用这个脚本检查是否有禁用函数

```bash
curl -Ss https://www.workerman.net/check | php
```

使用`workerman`需要解除一下函数的禁用

```
stream_socket_server
stream_socket_client
pcntl_signal_dispatch
pcntl_signal
pcntl_alarm
pcntl_fork
posix_getuid
posix_getpwuid
posix_kill
posix_setsid
posix_getpid
posix_getpwnam
posix_getgrnam
posix_getgid
posix_setgid
posix_initgroups
posix_setuid
posix_isatty
```



### 准备

**先杀掉之前的`mqtt.php`的进程**，现在因为是重新写了一个`mqtt_promote.php`



### 每次代码更新，都得重新杀掉此进程，重新运行，因为`workerman`是常驻内存的。



```bash
ps -ef | grep php

[root@VM-16-4-centos ~]# ps -ef | grep php
root     24544 16825  0 14:18 pts/0    00:00:00 WorkerMan: master process  start_file=/data/work/php/process/mqtt_promote.php

kill -9 24544
```



执行脚本

`php`环境`ok`即可。不一定要7.4

```bash
nohup /www/server/php/74/bin/php 文件所在目录/vinet-api.kssina.com/mqtt_promote.php start > /文件所在目录/vinet-api.kssina.com/data/mqtt.log 2>&1 &
```



![运行结果测试](https://xingqiu-tuchuang-1256524210.cos.ap-shanghai.myqcloud.com/4021/20220407144740.png)



以守护进程进行运行

```bash
/www/server/php/74/bin/php /data/work/php/process/mqtt_promote.php start -d > /data/work/php/process/mqtt.log 2>&1

```

```bash
/www/server/php/71/bin/php /www/wwwroot/vinet-api.kssina.com/mqtt_promote.php start -d > /www/wwwroot/vinet-api.kssina.com/data/mqtt.log 2>&1
```

