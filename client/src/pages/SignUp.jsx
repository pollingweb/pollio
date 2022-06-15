import { useState } from 'react';
import { SignUpContainer } from '../components/styles/SignUpContainer.styled';
import styled from 'styled-components';
import pic from '../images/sign-up.svg';
import { BiEnvelope, BiHash, BiIdCard, BiCamera } from 'react-icons/bi';
import InputFeild from '../components/styles/InputFeild.styled';
import Camera from '../components/Camera';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

// background-color : ${({ theme }) => theme.color.blur};
const Main = styled.div`
	width: 70vw;
	margin: auto;
	overflow: hidden;
	border-radius: 1rem;
	display: flex;
	background-color: #c4c4c440;

	@media (max-width: 768px) {
		flex-direction: column;
	}
`;

const Left = styled.div`
	background-color: #dae9e432;
	padding: 5%;
	display: flex;
	flex-direction: column;
	width: 35vw;
	h1 {
		color: white;
		display: inline-block;
	}
	h2 {
		color: #1c4f46;
		display: inline-block;
	}
	img {
		width: 100%;
	}

	@media (max-width: 768px) {
		width: 100%;
	}
`;

const Right = styled.div`
	padding: 10px;
	width: 35vw;
	padding: 5% 1%;

	@media (max-width: 768px) {
		width: 100%;
		padding: 0;
	}
`;

const Button = styled.button`
	width: 80%;
	height: 50px;
	border: 0;
	border-radius: 0.5rem;
	display: flex;
	margin: 10% auto;
	background-color: #dae9e4;
	color: #1c4f46;
	justify-content: center;
	align-items: center;
	cursor: pointer;
	font-size: x-large;
	font-weight: bold;
	border: 3px solid transparent;

	&:hover {
		background-color: #b9c9c4;
		outline: 3px solid #284e41;
	}

	@media (max-width: 768px) {
		width: 80%;
	}
`;

const SignUp = ({ walletAddress }) => {
	const navigate = useNavigate();
	const [camera, setCamera] = useState(false);
	const [state, setState] = useState({
		name: '',
		verfied: false,
		photoUrl: `${process.env.REACT_APP_API_BASEURL}/uploads/image/default.jpg`,
		password: '',
		email: '',
		type: 'voter',
		address: '',
		phone: '',
	});

	const showCamera = () => {
		setCamera(true);
	};

	const handleSubmit = async () => {
		const res = await axios.post(`${process.env.REACT_APP_API_BASEURL}/api/${state.type}`, {
			...state,
			id: walletAddress,
		});

		if (res.status === 200) {
			navigate('/login', { replace: true });
		}
	};

	const handleChange = (e) => {
		e.preventDefault();

		let name = e.target.name;
		let value = e.target.value;

		setState((previous) => ({
			...previous,
			[name]: value,
		}));
	};

	const handleChangeType = (event) => {
		setState((previous) => ({
			...previous,
			type: event.target.value,
		}));
	};

	const setPhotoUrl = (url) => {
		setState((previous) => ({
			...previous,
			photoUrl : url,
		}));
	}

	return (
		<>
			<SignUpContainer>
				<Main>
					<Left>
						<h1>POLL.IO</h1>
						<h2>Voting made easy</h2>
						<img src={pic} alt='img-logo' />
					</Left>
					<Right>
						<InputFeild
							Icon={BiHash}
							type='text'
							name='name'
							placeholder='Enter your name'
							value={state.name}
							onChange={handleChange}
						/>
						<InputFeild
							Icon={BiEnvelope}
							type='text'
							name='email'
							placeholder='Enter your email'
							value={state.email}
							onChange={handleChange}
						/>
						<InputFeild
							Icon={BiIdCard}
							type='text'
							name='password'
							placeholder='Enter Passwprd'
							value={state.password}
							onChange={handleChange}
						/>
						
						<InputFeild
							Icon={BiCamera}
							type='text'
							placeholder='Take a picture'
							cam={true}
							value={state.photoUrl}
							showCam={showCamera}
						/>
						

						{state.type === 'organizer' && (
							<>
								<InputFeild
									Icon={BiEnvelope}
									type='text'
									name='address'
									placeholder='Enter your address'
									value={state.address}
									onChange={handleChange}
								/>
								<InputFeild
									Icon={BiEnvelope}
									type='text'
									name='phone'
									placeholder='Enter your phone'
									value={state.phone}
									onChange={handleChange}
								/>
							</>
						)}
						<div className='m-auto w-[60%]'>
							<FormControl className='w-80'>
								<RadioGroup
									row
									aria-labelledby='demo-row-radio-buttons-group-label'
									name='row-radio-buttons-group'
									value={state.type}
									onChange={handleChangeType}
								>
									<FormControlLabel
										value='voter'
										control={<Radio />}
										label='Voter'
										className='text-white'
									/>
									<FormControlLabel
										value='organizer'
										control={<Radio />}
										label='Organizer'
										className='text-white'
									/>
								</RadioGroup>
							</FormControl>
						</div>

						<Button onClick={handleSubmit}>Verify Cedentials</Button>
						<div className='text-white text-center font-bold underline'>
							<Link to='/login' className='text-center'>
								Login now
							</Link>
						</div>
					</Right>
				</Main>

				{camera && <Camera hide={() => setCamera(false)} setUrl={setPhotoUrl} />}
			</SignUpContainer>
		</>
	);
};

const mapStateToProps = ({ auth }) => {
	return {
		walletAddress: auth.walletAddress,
	};
};

export default connect(mapStateToProps)(SignUp);
