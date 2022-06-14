import React, { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

const Layouts = lazy(() => import(/* webpackChunkName: "SignUp" */ '../layouts'));
const LoginLayouts = lazy(() => import(/* webpackChunkName: "SignUp" */ '../layouts/loginLaylout'));

// user rotes
const SignUp = lazy(() => import(/* webpackChunkName: "SignUp" */ '../pages/SignUp'));
const Login = lazy(() => import(/* webpackChunkName: "SignUp" */ '../pages/Login'));
const VDashboardHome = lazy(() =>
	import(/* webpackChunkName: "DashboardHome" */ '../pages/dashboard/voter/index')
);
const ODashboardHome = lazy(() =>
	import(/* webpackChunkName: "DashboardHome" */ '../pages/dashboard/organizer/index')
);
const OPollList = lazy(() =>
	import(/* webpackChunkName: "DashboardHome" */ '../pages/dashboard/organizer/poll_list')
);
const VPollList = lazy(() =>
	import(/* webpackChunkName: "DashboardHome" */ '../pages/dashboard/voter/poll_list')
);
const VCandidateDetails = lazy(() =>
	import(/* webpackChunkName: "CandidateDetails" */ '../pages/dashboard/voter/candidate-details')
);
const OCandidateDetails = lazy(() =>
	import(
		/* webpackChunkName: "CandidateDetails" */ '../pages/dashboard/organizer/candidate-details'
	)
);
// const VOrganizerPollDetail = lazy(() =>
// 	import(/* webpackChunkName: "OrganizerPollDetail" */ '../pages/dashboard/voter/poll_detail')
// );
const OOrganizerPollDetail = lazy(() =>
	import(/* webpackChunkName: "OrganizerPollDetail" */ '../pages/dashboard/organizer/poll_detail')
);
const NewPoll = lazy(() =>
	import(/* webpackChunkName: "NewPoll" */ '../pages/dashboard/organizer/newPoll')
);
const PreSignUp = lazy(() => import(/* webpackChunkName: "preSignUp" */ '../pages/preSignUp'));

function WebRoutes() {
	return (
		<Suspense fallback={<div className='loading' />}>
			<Routes>
				<Route index element={<PreSignUp />} />

				<Route path='dashboard/voter' element={<Layouts />}>
					<Route index element={<VPollList />} />
					<Route path='candidate-details' element={<VCandidateDetails />} />
					<Route path='polls' element={<VPollList />} />
					<Route path='polls/:pollId' element={<VDashboardHome />} />
				</Route>
				<Route path='dashboard/organizer' element={<Layouts />}>
					<Route index element={<ODashboardHome />} />
					<Route path='candidate-details' element={<OCandidateDetails />} />
					<Route path='polls' element={<OPollList />} />
					<Route path='polls/:pollId' element={<OOrganizerPollDetail />} />
					<Route path='polls/create' element={<NewPoll />} />
				</Route>

				<Route element={<LoginLayouts />}>
					<Route path='/sign-up' element={<SignUp />} />
					<Route path='/login' element={<Login />} />
				</Route>
			</Routes>
		</Suspense>
	);
}

export default WebRoutes;
