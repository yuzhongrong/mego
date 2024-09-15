  // 通过 CDN 加载 Solana Web3.js，使用 global 对象 solanaWeb3
  const { Connection, PublicKey, Transaction, SystemProgram } = solanaWeb3;


// 获取 Buy按钮
const buy = document.getElementById("buyButton");

// Solana网络连接
const connection = new Connection('https://api.mainnet-beta.solana.com');

 // 检查 OKX 或 Solana 钱包是否已经安装
 const checkWallet = async () => {
    if (typeof window.okxwallet !== 'undefined') {
        console.log('OKX is installed!');
    }else{
        console.log('OKX is not installed!');
    }
};



 // 连接钱包的方法
 const connectWallet = async () => {
    // const wallet = await checkWallet();
    // if (!wallet) {
    //     return;
    // }


    try {
        const provider = window.okxwallet.solana;
        const resp = await provider.connect();
        console.log(resp.publicKey.toString());
        // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo
        // { address: string, publicKey: string }
        
      } catch (error) {
        console.log(error);
        // { code: 4001, message: "User rejected the request."}
      }

};

  // 创建转账交易 (与之前一样)
async function createTransferTransaction(walletAddress, amountInLamports) {
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(walletAddress),   // 用户的 Solana 地址
        toPubkey: icoWalletAddress,                 // ICO 钱包地址
        lamports: amountInLamports,                 // 用户输入的转账金额（lamports）
      })
    );
  
    // 获取最新的区块哈希，确保交易是最新的
    transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
  
    return transaction;
  }


  // 交易签名和发送函数 (与之前一样)
async function signAndSendTransaction(walletAddress, amountInSol) {
    try {
      // 转换为 lamports
      const amountInLamports = amountInSol * 1000000000; // 1 SOL = 1,000,000,000 lamports
  
      // 创建转账交易
      const transaction = await createTransferTransaction(walletAddress, amountInLamports);
  
      // 向 OKX 钱包请求签名
      const signedTransaction = await window.okxWallet.signTransaction(transaction);
  
      // 广播交易
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
  
      // 等待确认
      await connection.confirmTransaction(signature);
      console.log('Transaction successful with signature: ', signature);
    } catch (error) {
      console.error('Transaction failed', error);
    }
  }




  async function getAccount() {


    // if (window.okxwallet) {
    //     console.log('OKX Wallet found.');
    //     if (window.okxwallet.solana) {
    //         console.log('Solana API found in OKX Wallet.');
    //     } else {
    //         console.log('Solana API is not available in OKX Wallet.');
    //     }
    // } else {
    //     console.log('OKX Wallet is not installed or enabled.');
    // }

    if (window.solana && window.solana.isPhantom) {
        console.log("Phantom Wallet is available");
    }


    try {
      const provider = window.okxwallet.solana;
      const resp = await provider.connect();
      const result = `${resp.publicKey.toString()}`;
      // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo
      // { address: string, publicKey: string }
    //   resultDom.innerHTML = result;
      console.log(result);
      const formatresult=formatAccount(result);
      console.log(formatresult);
      
      button.innerText = result;
     
    } catch (error) {
      console.log(error);
      // { code: 4001, message: "User rejected the request."}
    //   resultDom.innerHTML = error?.message || error;
    console.log(error);
    }

}

function formatAccount(account) {
    if (account.length <= 8) {
        return account; // 如果账号长度小于等于8，直接返回
    }
    const start = account.slice(0, 4); // 获取前四位
    const end = account.slice(-4); // 获取后四位
    return `${start}....${end}`; // 合并前四位和后四位，中间用省略号
}





