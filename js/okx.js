  
 
  // 通过 CDN 加载 Solana Web3.js，使用 global 对象 solanaWeb3
  const { Connection, PublicKey, Transaction, SystemProgram } = solanaWeb3;


// 获取 connect按钮
const connectbtn = document.getElementById("connectbtn");


 // 获取购买限额弹框
 var modal = document.getElementById("buyModal");
 var buyButton = document.getElementById("buyButton");
 var buyMoreButton = document.getElementById("buyMoreButton");
 
 var closeButton = document.getElementsByClassName("close")[0];
 var confirmButton = document.getElementById("confirmPurchase");




//初始化页面事件

window.onload = function() {
    const walletState=localStorage.getItem("walletState")
    const address=localStorage.getItem("accountAddress")
    if(walletState==1){
        const accountFormatAddress=formatAccount(address)
        if(accountFormatAddress){
            connectbtn.innerText=accountFormatAddress
        }
       
    }

    //默认情况不现实dialog
    modal.style.display = "none";
    modal.style.justifyContent="center"
    modal.style.alignItems="center"


}



 // 检查 OKX 或 Solana 钱包是否已经安装
 const checkWallet = async () => {
    if (typeof window.okxwallet !== 'undefined') {
        console.log('OKX wallet extension is installed!');
    }else{
        console.log('OKX wallet extension is not installed!');
    }
};










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
      localStorage.setItem("walletState",1)
      localStorage.setItem("accountAddress",result)
     
     
    } catch (error) {
      console.log(error);
      // { code: 4001, message: "User rejected the request."}
    //   resultDom.innerHTML = error?.message || error;
  
    }

}

//钱包断开连接
window.okxwallet.solana.on("disconnect", () => {
  console.log("disconnected!")
  localStorage.setItem("walletState",0)
  localStorage.setItem("accountAddress",'')
  connectbtn.innerText = 'Connect Wallet';

});



//钱包断开连接
window.okxwallet.solana.on("connect", () => {
  console.log("connected!")
  
});


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
  
    const walletState=localStorage.getItem("walletState")
    if(walletState==1){
        modal.style.display = "flex";
        modal.style.justifyContent="center"
        modal.style.alignItems="center"
      
       }else{
        modal.style.display = "none";
        modal.style.justifyContent="center"
        modal.style.alignItems="center"
    
        alert('Please connect to Solana wallet first')

        
        }

   
    
}

buyMoreButton.onclick = function() {
  
  const walletState=localStorage.getItem("walletState")
  if(walletState==1){
      modal.style.display = "flex";
      modal.style.justifyContent="center"
      modal.style.alignItems="center"
    
     }else{
      modal.style.display = "none";
      modal.style.justifyContent="center"
      modal.style.alignItems="center"
  
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
  
        // 这里你可以添加购买逻辑，如发出请求
        modal.style.display = "none"; // 关闭对话框

        //创建一个交易 签名并发送 
        // alert('please create a transation to send')
        const accountAddress=localStorage.getItem("accountAddress")
        if(accountAddress){
            sendTransaction(accountAddress,solAmount)

        }
       

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

async function sendTransaction(from,amount){

  try {
    const buffer = await import("https://cdn.skypack.dev/buffer@6.0.3");
    window.Buffer = buffer.Buffer;
    const { PublicKey, Connection, Transaction, SystemProgram } = solanaWeb3;
    const provider = window.okxwallet.solana;
    const network = "https://wallet.ouxyi.cash/fullnode/sol/discover/rpc";

    const connection = new Connection(network);
    const fromPubkey = new PublicKey(from);

    // 写死一个转入地址的公钥
    const toPubkey = new PublicKey(
      "v1Fs6G4smFUtX4X1kCj5Z5u8hg1ccoMf35e5GWQAEG2"
    );
    const amountInLamports = amount * 1000000000; // 1 SOL = 1,000,000,000 lamports
    // 构造交易
    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey,
        toPubkey,
        lamports: amountInLamports
      })
    );
    console.log("tx: ",tx);
   

    const { blockhash } = await connection.getRecentBlockhash("max");
    tx.recentBlockhash = blockhash;
    tx.feePayer = fromPubkey;



    const { signature } = await provider.signAndSendTransaction(tx);    
     await connection.getSignatureStatus(signature);
  

    console.log("signature: ",signature);
    showSendTxAlert(signature)
  } catch (error) {
    console.log(error);

  }


}


function showSendTxAlert(signature) {
  Swal.fire({
      title: 'Copy the text below',
      html: `<input type="text" value="${signature}" id="copyText" readonly style="width: 100%;">`,
      showCancelButton: true,
      confirmButtonText: 'Copy Text',
      cancelButtonText: 'Close',
      preConfirm: () => {
          var copyText = document.getElementById("copyText");
          copyText.select();
          document.execCommand("copy");
          Swal.fire('Copied!', 'Text has been copied to clipboard', 'success');
      }
  });
}




