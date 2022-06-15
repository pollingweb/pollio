import Webcam from 'react-webcam';
import styled from 'styled-components';
import { useRef, useState, useCallback } from 'react';
import profile_pic from '../images/default-profile.jpg';
import axios from 'axios'


const Container = styled.div`
    width : 100vw;
    height : 100vh;
    position  : absolute;
    display : flex; 
    justify-content : center;
    align-items : center;
    background-color : #2d282890;
`

const Button = styled.button`
    width : 20%;
    height : 50px;
    font-size : x-large;
    border-radius : 0.2rem;
    cursor : pointer;
    border : 3px solid transparent;
    margin : 50px auto;
    background-color: #fdf4f4;

    &:hover {
        background-color : #d8cfcf;
        border : 3px solid #1c4008;
    }
`

const ImagePreview = styled.img`
    height : 500px;
    width : 700px;
`

const NestedDiv = styled.div`
    margin-top : 5vh;
    display : flex;
    justify-content : center;
    align-items : center;
    flex-direction:column;
    margin : auto;
`

const Camera = (props) => {
    const [img, setImg] = useState('');
    const webcamRef = useRef(null);
    const capture = useCallback(
        async () => {
            const imageSrc = await webcamRef.current.getScreenshot();

            const body = {
                name :  "strange.png",
                base64 : imageSrc
            }

            const res = await axios.post(process.env.REACT_APP_API_BASEURL+'/api/upload/base64', body)

            if (res.status === 200) {
                props.setUrl(res.data.url)
            }
            
            setImg(imageSrc);
        },
        [webcamRef,props]
    );
    return (
        <Container>
            <NestedDiv>
                <Webcam
                    screenshotFormat="image/png"
                    height={500}
                    width={700}
                    ref={webcamRef}
                />
                <Button onClick={capture}>Take Photo</Button>
            </NestedDiv>
            <NestedDiv>
                <ImagePreview src={img || profile_pic} alt="your picture will be appear here" />
                <Button onClick={props.hide}>Save</Button>
            </NestedDiv>
        </Container>

    )
}

export default Camera