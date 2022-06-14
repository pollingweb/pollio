import React, { useEffect } from 'react';

import Web3 from 'web3';
import PollIOContract from '../smart-contract/contracts/artifacts/PollIO.json';

import { Outlet } from 'react-router-dom';

import { connect } from 'react-redux';
import { setAuth, updateAuth } from '../store/features/auth';

const web3 = new Web3('https://rinkeby.infura.io/v3/2c6b7e477a774f919361c4f491d4ffcd');

function Layout({ loading, setLogin, updateLogin }) {
	useEffect(() => {
		async function getUserDetails() {
			if (window.ethereum) {
				try {
					const response = await window.ethereum.request({
						method: 'eth_requestAccounts',
					});
					setLogin({ walletAddress: response[0], login: true, loading: false, web3 });
				} catch (err) {
					console.log(err);
				}
				const contract = new web3.eth.Contract(
					PollIOContract.abi,
					'0xe07eB21048a121fA55B6d9ED9715164958d8Bd6D'
				);
				updateLogin('contract', contract);
				return;
			} else {
				window.alert('Install Metamask');
			}
			setLogin({ login: false, loading: false });
		}

		getUserDetails();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (loading) {
		return <>Loading...</>;
	}

	return <Outlet />;
}

const mapStateToProps = ({ auth }) => {
	return { loading: auth.loading };
};

const mapDispatchToProps = (dispatch) => {
	return {
		setLogin: (payload) => dispatch(setAuth(payload)),
		updateLogin: (key, value) => dispatch(updateAuth({ key, value })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
