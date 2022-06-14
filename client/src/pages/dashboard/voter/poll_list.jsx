import React, { useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';
import { IoIosArrowDropright } from 'react-icons/io';
import { Link } from 'react-router-dom';

import axios from 'axios';
import { connect } from 'react-redux';

function Poll_list({ walletAddress }) {
	const [list, setList] = useState();

	useEffect(() => {
		async function getList() {
			const res = await axios.get(
				`${process.env.REACT_APP_API_BASEURL}/api/voter/${walletAddress}`
			);

			if (res.status === 200) {
				setList(res.data);
			}
		}

		getList();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<div className='section-header-primary flex mb-1'>
				<Typography variant='h4' fontSize='28px' className='translate-y-[4px]'>
					Polling List
				</Typography>
			</div>

			{list?.polls?.map((poll) => (
				<div>
					<div className='flex justify-between px-6 border items-center py-[1px]'>
						<div className='flex'>
							<div className='list-icon-primary rounded-full[!important] inline-flex items-center my-2'>
								{poll?.name &&
									poll.name
										.split(' ')
										.map((e) => String(e[0]).toUpperCase())
										.join('')}
							</div>
							<Typography variant='h6' className='inline self-center ml-4'>
								{poll.name}
							</Typography>
						</div>
						<Typography variant='h6' className='ml-4'>
							{poll.pollType}
						</Typography>
						<Typography variant='h6' className='ml-4'>
							{poll.startDate}
						</Typography>
						<Typography variant='h6' className='ml-4'>
							{poll.endDate}
						</Typography>

						<div>
							<Link to={'/dashboard/voter/polls/' + poll.id}>
								<IoIosArrowDropright className='h-7 w-7'></IoIosArrowDropright>
							</Link>
						</div>
					</div>
				</div>
			))}
		</>
	);
}

const mapStateToProps = ({ auth }) => {
	return {
		walletAddress: auth.walletAddress,
	};
};

export default connect(mapStateToProps)(Poll_list);
