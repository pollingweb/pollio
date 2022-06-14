import React, { useState, useEffect } from 'react';
import Poll from '../../../components/Poll';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { RiArrowLeftSLine } from 'react-icons/ri';
import { AiOutlinePlusCircle } from 'react-icons/ai';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import axios from 'axios';

function Poll_list({ contract, walletAddress }) {
	const [pollList, setPollList] = useState([]);
	const [pollListDetails, setpollListDetails] = useState({});

	useEffect(() => {
		const getPreviousPolls = async () => {
			try {
				const previousPolls = await contract.methods
					.getPreviousPolls()
					.call({ from: walletAddress });

				setPollList(previousPolls);

				previousPolls.map(async (item) => {
					const pollDetails = await axios.get(
						`${process.env.REACT_APP_API_BASEURL}/api/poll/${item}`
					);

					if (pollDetails?.data) {
						setpollListDetails((prev) => ({ ...prev, [item]: pollDetails.data }));
					}
				});
			} catch (err) {
				console.error(err);
			}
		};

		getPreviousPolls();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className='section-header-primary flex justify-between items-center mb-1'>
				<div className='flex items-center'>
					<IconButton className='p-0 mr-4'>
						<RiArrowLeftSLine color='white' fontSize='2rem' />
					</IconButton>
					<Typography variant='h4' fontSize='28px' className='translate-y-[4px]'>
						Polling List
					</Typography>
				</div>
				<Link to='create'>
					<button className='flex justify-between items-center mr-4'>
						<AiOutlinePlusCircle className='h-8 w-8 mr-2'></AiOutlinePlusCircle>
						<span>Create New Poll</span>
					</button>
				</Link>
			</div>
			{pollList.map((e) =>
				pollListDetails[e] ? <Poll data={e} details={pollListDetails[e] || {}} /> : <></>
			)}
		</>
	);
}

const mapStateToProps = ({ auth }) => {
	return {
		contract: auth.contract,
		walletAddress: auth.walletAddress,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Poll_list);
