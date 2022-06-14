import React from 'react';
// import Loader from '../components/Loader';
// import PollModal from '../components/PollModal';
import Web3 from 'web3';
import PollIOContract from '../smart-contract/contracts/artifacts/PollIO.json';
import Modal from '@mui/material/Modal';

import { connect } from 'react-redux';
import { setAuth, updateAuth } from '../store/features/auth';
import { useNavigate } from 'react-router-dom';

const web3 = new Web3('https://rinkeby.infura.io/v3/2c6b7e477a774f919361c4f491d4ffcd');

function PreSignUp({ setLogin, updateLogin }) {
	const navigate = useNavigate();
	// const [loading, setLoading] = React.useState(true);
	// const [pollId, setPollId] = React.useState('');
	const [open, setOpen] = React.useState(false);

	// const handleOpen = () => {
	// 	setOpen(true);
	// };

	const handleClose = () => {
		setOpen(false);
	};

	const metaMaskConnect = async () => {
		if (window.ethereum) {
			try {
				const response = await window.ethereum.request({ method: 'eth_requestAccounts' });

				setLogin({ walletAddress: response[0], login: true, loading: false, web3 });
			} catch (err) {
				console.log(err);
			}
			const contract = new web3.eth.Contract(
				PollIOContract.abi,
				'0xe07eB21048a121fA55B6d9ED9715164958d8Bd6D'
			);
			updateLogin('contract', contract);
			navigate('/login', { replace: true });
		} else {
			window.alert('Install Metamask');
		}
	};

	return (
		<>
			<div className='w-full mt-20 flex flex-col justify-center items-center'>
				<h1 className='text-2xl mb-4'>Welcome to Poll.io</h1>
				<div
					className='flex items-center rounded-xl bg-[#1c4f46] w-64 py-1 px-3'
					onClick={() => metaMaskConnect()}
				>
					<img
						src='/assets/images/MetaMask.svg'
						className='h-10 w-16 rounded-full'
						alt=''
					/>
					<span className='text-white ml-3'> Connect Metamask</span>
				</div>
			</div>
			<Modal
				open={open}
				onClose={handleClose}
				className=''
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<div className='w-full h-full flex justify-center items-center'>
					<div className='mb-4'>
						<label
							className='block text-gray-700 text-sm font-bold mb-2'
							htmlFor='pollId'
						>
							Poll ID
						</label>
						{/* <input id='pollId' onChange={(e) => setPollId(e.target.value)} /> */}
						<input type='button' />
					</div>
				</div>
			</Modal>
		</>
	);
}

const mapStateToProps = () => {
	return {};
};

const mapDispatchToProps = (dispatch) => {
	return {
		setLogin: (payload) => dispatch(setAuth(payload)),
		updateLogin: (key, value) => dispatch(updateAuth({ key, value })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(PreSignUp);
