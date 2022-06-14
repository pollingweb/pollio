import React, { useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Candidate from '../../../components/Candidate';
import Voter from '../../../components/Voter';
import PollContract from '../../../smart-contract/contracts/artifacts/Poll.json';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import { handleMetamaskTransaction } from '../../../utils/eth';
import axios from 'axios';

function Poll_detail({ web3, contract, walletAddress }) {
	const { pollId } = useParams();
	const [polldetails, setpolldetails] = useState({});

	const [result, setResult] = useState({});

	// const getPollName = async (address) => {
	// 	const contract = new web3.eth.Contract(PollContract.abi, address);
	// 	try {
	// 		const pollName = await contract.methods.pollName().call({ from: walletAddress });
	// 		setpolldetails((pre) => ({ ...pre, pollName: pollName }));
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// };

	// const getPollType = async (address) => {
	// 	const contract = new web3.eth.Contract(PollContract.abi, address);
	// 	try {
	// 		const pollType = await contract.methods.getPollType().call({ from: walletAddress });
	// 		setpolldetails((pre) => ({ ...pre, pollType: pollType }));
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// };

	// const getEndBlock = async (address) => {
	// 	const contract = new web3.eth.Contract(PollContract.abi, address);
	// 	try {
	// 		const endBlock = await contract.methods.endBlock().call({ from: walletAddress });
	// 		setpolldetails((pre) => ({ ...pre, endBlock: endBlock }));
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// };

	// const getStartBlock = async (address) => {
	// 	const contract = new web3.eth.Contract(PollContract.abi, address);
	// 	try {
	// 		const startBlock = await contract.methods.startBlock().call({ from: walletAddress });
	// 		setpolldetails((pre) => ({ ...pre, startBlock: startBlock }));
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// };

	const getResultOf = async (to, candidateID) => {
		const contract = new web3.eth.Contract(PollContract.abi, to);
		try {
			const resultOf = await contract.methods
				.getResultOf(candidateID)
				.call({ from: walletAddress });

			if (resultOf) {
				setResult((pre) => ({ ...pre, [candidateID]: resultOf }));
			}
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		async function getPollDetails() {
			const pollDetails = await axios.get(
				`${process.env.REACT_APP_API_BASEURL}/api/poll/${pollId}`
			);

			if (pollDetails.status === 200) {
				setpolldetails(pollDetails.data);

				pollDetails.data.candidates.map(({ id }) => {
					getResultOf(pollId, id);
					return true;
				});
			}
		}

		getPollDetails();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// const renamePoll = async (to, newName) => {
	// 	const contract = new web3.eth.Contract(PollContract.abi, to);

	// 	try {
	// 		const tx = contract.methods.renamePoll(newName);
	// 		const gas = await tx.estimateGas({ from: walletAddress });
	// 		const gasPrice = await web3.eth.getGasPrice();
	// 		const data = tx.encodeABI();
	// 		const nonce = await web3.eth.getTransactionCount(walletAddress);

	// 		const transactionID = await handleMetamaskTransaction({
	// 			web3,
	// 			walletAddress,
	// 			nonce,
	// 			to,
	// 			gasPrice,
	// 			gas,
	// 			data,
	// 		});

	// 		console.log(transactionID);
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// };

	// const increasePollDuration = async (to, extendedBlocks) => {
	// 	const contract = new web3.eth.Contract(PollContract.abi, to);

	// 	try {
	// 		const tx = contract.methods.increasePollDuration(extendedBlocks);
	// 		const gas = await tx.estimateGas({ from: walletAddress });
	// 		const gasPrice = await web3.eth.getGasPrice();
	// 		const data = tx.encodeABI();
	// 		const nonce = await web3.eth.getTransactionCount(walletAddress);

	// 		const transactionID = await handleMetamaskTransaction({
	// 			web3,
	// 			walletAddress,
	// 			nonce,
	// 			to,
	// 			gasPrice,
	// 			gas,
	// 			data,
	// 		});

	// 		console.log(transactionID);
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// };

	// const cancelPoll = async (to) => {
	// 	const contract = new web3.eth.Contract(PollContract.abi, to);

	// 	try {
	// 		const tx = contract.methods.cancelPoll();
	// 		const gas = await tx.estimateGas({ from: walletAddress });
	// 		const gasPrice = await web3.eth.getGasPrice();
	// 		const data = tx.encodeABI();
	// 		const nonce = await web3.eth.getTransactionCount(walletAddress);

	// 		const transactionID = await handleMetamaskTransaction({
	// 			web3,
	// 			walletAddress,
	// 			nonce,
	// 			to,
	// 			gasPrice,
	// 			gas,
	// 			data,
	// 		});

	// 		console.log(transactionID);
	// 	} catch (err) {
	// 		console.error(err);
	// 	}
	// };

	const endPoll = async (to) => {
		const contract = new web3.eth.Contract(PollContract.abi, to);

		try {
			const tx = contract.methods.endPoll();
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
				const res = await axios.put(
					`${process.env.REACT_APP_API_BASEURL}/api/poll/${pollId}`,
					{
						status: 'Ended',
					}
				);

				if (res.status === 200) {
					alert(res.data.message);
					setpolldetails((pre) => ({ ...pre, status: 'Ended' }));
				} else {
					window.location.reload();
				}
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div>
			<div className='section-header-primary flex items-center justify-between'>
				<div>
					<Typography variant='h4' fontSize='28px'>
						Polling Detail
					</Typography>
				</div>
			</div>
			<div className='p-8'>
				<div className='flex w-100'>
					<Typography variant='h6' className='flex-1'>
						Poll Name
					</Typography>
					<Typography variant='h6' className='flex-1'>
						{polldetails.name}
					</Typography>
				</div>
				<div className='flex w-100'>
					<Typography variant='h6' className='flex-1'>
						Poll Agenda
					</Typography>
					<Typography variant='h6' className='flex-1'>
						Polling 1
					</Typography>
				</div>
				<div className='flex w-100'>
					<Typography variant='h6' className='flex-1'>
						Poll Type
					</Typography>
					<Typography variant='h6' className='flex-1'>
						{polldetails.pollType}
					</Typography>
				</div>
				<div className='flex w-100'>
					<Typography variant='h6' className='flex-1'>
						Poll Start Time
					</Typography>
					<Typography variant='h6' className='flex-1'>
						{polldetails.startDate}
					</Typography>
				</div>
				<div className='flex w-100'>
					<Typography variant='h6' className='flex-1'>
						Poll End Time
					</Typography>
					<Typography variant='h6' className='flex-1'>
						{polldetails.endDate}
					</Typography>
				</div>
			</div>

			{polldetails?.status === 'Running' && (
				<div className='text-center mb-4'>
					<Button
						variant='contained'
						color='primary'
						className='bg-red-500'
						onClick={() => endPoll(polldetails.id)}
					>
						End Poll
					</Button>
				</div>
			)}

			<div className='section-header-primary  flex items-center justify-between'>
				<div>
					<Typography variant='h4' fontSize='28px'>
						Polling - Candidate List
					</Typography>
				</div>
				{/* <div className='flex'>
					<FiEdit className='h-6 w-6 mr-3' />
					<AiOutlinePlusCircle className='h-6 w-6' />
				</div> */}
			</div>
			<div>
				{polldetails.candidates?.map((data) => (
					<Candidate
						user='organizer'
						editMode={false}
						data={data}
						key={data.id}
						vote={result[data.id]}
					/>
				))}
			</div>
			<div className='section-header-primary  flex items-center justify-between'>
				<div>
					<Typography variant='h4' fontSize='28px'>
						Pollling -Voter's List
					</Typography>
				</div>
			</div>

			{polldetails.voters?.map((data) => (
				<Voter editMode={false} data={data} key={data.id} />
			))}
		</div>
	);
}

const mapStateToProps = ({ auth }) => {
	return {
		contract: auth.contract,
		walletAddress: auth.walletAddress,
		web3: auth.web3,
	};
};

export default connect(mapStateToProps)(Poll_detail);
