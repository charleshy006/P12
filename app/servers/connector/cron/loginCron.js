const cron = require('node-cron');
const {app} = require("pomelo");

// cron.schedule('* * * * *', async function () {

cron.schedule('59 59 23 * * *', async function () {
    await app.rpc.connector.remoter.count_login(null, Date.now(), (result) => {
        if (result) {
            console.info("login 每天 UTC 时间 23 点 59 分 59 秒执行一次清理空闲房间任务");
        } else {
            console.info("count_login error");
        }
    });
}, {
    timezone: 'UTC'
});