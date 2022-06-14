import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

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
									Email
								</Typography>
								<Typography variant='h6' className='flex-1'>
									{data?.email}
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

function Voter({ editMode, data }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			{open && <CandidateModal open={open} setOpen={setOpen} data={data} />}

			<div className='flex my-4 ml-[24px]'>
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
					{editMode && (
						<Button variant='contained' color='primary' size='small'>
							Delete
						</Button>
					)}
				</div>
			</div>
		</>
	);
}

export default Voter;
