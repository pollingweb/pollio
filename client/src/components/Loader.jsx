import CircularProgress from '@mui/material/CircularProgress';
import Backdrop from '@mui/material/Backdrop';

const LoadingBoxComponent = ({ message = 'Loading', fixed }) => {
	const position = fixed ? 'fixed' : 'absolute';

	return (
		<Backdrop
			style={{
				position: position,
				top: 0,
				bottom: 0,
				left: 0,
				right: 0,
				zIndex: 1400,
				color: '#fff',
			}}
			open
		>
			<CircularProgress color='inherit' />
			<br />
			<br />
			<h1>&nbsp;&nbsp;{message}</h1>
		</Backdrop>
	);
};

export default LoadingBoxComponent;
