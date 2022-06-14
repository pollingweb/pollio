import React from 'react';
import Web3 from 'web3';
import PollIOContract from "../smart-contract/contracts/artifacts/PollIO.json";
import PollContract from "../smart-contract/contracts/artifacts/Poll.json";

const web3 = new Web3("https://rinkeby.infura.io/v3/2c6b7e477a774f919361c4f491d4ffcd");

function MetaBtn() {
  //const connectMetamask = async () => {
  //   if (window.ethereum) {
  //     try {
  //       const response = await window.ethereum.request({method: "eth_requestAccounts"});
  //       // this.setState({address: response[0]});
  //     } catch (err) {
  //       console.log(err);
  //     }
  //     const contract = new web3.eth.Contract(PollIOContract.abi, "0xe07eB21048a121fA55B6d9ED9715164958d8Bd6D");
  //     // this.setState({contract});
  //   } else {  
  //     window.alert("Install Metamask");
  //   }
  // }

  return (
    <div>
      <img src="../assets/metaMask.png" alt="" /> Connect Metamask
    </div>
  )
}

export default MetaBtn;
