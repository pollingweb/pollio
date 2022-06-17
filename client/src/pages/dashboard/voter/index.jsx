import React, { useState, useEffect } from 'react';

import { useParams } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import { connect } from 'react-redux';
import PollContract from '../../../smart-contract/contracts/artifacts/Poll.json';
import { handleMetamaskTransaction } from '../../../utils/eth';
import axios from 'axios';

function CandidateModal({ open, setOpen, data }) {
	const handleClose = () => {
		setOpen(false);
	};

	return (
		<div>
			<Modal
				open={open}
				onClose={handleClose}
				className=''
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<div className='w-full h-full justify-center items-center flex'>
					<div className='flex justify-center items-center flex-col bg-white w-[50%] pb-4'>
						<div className='p-8 w-full'>
							<div className='flex w-100'>
								<Typography variant='h6' className='flex-1'>
									Name
								</Typography>
								<Typography variant='h6' className='flex-1'>
									{data?.name}
								</Typography>
							</div>
							<div className='flex w-100'>
								<Typography variant='h6' className='flex-1'>
									Description
								</Typography>
								<Typography variant='h6' className='flex-1'>
									{data?.description}
								</Typography>
							</div>
						</div>

						<button onClick={handleClose}>Cancel</button>
					</div>
				</div>
			</Modal>
		</div>
	);
}

function Candidate({ data, canVote, voteFor, polldetails }) {
	const [open, setOpen] = useState(false);

	return (
		<div className='flex my-4 ml-[24px]' key={data.id}>
			{open && <CandidateModal open={open} setOpen={setOpen} data={data} />}

			<div className='flex-1'>
				<div className='list-icon-primary inline-flex'>
					{data?.name &&
						data.name
							.split(' ')
							.map((e) => String(e[0]).toUpperCase())
							.join('')}
				</div>
				<Typography variant='h6' className='inline align-middle ml-4'>
					{data?.name}
				</Typography>
			</div>
			<div className='flex-1 flex items-center space-x-4'>
				<Button
					variant='contained'
					color='primary'
					size='small'
					onClick={() => setOpen(true)}
				>
					See Full Profile
				</Button>
				{/* {candidateDetails.verified && (
				)} */}

				{canVote && (
					<Button
						variant='contained'
						color='primary'
						size='small'
						onClick={() => voteFor(polldetails.id, data.id)}
					>
						Click to Vote
					</Button>
				)}
			</div>
		</div>
	);
}

function Home({ web3, walletAddress, contract }) {
	const [polldetails, setpolldetails] = useState({});
	// const [candidateDetails, setcandidateDetails] = useState({});
	const [canVote, setCanVote] = useState(true);
	let { pollId } = useParams();

	// const getPollName = async (address) => {
	// 	const contract = new web3.eth.Contract(PollContract.abi, address);
	// 	try {
	// 		const pollName = await contract.methods.pollName().call({ from: walletAddress });
	// 		console.log(pollName);
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// };

	// const getPollType = async (address) => {
	// 	const contract = new web3.eth.Contract(PollContract.abi, address);
	// 	try {
	// 		const pollType = await contract.methods.getPollType().call({ from: walletAddress });
	// 		console.log(pollType);
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// };

	// const getEndBlock = async (address) => {
	// 	const contract = new web3.eth.Contract(PollContract.abi, address);
	// 	try {
	// 		const endBlock = await contract.methods.endBlock().call({ from: walletAddress });
	// 		console.log(endBlock);
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// };

	// const getStartBlock = async (address) => {
	// 	const contract = new web3.eth.Contract(PollContract.abi, address);
	// 	try {
	// 		const startBlock = await contract.methods.startBlock().call({ from: walletAddress });
	// 		console.log(startBlock);
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// };

	useEffect(() => {
		async function getPollDetails() {
			// const candidate = await axios.get(
			// 	`${
			// 		process.env.REACT_APP_API_URL || 'http://localhost:4000'
			// 	}/api/voter/${walletAddress}`
			// );

			// if (candidate.status === 200) {
			// 	setcandidateDetails(candidate.data);
			// }

			const pollDetails = await axios.get(
				`${process.env.REACT_APP_API_BASEURL || 'http://localhost:4000'}/api/poll/${pollId}`
			);

			if (pollDetails.status === 200) {
				setpolldetails(pollDetails.data);
			}

			const verifyVote = await axios.get(
				`${
					process.env.REACT_APP_API_BASEURL || 'http://localhost:4000'
				}/api/poll/${pollId}/voter/${walletAddress}/verify`
			);

			if (verifyVote.status === 200) {
				setCanVote(!verifyVote.data.isVoted);
			}
		}

		getPollDetails();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const voteFor = async (to, candidateID) => {
		const contract = new web3.eth.Contract(PollContract.abi, to);

		try {
			const tx = contract.methods.voteFor(candidateID);
			const gas = await tx.estimateGas({ from: walletAddress });
			const gasPrice = await web3.eth.getGasPrice();
			const data = tx.encodeABI();
			const nonce = await web3.eth.getTransactionCount(walletAddress);

			const transactionID = await handleMetamaskTransaction({
				web3,
				walletAddress,
				nonce,
				to,
				gasPrice,
				gas,
				data,
			});

			if (transactionID) {
				const updateVoteStatus = await axios.put(
					`${
						process.env.REACT_APP_API_URL || 'http://localhost:4000'
					}/api/voter/${walletAddress}/poll/${to}`
				);

				if (updateVoteStatus.status === 200) {
					setCanVote(false);
				}
			}
		} catch (err) {
			alert(String(err.message).replace('Returned error: ', ''));
		}
	};

	return (
		<div>
			<div className='section-header-primary'>
				<Typography variant='h4' fontSize='28px'>
					Digital Ballot For Polling
				</Typography>
			</div>
			<div className='p-8'>
				<div className='flex w-100'>
					<Typography variant='h6' className='flex-1'>
						Poll Name
					</Typography>
					<Typography variant='h6' className='flex-1'>
						{polldetails?.name}
					</Typography>
				</div>
				<div className='flex w-100'>
					<Typography variant='h6' className='flex-1'>
						Poll Type
					</Typography>
					<Typography variant='h6' className='flex-1'>
						{polldetails?.pollType}
					</Typography>
				</div>
				<div className='flex w-100'>
					<Typography variant='h6' className='flex-1'>
						Poll Start Time
					</Typography>
					<Typography variant='h6' className='flex-1'>
						{polldetails?.startDate}
					</Typography>
				</div>
				<div className='flex w-100'>
					<Typography variant='h6' className='flex-1'>
						Poll End Time
					</Typography>
					<Typography variant='h6' className='flex-1'>
						{polldetails?.endDate}
					</Typography>
				</div>
			</div>
			<div className='text-center mb-4'>
				{/* {!candidateDetails.verified && (
					<Button variant='contained' color='primary'>
						Apply
					</Button>
				)} */}
			</div>

			<div className='section-header-primary'>
				<Typography variant='h4' fontSize='28px'>
					Polling - Candidate List
				</Typography>
			</div>
			<div>
				{polldetails?.candidates?.map((data) => (
					<Candidate
						data={data}
						key={data.id}
						voteFor={voteFor}
						polldetails={polldetails}
						canVote={canVote}
					/>
				))}
			</div>
		</div>
	);
}

const mapStateToProps = ({ auth }) => {
	return {
		web3: auth.web3,
		walletAddress: auth.walletAddress,
		contract: auth.contract,
	};
};

// const mapDispatchToProps = (dispatch) => {
// 	return {};
// };

export default connect(mapStateToProps)(Home);
