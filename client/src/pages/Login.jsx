import { SignUpContainer } from '../components/styles/SignUpContainer.styled';
import styled from 'styled-components';
import pic from '../images/sign-up.svg';
import { BiEnvelope, BiIdCard } from 'react-icons/bi';
import InputFeild from '../components/styles/InputFeild.styled';
import { useState } from 'react';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

import { connect } from 'react-redux';
import { updateAuth } from '../store/features/auth';
import Loader from '../components/Loader';

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

const Login = ({ updateLogin }) => {
	const navigate = useNavigate();
	const [loading, setloading] = useState(false);
	const [state, setState] = useState({
		email: '',
		password: '',
		type: 'voter',
	});

	const handleSubmit = async () => {
		setloading(true);
		const res = await axios.post(
			`${process.env.REACT_APP_API_BASEURL}/api/${state.type}/login`,
			state
		);

		setloading(false);

		if (res.status === 200) {
			updateLogin('userType', state.type);
			navigate(
				state.type === 'voter'
					? `/dashboard/${state.type}`
					: `/dashboard/${state.type}/polls`,
				{ replace: true }
			);
		} else {
			console.log(res.data);
			alert(res?.data?.error);
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
	return (
		<>
			{loading && <Loader />}
			<SignUpContainer>
				<Main>
					<Left>
						<h1>POLL.IO</h1>
						<h2>Voting made easy</h2>
						<img src={pic} alt='img-logo' />
					</Left>
					<Right>
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
							type='password'
							name='password'
							placeholder='Enter Password'
							value={state.password}
							onChange={handleChange}
						/>
						<div className='m-auto w-[60%]'>
							<FormControl>
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
							<Link to='/sign-up' className='text-center'>
								Sign up now
							</Link>
						</div>
					</Right>
				</Main>
			</SignUpContainer>
		</>
	);
};

const mapStateToProps = ({ auth }) => {
	return {
		walletAddress: auth.walletAddress,
	};
};

const mapDispatchToProps = (dispatch) => {
	return {
		updateLogin: (key, value) => dispatch(updateAuth({ key, value })),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
