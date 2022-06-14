import React, { memo } from 'react';

import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';

import { AiFillHome } from 'react-icons/ai';

function Sidebar({ mobileOpen, setMobileOpen }) {
	const handleDrawerToggle = () => {
		setMobileOpen((pre) => !pre);
	};

	return (
		<Box
			component='nav'
			sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
			aria-label='mailbox folders'
		>
			<Drawer
				variant='temporary'
				open={mobileOpen}
				onClose={handleDrawerToggle}
				ModalProps={{
					keepMounted: true,
				}}
				sx={{
					display: { xs: 'block', sm: 'none' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
				}}
				// classes={{ paper: classes.root }}
			>
				<img src='/assets/images/Logo.png' alt='logo' />
			</Drawer>
			<Drawer
				variant='permanent'
				sx={{
					display: { xs: 'none', sm: 'block' },
					'& .MuiDrawer-paper': {
						boxSizing: 'border-box',
						width: 240,
					},
				}}
				// classes={{ paper: classes.root }}
				open
			>
				<div style={{ padding: '24px', marginBottom: '16px' }}>
					<img src='/assets/images/Logo.png' alt='logo' style={{ width: '100%' }} />
				</div>
				<Divider />
				<div style={{ padding: '20px' }}>
					<Button
						variant='contained'
						color='primary'
						fullWidth
						startIcon={<AiFillHome />}
						style={{ marginBottom: '8px' }}
					>
						Digital Ballot
					</Button>
					{/* <Button
						variant='contained'
						color='secondary'
						fullWidth
						startIcon={<FaUserCircle />}
						endIcon={<RiArrowRightSLine />}
					>
						Profile
					</Button> */}
				</div>
				<Divider />
			</Drawer>
		</Box>
	);
}

export default memo(Sidebar);
