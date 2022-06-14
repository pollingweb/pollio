import React from 'react';

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { RiArrowLeftSLine } from 'react-icons/ri';

export default function CandidateDetails() {
	return (
		<div>
			<div className='section-header-primary flex'>
				<IconButton className='p-0 mr-4'>
					<RiArrowLeftSLine color='white' fontSize='2rem' />
				</IconButton>
				<Typography variant='h4' fontSize='28px' className='translate-y-[4px]'>
					Candidate - Detail
				</Typography>
			</div>
			<div className='flex justify-center items-center flex-col'>
				<img
					src='/assets/images/user1.png'
					alt='user'
					className='w-100 max-w-[200px] py-[50px]'
				/>
				<div className='p-8 w-8/12'>
					<div className='flex w-100'>
						<Typography variant='h6' className='flex-[3]'>
							Candidate Name
						</Typography>
						<Typography variant='h6' className='flex-[2]'>
							Polling 1
						</Typography>
					</div>
					<div className='flex w-100'>
						<Typography variant='h6' className='flex-[3]'>
							Candidate Description
						</Typography>
						<Typography variant='h6' className='flex-[2]'>
							Polling 1
						</Typography>
					</div>
					<div className='flex w-100'>
						<Typography variant='h6' className='flex-[3]'>
							Candidate Location
						</Typography>
						<Typography variant='h6' className='flex-[2]'>
							Konnagar
						</Typography>
					</div>
				</div>
			</div>
		</div>
	);
}
