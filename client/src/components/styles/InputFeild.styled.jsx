import styled from "styled-components";

const Input = styled.div`
  width: 80%;
  height: 50px;
  border-radius: 0.5rem;
  margin: 5% auto;
  display: flex;
  overflow: hidden;
  background-color: white;

  @media (max-width: 768px) {
    width: 80%;
  }
`;

const IconContainer = styled.div`
  display: flex;
  background-color: red;
  width: 20%;
  font-size: xx-large;
  justify-content: center;
  align-items: center;
  color: white;
  background-color: #1c4f46;
`;

const Text = styled.input`
  height: 100%;
  width: 80%;
  font-size: x-large;
  padding: 5px;

  &:focus {
    outline: none;
    border: 0;
  }
`;

const InputFeild = ({ disable = false, Icon, type, placeholder, ...props }) => {
  return (
    <>
      <Input>
        {props.cam ? (
          <IconContainer onClick={props.showCam} style={{ cursor: "pointer" }}>
            {Icon && <Icon />}
          </IconContainer>
        ) : (
          <IconContainer>{Icon && <Icon />}</IconContainer>
        )}
        <Text type={type} placeholder={placeholder} {...props} />
      </Input>
    </>
  );
};

export default InputFeild;
