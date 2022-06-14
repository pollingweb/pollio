import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Typography from '@mui/material/Typography';
// import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
// import { RiArrowLeftSLine } from "react-icons/ri";
import { TbEditOff } from 'react-icons/tb';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { FiEdit } from 'react-icons/fi';
import Candidate from '../../../components/Candidate';
import Voter from '../../../components/Voter';
import { RadioGroup } from '@mui/material';
import { connect } from 'react-redux';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

import Loader from '../../../components/Loader';
import { handleMetamaskTransaction } from '../../../utils/eth';

// import { type } from "@testing-library/user-event/dist/types/setup/directApi";
// import axios from "axios";

function NewPoll({ web3, walletAddress, contract }) {
	const navigate = useNavigate();
	const [poll, setPoll] = useState({
		pollId: '',
		name: '',
		description: '',
		startTime: '',
		endTime: '',
		type: 'Public',
		candidates: [],
		voters: [],
	});
	const [loading, setloading] = useState(false);

	const [openCandidateForm, setOpenCandidateForm] = useState(false);

	const handleOpenCandidateForm = () => {
		setOpenCandidateForm(true);
		console.log('OpenCandidateForm');
	};

	const handleCloseCandidateForm = () => setOpenCandidateForm(false);

	const [openVoterForm, setOpenVoterForm] = useState(false);

	const [pollList, setPollList] = useState([]);

	const handleCloseVoterForm = () => setOpenVoterForm(false);

	const [candidateEdit, setCandidateEdit] = useState(false);

	const [voterEdit, setVoterEdit] = useState(false);

	const [newCandidate, setNewCandidate] = useState({
		pollId: '',
		name: '',
		description: '',
		img_url: '',
		candidate_id: '',
		img: null,
	});

	const [newVoter, setNewVoter] = useState({
		pollId: '',
		name: '',
		email: '',
		voter_id: '',
		img_url: '',
	});

	const [candidateList, setCandidateList] = useState([]);
	const [voterList, setVoterList] = useState([]);

	useEffect(() => {
		const getPreviousPolls = async () => {
			try {
				const previousPolls = await contract.methods
					.getPreviousPolls()
					.call({ from: walletAddress });

				setPollList(previousPolls);
				console.log(previousPolls);
			} catch (err) {
				console.error(err);
			}
		};

		getPreviousPolls();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleOpenVoterForm = () => {
		setOpenVoterForm(true);
		console.log('OpenVoterForm');
	};

	const addCandidate = async () => {
		setCandidateList([...candidateList, newCandidate]);
		setOpenCandidateForm(false);
		setNewCandidate({
			pollId: '',
			name: '',
			description: '',
			img_url: '',
			candidate_id: '',
			img: null,
		});
	};

	// const removeCandidate = (candidate_id) => {
	// 	setCandidateList(
	// 		candidateList.filter((candidate) => candidate.candidate_id !== candidate_id)
	// 	);
	// };

	const addVoter = () => {
		let form = new FormData();
		setVoterList([...voterList, newVoter]);
		setOpenVoterForm(false);
	};
	// const removeVoter = (voter_id) => {
	// 	setVoterList(voterList.filter((voter) => voter.voter_id !== voter_id));
	// };
	// const addToBlockchain = async () => {
	// 	let form = new FormData();
	// 	form.append('pollName', poll.name);
	// 	form.append('blockNumber', '0');
	// 	form.append(
	// 		'candidateIds',
	// 		JSON.stringify(candidateList.map((candidate) => candidate.candidate_id))
	// 	);
	// 	form.append('pollType', poll.type);
	// 	let response = await fetch('http://localhost:5000/api/poll/addToBlockchain', {
	// 		method: 'POST',
	// 		body: form,
	// 	});
	// 	let data = await response.json();
	// 	//add pollId to all candidates and voters
	// 	setCandidateList(
	// 		candidateList.map((candidate) => {
	// 			candidate.pollId = data.pollId;
	// 			return candidate;
	// 		})
	// 	);
	// 	setVoterList(
	// 		voterList.map((voter) => {
	// 			voter.pollId = data.pollId;
	// 			return voter;
	// 		})
	// 	);
	// };
	// const saveToDatabase = async () => {
	// 	let form = new FormData();
	// };

	const updatePollToDb = async (pollId) => {
		try {
			const res = await axios.post(process.env.REACT_APP_API_BASEURL + '/api/poll', {
				id: pollId,
				name: poll.name,
				description: poll.description,
				status: 'Running',
				startDate: poll.startTime,
				endDate: poll.endTime,
				pollType: poll.type,
				organizerId: walletAddress,
			});

			if (res.status !== 200) return;

			for (let i = 0; i < candidateList.length; i++) {
				await axios.post(process.env.REACT_APP_API_BASEURL + '/api/candidate', {
					id: uuidv4(),
					name: candidateList[i].name,
					pollId: pollId,
					imageUrl: 'www.google.com',
					voteCount: 0,
					description: candidateList[i].description,
				});
			}

			for (let i = 0; i < voterList.length; i++) {
				await axios.post(process.env.REACT_APP_API_BASEURL + '/api/Voter', {
					id: newVoter[i].voter_id,
					name: newVoter[i].name,
					verfied: false,
					photoUrl: '',
					email: newVoter[i].email,
					PollId: pollId,
				});
			}
			navigate(-1, { replace: true });
		} catch (error) {}

		setloading(false);
	};

	const createPoll = async () => {
		setloading(true);

		const endTime = new Date(poll.endTime).getTime() / 1000;
		const startTime = Date.now() / 1000;
		const blockNumber = Math.ceil((endTime - startTime) / 17);
		const candidateIds = candidateList.map((e) => e.pollId);

		try {
			const tx = contract.methods.createPoll(poll.name, blockNumber, candidateIds, poll.type);
			const gas = await tx.estimateGas({ from: walletAddress });
			const gasPrice = await web3.eth.getGasPrice();
			const data = tx.encodeABI();
			const nonce = await web3.eth.getTransactionCount(walletAddress);
			const transactionID = await handleMetamaskTransaction({
				web3,
				walletAddress,
				nonce,
				to: '0xe07eB21048a121fA55B6d9ED9715164958d8Bd6D',
				gasPrice,
				gas,
				data,
			});

			if (transactionID) {
				const timer = setInterval(async () => {
					try {
						const previousPolls = await contract.methods
							.getPreviousPolls()
							.call({ from: walletAddress });

						if (previousPolls.length === pollList.length + 1) {
							updatePollToDb(previousPolls[previousPolls.length - 1]);
							clearInterval(timer);
						}
					} catch (err) {
						console.error(err);
					}
				}, 2000);
			}

			console.log(transactionID);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div>
			{loading && <Loader />}
			<Modal
				open={openCandidateForm}
				onClose={handleCloseCandidateForm}
				className=''
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<div className='w-full h-full flex justify-center items-center'>
					<form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
						<div className='mb-4'>
							<label
								className='block text-gray-700 text-sm font-bold mb-2'
								htmlFor='username'
							>
								Candidate Name
							</label>
							<input
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
								id='username'
								type='text'
								placeholder='Candidate Name'
								value={newCandidate.name}
								onChange={(e) =>
									setNewCandidate((pre) => ({ ...pre, name: e.target.value }))
								}
							/>
						</div>
						<div className='mb-4'>
							<label
								className='block text-gray-700 text-sm font-bold mb-2'
								htmlFor='username'
							>
								Candidate Description
							</label>
							<input
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
								id='username'
								type='text'
								placeholder='Candidate Description'
								value={newCandidate.description}
								onChange={(e) =>
									setNewCandidate((pre) => ({
										...pre,
										description: e.target.value,
									}))
								}
							/>
						</div>
						<div className='mb-4'>
							<label
								className='block text-gray-700 text-sm font-bold mb-2'
								htmlFor='username'
							>
								Poll Id
							</label>
							<input
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
								id='username'
								type='text'
								placeholder='Poll Id'
								value={newCandidate.pollId}
								onChange={(e) =>
									setNewCandidate((pre) => ({ ...pre, pollId: e.target.value }))
								}
							/>
						</div>
						<div className='mb-6'>
							<label
								className='block text-gray-700 text-sm font-bold mb-2'
								htmlFor='password'
							>
								Image
							</label>
							<input
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
								id='candidateImg'
								type='file'
							/>
						</div>
						<div className='flex items-center'>
							<button
								className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
								type='button'
								onClick={() => addCandidate()}
							>
								Save
							</button>
							<button
								className='ml-3 bg-red-500 p-2 rounded text-white'
								onClick={handleCloseCandidateForm}
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</Modal>

			{/* Voter Form */}
			<Modal
				open={openVoterForm}
				onClose={handleCloseVoterForm}
				className=''
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<div className='w-full h-full flex justify-center items-center'>
					<form className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
						<div className='mb-4'>
							<label
								className='block text-gray-700 text-sm font-bold mb-2'
								htmlFor='username'
							>
								Voter Name
							</label>
							<input
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
								id='username'
								type='text'
								placeholder='Voter Name'
								value={newVoter.name}
								onChange={(e) =>
									setNewVoter((pre) => ({ ...pre, name: e.target.value }))
								}
							/>
						</div>
						<div className='mb-4'>
							<label
								className='block text-gray-700 text-sm font-bold mb-2'
								htmlFor='username'
							>
								Voter Email
							</label>
							<input
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
								id='username'
								type='email'
								placeholder='Voter Email'
								value={newVoter.email}
								onChange={(e) =>
									setNewVoter((pre) => ({ ...pre, email: e.target.value }))
								}
							/>
						</div>
						<div className='mb-4'>
							<label
								className='block text-gray-700 text-sm font-bold mb-2'
								htmlFor='username'
							>
								Poll Id
							</label>
							<input
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
								id='username'
								type='text'
								placeholder='Poll Id'
								value={newVoter.pollId}
								onChange={(e) =>
									setNewVoter((pre) => ({ ...pre, pollId: e.target.value }))
								}
							/>
						</div>
						<div className='mb-6'>
							<label
								className='block text-gray-700 text-sm font-bold mb-2'
								htmlFor='voterImg'
							>
								Image
							</label>
							<input
								className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline'
								id='password'
								type='file'
							/>
						</div>
						<div className='flex items-center'>
							<button
								className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
								type='button'
								onClick={() => addVoter()}
							>
								Save
							</button>
							<button
								className='ml-3 bg-red-500 p-2 rounded text-white'
								onClick={handleCloseVoterForm}
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</Modal>
			<div className='section-header-primary flex items-center justify-between'>
				<div>
					<Typography variant='h4' fontSize='28px'>
						New Poll
					</Typography>
				</div>
			</div>
			<div className='p-8'>
				<div className='flex w-100 mb-2'>
					<Typography variant='h6' className='flex-1'>
						Poll Name
					</Typography>
					<Typography variant='h6' className='flex-1'>
						<input
							type='text'
							name='name'
							placeholder='Enter Name'
							className='bg-gray-100 py-2 px-4 focus:border-b-2 border-[#1C4F46] focus:outline-none'
							value={poll.name}
							onChange={(e) => setPoll((pre) => ({ ...pre, name: e.target.value }))}
						/>
					</Typography>
				</div>
				<div className='flex w-100 mb-2'>
					<Typography variant='h6' className='flex-1'>
						Poll Description
					</Typography>
					<Typography variant='h6' className='flex-1'>
						<textarea
							name='description'
							cols={23}
							className='bg-gray-100 py-2 px-4 focus:border-b-2 border-[#1C4F46] focus:outline-none'
							value={poll.description}
							onChange={(e) =>
								setPoll((pre) => ({ ...pre, description: e.target.value }))
							}
						/>
					</Typography>
				</div>
				<div className='flex w-100 mb-2'>
					<Typography variant='h6' className='flex-1'>
						Poll Start Time
					</Typography>
					<Typography variant='h6' className='flex-1'>
						<input
							type='datetime-local'
							name='startTime'
							id='startTime'
							value={poll.startTime}
							onChange={(e) =>
								setPoll((pre) => ({ ...pre, startTime: e.target.value }))
							}
						/>
					</Typography>
				</div>
				<div className='flex w-100 mb-2'>
					<Typography variant='h6' className='flex-1'>
						Poll End Time
					</Typography>
					<Typography variant='h6' className='flex-1'>
						<input
							type='datetime-local'
							name='endTime'
							id='endTime'
							value={poll.endTime}
							onChange={(e) =>
								setPoll((pre) => ({ ...pre, endTime: e.target.value }))
							}
						/>
					</Typography>
				</div>
				<div className='flex w-100 mb-2'>
					<Typography variant='h6' className='flex-1'>
						Type of Poll
					</Typography>
					<Typography variant='h6' className='flex-1'>
						<RadioGroup name='type' className='flex w-full flex-row'>
							<label htmlFor='Public' className='inline'>
								<input
									type='radio'
									name='type'
									id='Public'
									checked={poll.type === 'Public'}
									className='inline mr-2'
									onClick={(e) => setPoll((pre) => ({ ...pre, type: 'Public' }))}
								/>
								Public
							</label>
							<label htmlFor='Private' className='inline ml-5'>
								<input
									type='radio'
									name='type'
									checked={poll.type === 'Private'}
									id='Private'
									className='inline mr-2'
									onClick={(e) => setPoll((pre) => ({ ...pre, type: 'Private' }))}
								/>
								Private
							</label>
						</RadioGroup>
					</Typography>
				</div>
			</div>

			<div className='section-header-primary  flex items-center justify-between'>
				<div>
					<Typography variant='h4' fontSize='28px'>
						Polling 1 - Candidate List
					</Typography>
				</div>
				<div className='flex'>
					{!candidateEdit && (
						<FiEdit className='h-6 w-6 mr-3' onClick={() => setCandidateEdit(true)} />
					)}
					{candidateEdit && (
						<TbEditOff
							className='h-6 w-6 mr-3'
							onClick={() => setCandidateEdit(false)}
						/>
					)}
					<IconButton onClick={handleOpenCandidateForm}>
						<AiOutlinePlusCircle className='h-6 w-6' />
					</IconButton>
				</div>
			</div>
			<div>
				{candidateList.map((e) => (
					<Candidate user='organizer' editMode={candidateEdit} data={e} key={e.id} />
				))}
			</div>

			{poll.type === 'Private' && (
				<>
					<div className='section-header-primary  flex items-center justify-between'>
						<div>
							<Typography variant='h4' fontSize='28px'>
								Pollling 1-Voter's List
							</Typography>
						</div>
						<div className='flex'>
							{!voterEdit && (
								<FiEdit
									className='h-6 w-6 mr-3 cursor:pointer'
									onClick={() => setVoterEdit(true)}
								/>
							)}
							{voterEdit && (
								<TbEditOff
									className='h-6 w-6 mr-3 cursor:pointer'
									onClick={() => setVoterEdit(false)}
								/>
							)}
							<IconButton onClick={handleOpenVoterForm}>
								<AiOutlinePlusCircle className='h-6 w-6' />
							</IconButton>
						</div>
					</div>
					{voterList.map((e) => (
						<Voter editMode={voterEdit} data={e} ket={e.id} />
					))}
				</>
			)}

			<button
				className='mt-4 mr-4 float-right bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
				onClick={createPoll}
			>
				submit
			</button>
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

export default connect(mapStateToProps)(NewPoll);
