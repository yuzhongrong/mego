  // 通过 CDN 加载 Solana Web3.js，使用 global 对象 solanaWeb3
  const { Connection, PublicKey, Transaction, SystemProgram } = solanaWeb3;


// 获取 connect按钮
const connectbtn = document.getElementById("connectbtn");


 // 获取购买限额弹框
 var modal = document.getElementById("buyModal");
 var buyButton = document.getElementById("buyButton");
 var closeButton = document.getElementsByClassName("close")[0];
 var confirmButton = document.getElementById("confirmPurchase");

 //钱包连接状态
 var walletState='';

// Solana网络连接
const connection = new Connection('https://api.mainnet-beta.solana.com');

 // 检查 OKX 或 Solana 钱包是否已经安装
 const checkWallet = async () => {
    if (typeof window.okxwallet !== 'undefined') {
        console.log('OKX wallet extension is installed!');
    }else{
        console.log('OKX wallet extension is not installed!');
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




  async  function getAccount() {

    if (typeof window.okxwallet == 'undefined') {
        console.log('OKX wallet extension is not installed!');
        alert('OKX wallet extension is not installed!')
        return
     }

    try {
      const provider = window.okxwallet.solana;
      const resp = await provider.connect();
      const result = `${resp.publicKey.toString()}`;
      // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo
      // { address: string, publicKey: string }
    //   resultDom.innerHTML = result;
      console.log("result---> ",result);
      const formatresult=formatAccount(result);
      console.log("result-format--->",formatresult);

      connectbtn.innerText = formatresult;
      walletState=result;
     
    } catch (error) {
      console.log(error);
      // { code: 4001, message: "User rejected the request."}
    //   resultDom.innerHTML = error?.message || error;
    walletState='';
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

//点击购买token 弹框处理

 // 当点击购买按钮时，显示对话框
 buyButton.onclick = function() {
    console.log("connectbtn.innerText",walletState);
  
    if(walletState.length==44){
        modal.style.display = "block";
        modal.style.justifyContent="center"
        modal.style.alignItems="center"
        modal.style.display="flex"
    }else{
        alert('Please connect to Solana wallet first')
       
    }
   
    
}

// 当点击关闭按钮时，隐藏对话框
closeButton.onclick = function() {
    modal.style.display = "none";
}

 // 当点击确认按钮时，检查数量并提交
 confirmButton.onclick = function() {

    //判断当前链接按钮内容
    console.log("--connectbtn.innerText-->",connectbtn.innerText)
    
    // const walletAddress = await isOKXWalletConnected();
    // if (!walletAddress) {
    //     alert("Please connect OKX wallet first!");
    //     return;
    // }



    var solAmount = document.getElementById("solAmount").value;
    if (solAmount >= 1 && solAmount <= 10) {
        // alert("you choose to buy " + solAmount + " SOL");
        // 这里你可以添加购买逻辑，如发出请求
        modal.style.display = "none"; // 关闭对话框

        //创建一个交易 签名并发送 
        // alert('please create a transation to send')

    } else {
        alert("Purchase quantity must be between 1 and 10 SOL!");
    }
}



// 检查 OKX 钱包是否已连接
async function isOKXWalletConnected() {
    if (window.okxwallet) {
        try {
            const resp = await window.okxwallet.request({
                method: 'solana_accounts' // 使用 OKX 插件的 Solana API
            });
            return resp && resp[0] ? resp[0] : null; // 返回钱包地址
        } catch (err) {
            console.error("Unable to get OKX wallet address", err);
            return null;
        }
    } else {
        alert("Please install the OKX wallet plug-in!");
        return null;
    }
}





