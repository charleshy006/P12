const { app } = require("pomelo");
const axios = require("axios");
const Constants = require("pomelo/lib/util/constants");
const {Cell} = require("@ton/core");

// 用户断线触发
// async function web3recharge(senderid, amount, hash, time) {
async function web3rechargeold(user_address, hash, cb) {
    // 替换为你的BscScan API Key
    // const apiKey = 'FQVVAMFY38MT2MI6BEQ6B6YMFWBNAW6ENB';
    const apiKey = '4bd326d9522d4b989ee058b0953e0674';
    // 币安测试链上USDT合约地址
    const usdtContractAddress = '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd';
    //
    // const usdtContractAddress = '0xB9D0F1fd891cD81B7142b41728fFc3124B26d955';
    // 替换为实际的发送地址
    // const senderAddress = '0x2dC9344D1Edee64eBcbcBF7f82f3e48e8Fb20Dde';//user1
    const senderAddress = user_address;
    // 替换为实际的接收地址
    // const receiverAddress = '0x83113269f61a00a7771b1b0c63f53ef7d3d431bd';//user2
    const receiverAddress = '0x922c7d2de26906ff414bcc98d197e95dda789aa2';
    const apiUrl = `https://api-testnet.bscscan.com/api?module=account&action=tokentx&contractaddress=${usdtContractAddress}&address=${senderAddress}&sort=asc&apikey=${apiKey}`;
    console.info("web3recharge apiUrl " + apiUrl);
    let flag = false;
    axios.get(apiUrl).then(response => {
        const transactions = response.data.result;
        for (const tx of transactions) {
            const from = tx.from;
            const to = tx.to;
            if (from && to && from.toLowerCase() === senderAddress.toLowerCase() && to.toLowerCase() === receiverAddress.toLowerCase()) {
                // 输出交易的关键信息
                // console.info('找到匹配的 USDT 到账交易：');
                // console.info('交易哈希：', tx.hash);
                // console.info('交易时间：', new Date(parseInt(tx.timeStamp) * 1000).toLocaleString());
                // console.info('交易金额：', tx.value / Math.pow(10, parseInt(tx.tokenDecimal)));
                if (hash === tx.hash) {
                    console.info('交易成功！！！：', tx.hash);
                    
                    flag = true;
                }
                // return;
            }
        }
        // console.info('未到账');
        // return false;
        if (flag) {
            cb(true);
        } else {
            cb(false);

        }
    })
    .catch(error => {
        console.error('查询出错:', error);
    });
};

async function checkTransactionStatus(txHash, cb) {
    const rpcUrl = 'https://bsc-testnet.4everland.org';
    const jsonRpcPayload = {
        jsonrpc: '2.0',
        method: 'eth_getTransactionReceipt',
        params: [txHash],
        id: 1
    };

    try {
        const response = await axios.post(rpcUrl, jsonRpcPayload);
        const receipt = response.data.result;

        if (receipt) {
            if (receipt.status === '0x1') {
                console.log('交易成功');
                cb(true);
            } else {
                console.log('交易失败');
                cb(false);
            }
        } else {
            console.log('未找到该交易的收据');
            cb(false);
        }
    } catch (error) {
        console.error('查询交易状态时出错:', error.message);
        cb(false);
    }
}
// async function web3rechargeTest(hash, cb) {
//     // 替换为你的BscScan API Key
//     const apiKey = 'FQVVAMFY38MT2MI6BEQ6B6YMFWBNAW6ENB';
//     // 币安测试链上USDT合约地址
//     const usdtContractAddress = '0x337610d27c682E347C9cD60BD4b3b107C9d34dDd';
//     const apiUrl = `https://api-testnet.bscscan.com/api?module=transaction&action=gettxreceiptstatus&txhash=${hash}&apikey=${apiKey}`;
//     console.info("web3recharge apiUrl " + apiUrl);
//     axios.get(apiUrl)
//         .then(response => {
//             const result = response.data;
//             if (result && result.status === '1') {
//                 // 交易存在且成功
//                 console.info('交易成功！！！：', hash);
//                 cb(true);
//             } else {
//                 console.info('未找到匹配的交易或交易失败：', hash);
//                 cb(false);
//             }
//         })
//         .catch(error => {
//             console.error('查询出错:', error);
//             cb(false);
//         });
// }

async function web3recharge(hash, cb) {

//     测试版本：
// hash:0xdb3f6631e7bdaef3fb2baadc4e790c3b3711ebccb565a25fa7588002376635d3
//     usdt合约：0xB9D0F1fd891cD81B7142b41728fFc3124B26d955
//     充值合约：0x8ccaf4d40ea0001e4b8898302388706ee2deac9c
//
//     对接步骤：
// 1.授权usdt合约
//     调用usdt合约的approve方法。
// 参数说明：
// spender:充值合约地址
//     value:授权的金额
//
//
//     2.调用充值合约的deposit方法
//     参数说明：
// _amount：充值金额


    // 替换为你的BscScan API Key（确保适用于正式链）
    const apiKey = 'FQVVAMFY38MT2MI6BEQ6B6YMFWBNAW6ENB';
    // 币安正式链上USDT合约地址（这里虽然函数未用到该变量，但如果后续有扩展需求可保留）
    const usdtContractAddress = '0x55d398326f99059fF775485246999027B3197955';
    let apiUrl = `https://api.bscscan.com/api?module=transaction&action=gettxreceiptstatus&txhash=${hash}&apikey=${apiKey}`;
    if (app.get('server_status') === Constants.RESERVED.ENV_DEV) {
        apiUrl = `https://api-testnet.bscscan.com/api?module=transaction&action=gettxreceiptstatus&txhash=${hash}&apikey=${apiKey}`;
        console.info("TEST web3recharge apiUrl " + apiUrl);
    } else if (app.get('server_status') === Constants.RESERVED.ENV_PRO) {
        apiUrl = `https://api.bscscan.com/api?module=transaction&action=gettxreceiptstatus&txhash=${hash}&apikey=${apiKey}`;
        console.info("PROD web3recharge apiUrl " + apiUrl);
    }
    axios.get(apiUrl)
        .then(response => {
            const result = response.data;
            if (result && result.status === '1') {
                // 交易存在且成功
                console.info('交易成功！！！：', hash);
                cb(true);
            } else {
                console.info('未找到匹配的交易或交易失败：', hash);
                cb(false);
            }
        })
        .catch(error => {
            console.error('查询出错:', error);
            cb(false);
        });
}

module.exports = {
    web3recharge,
    checkTransactionStatus
};