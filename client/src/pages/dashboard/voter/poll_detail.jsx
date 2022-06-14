import React from 'react';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { RiArrowLeftSLine } from 'react-icons/ri';
import CandidateModal from '../../../components/CandidateModal';

function poll_detail() {
	return (
		<div>
			<div className='section-header-primary flex'>
				<IconButton className='p-0 mr-4'>
					<RiArrowLeftSLine color='white' fontSize='2rem' />
				</IconButton>
				<Typography variant='h4' fontSize='32px' className='translate-y-[4px]'>
					Candidate - Detail
				</Typography>
			</div>
			<CandidateModal />
		</div>
	);
}

export default poll_detail;
