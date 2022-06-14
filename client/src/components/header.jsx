import React from 'react';
import styled from 'styled-components';

export const Container = styled.div`
	position: static;
	display: flex;
	justify-content: flex-end;
	padding: 20px;
	padding-right: 80px;
`;

export default function Header() {
	return <Container></Container>;
}
