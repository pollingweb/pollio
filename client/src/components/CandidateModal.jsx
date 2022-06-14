import React from 'react';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';

function CandidateModal() {
	const [open, setOpen] = React.useState(false);

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
				{/*create a modal for candidate*/}
				<div className='w-full h-full justify-center items-center'>
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
						<button>Confirm</button>
						<button onClick={handleClose}>Cancel</button>
					</div>
				</div>
			</Modal>
		</div>
	);
}

export default CandidateModal;
