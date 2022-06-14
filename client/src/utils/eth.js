export const handleMetamaskTransaction = async ({
	web3,
	walletAddress,
	nonce,
	to,
	gasPrice,
	gas,
	data,
}) => {
	try {
		const transactionID = await window.ethereum.request({
			method: 'eth_sendTransaction',
			params: [
				{
					nonce: web3.utils.toHex(nonce),
					from: walletAddress,
					to,
					gasPrice: web3.utils.toHex(gasPrice),
					gas: web3.utils.toHex(gas),
					data,
				},
			],
		});

		if (transactionID) {
			window.alert(
				`To view transaction status go to this link => " https://rinkeby.etherscan.io/tx/${transactionID} "`
			);
		} else {
			alert('Something went wrong. Please reload the page and try again.');
			window.location.reload();
		}
		return transactionID;
	} catch (err) {
		console.error(err);
	}
};
