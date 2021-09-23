---
title: 'PHP实现协程'
date: 2020-10-27 19:51:41
# 永久链接
permalink: '/phpyield'
# 文章访问密码
# keys: '123'
# 是否发布文章
# publish: false
# 置顶: 降序，可以按照 1, 2, 3, ... 来降低置顶文章的排列优先级
# sticky: 1
# sidebar: false
# sidebarDepth: 2
# isTimeLine: false
# isShowComment: true
categories:
- 'php'
---

转自: [http://www.php20.cn/article/sw/协程/148](http://www.php20.cn/article/sw/%E5%8D%8F%E7%A8%8B/148)

```php
/**
 * 任务对象
 * Class Task
 */
class Task
{
    protected $taskId;//任务id
    protected $coroutine;//生成器
    protected $sendValue = null;//生成器send值
    protected $beforeFirstYield = true;//迭代指针是否是第一个

    public function __construct($taskId, Generator $coroutine)
    {
        $this->taskId = $taskId;
        $this->coroutine = $coroutine;
    }

    public function getTaskId()
    {
        return $this->taskId;
    }

    /**
     * 设置插入数据
     * @param $sendValue
     */
    public function setSendValue($sendValue)
    {
        $this->sendValue = $sendValue;
    }

    /**
     * send数据进行迭代
     * @return mixed
     */
    public function run()
    {
        //如果是
        if ($this->beforeFirstYield) {
            $this->beforeFirstYield = false;
            var_dump($this->coroutine->current());
            return $this->coroutine->current();
        } else {
            $retval = $this->coroutine->send($this->sendValue);
            $this->sendValue = null;
            return $retval;
        }
    }

    /**
     * 是否完成
     * @return bool
     */
    public function isFinished()
    {
        return !$this->coroutine->valid();
    }
}

/**
 * 任务调度
 * Class Scheduler
 */
class Scheduler
{
    protected $maxTaskId = 0;//任务id
    protected $taskMap = []; // taskId => task
    protected $taskQueue;//任务队列

    public function __construct()
    {
        $this->taskQueue = new SplQueue();
    }

    public function newTask(Generator $coroutine)
    {
        $tid = ++$this->maxTaskId;
        //新增任务
        $task = new Task($tid, $coroutine);
        $this->taskMap[$tid] = $task;
        $this->schedule($task);
        return $tid;
    }

    /**
     * 杀死一个任务
     * @param $taskId
     * @return bool
     */
    public function killTask($taskId)
    {
        if (!isset($this->taskMap[$taskId])) {
            return false;
        }

        unset($this->taskMap[$taskId]);

        /**
         * 遍历队列,找出id相同的则删除
         */
        foreach ($this->taskQueue as $i => $task) {
            if ($task->getTaskId() === $taskId) {
                unset($this->taskQueue[$i]);
                break;
            }
        }

        return true;
    }

    /**
     * 任务入列
     * @param Task $task
     */
    public function schedule(Task $task)
    {
        $this->taskQueue->enqueue($task);
    }

    public function run()
    {
        while (!$this->taskQueue->isEmpty()) {
            //任务出列进行遍成历生器数据
            $task = $this->taskQueue->dequeue();
            $retval = $task->run();

            // 如果返回的是YieldCall实例,则先执行
            if ($retval instanceof YieldCall) {
                $retval($task, $this);
                continue;
            }

            if ($task->isFinished()) {
                //完成则删除该任务
                unset($this->taskMap[$task->getTaskId()]);
            } else {
                //继续入列
                $this->schedule($task);
            }
        }
    }
}

class YieldCall
{
    protected $callback;

    public function __construct(callable $callback)
    {
        $this->callback = $callback;
    }

    /**
     * 调用时将返回结果
     * @param Task $task
     * @param Scheduler $scheduler
     * @return mixed
     */
    public function __invoke(Task $task, Scheduler $scheduler)
    {
        $callback = $this->callback;
        return $callback($task, $scheduler);
    }
}

/**
 * 传入一个生成器函数用于新增任务给调度器调用
 * @param Generator $coroutine
 * @return YieldCall
 */
function newTask(Generator $coroutine)
{
    return new YieldCall(
    //该匿名函数,会在调度器中新增一个任务
        function (Task $task, Scheduler $scheduler) use ($coroutine) {
            $task->setSendValue($scheduler->newTask($coroutine));
            $scheduler->schedule($task);
        }
    );
}

/**
 * 杀死一个任务
 * @param $taskId
 * @return YieldCall
 */
function killTask($taskId)
{
    return new YieldCall(
    //该匿名函数,传入一个任务id,然后让调度器去杀死该任务
        function (Task $task, Scheduler $scheduler) use ($taskId) {
            $task->setSendValue($scheduler->killTask($taskId));
            $scheduler->schedule($task);
        }
    );
}

function getTaskId()
{
    //返回一个YieldCall的实例
    return new YieldCall(
    //该匿名函数会先获取任务id,然后send给生成器,并且由YieldCall将task_id返回给生成器函数
        function (Task $task, Scheduler $scheduler) {
            $task->setSendValue($task->getTaskId());
            $scheduler->schedule($task);
        }
    );
}

function task1()
{
    $task_id = (yield getTaskId());
    for ($i = 0; $i <= 300; $i++) {
        //写入文件,大概要3000微秒
        usleep(3000);
        echo "任务{$task_id}写入文件{$i}\n";
        yield $i;
    }
}

function task4()
{
    $task_id = (yield getTaskId());
    while (true) {
        echo "任务{$task_id}发送短信\n";
        yield;
    }
}

function task2()
{
    $task_id = (yield getTaskId());
    $child_task_id = (yield newTask(task4()));
    for ($i = 0; $i <= 500; $i++) {
        //发送邮件给500名会员,大概3000微秒
        usleep(3000);
        echo "任务{$task_id}发送邮件{$i}\n";
        yield $i;
        if ($i == 200) {
            yield killTask($child_task_id);
        }
    }
}

function task3()
{
    $task_id = (yield getTaskId());
    for ($i = 0; $i <= 100; $i++) {
        //模拟插入100条数据,大概3000微秒
        usleep(3000);
        echo "任务{$task_id}插入数据{$i}\n";
        yield $i;
    }
}

$scheduler = new Scheduler;

$scheduler->newTask(task1());
$scheduler->newTask(task2());
$scheduler->newTask(task3());

$scheduler->run();
```