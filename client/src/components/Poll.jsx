import React from 'react';
import { IoIosArrowDropright } from 'react-icons/io';

import Typography from '@mui/material/Typography';

import { Link } from 'react-router-dom';

function Poll({ data, details }) {
	return (
		<div>
			<div className='flex justify-between px-6 border items-center py-[1px]'>
				<div className='flex'>
					<div className='list-icon-primary rounded-full[!important] inline-flex items-center my-2'>
						{details?.name &&
							details.name
								.split(' ')
								.map((e) => String(e[0]).toUpperCase())
								.join('')}
					</div>
					<Typography variant='h6' className='inline self-center ml-4'>
						{details?.name}
					</Typography>
				</div>
				<Typography variant='h6' className='ml-4'>
					{details?.pollType}
				</Typography>
				<Typography variant='h6' className='ml-4'>
					{details?.startDate}
				</Typography>
				<Typography variant='h6' className='ml-4'>
					{details?.endDate}
				</Typography>
				{/* 
				<button className='btn rounded-lg bg-[#1C4F46] text-white px-3 py-1'>
					<Typography variant='h6'>Status</Typography>
				</button> */}
				<div>
					<Link to={data}>
						<IoIosArrowDropright className='h-7 w-7'></IoIosArrowDropright>
					</Link>
				</div>
			</div>
		</div>
	);
}

export default Poll;
