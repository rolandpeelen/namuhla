import styled, { css } from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  align-content: center;
  justify-content: center;
  ${({ inline }) =>
    !inline
      ? css`
          width: 100vw;
          height: 100vh;
          position: fixed;
          top: 0;
          left: 0;
          border-radius: ${({ theme }) => theme.background};
        `
      : null};
`;

const Svg = styled.svg`
  overflow: visible;
  padding-right: 25px;
`;
const Message = styled.h3``;

const Path = styled.path`
  ${({ theme, number, weightFactor }) =>
    css`
      @keyframes bounce${number} {
        0%,
        20%,
        65%,
        100% {
          transform: translateY(0);
        }
        36% {
          transform: translateY(${-18 + 4 * weightFactor}px);
        }
        40% {
          transform: translateY(${-20 + 5 * weightFactor}px);
        }
        45% {
          transform: translateY(${-18 + 4 * weightFactor}px);
        }
        50% {
          transform: translateY(1px);
        }
        58% {
          transform: translateY(${-4 + 1 * weightFactor}px);
        }
      }
      animation: bounce${number} 1.5s ${number * 0.43}s ease infinite;
      fill: ${theme.text};
    `};
`;

const Loader = ({
  message = "Loading...",
  width = 100,
  height = 37,
  inline = false,
}) => {
  return (
    <Container inline={inline}>
      <Svg
        width={width}
        height={height}
        viewBox="0 0 192 73"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <Path
          weightFactor={0.5}
          number={0}
          d="M37.4382 64.0911C31.5047 63.6981 25.7078 62.1966 20.0473 59.5865C14.3869 56.9765 11.035 52.5993 9.99162 46.4549C8.94828 40.3106 9.00948 34.2822 10.1752 28.3697C11.341 22.4573 14.3445 17.4694 19.1858 13.4061C24.0272 9.34281 29.4463 7.92581 35.4433 9.15512C41.4403 10.3844 46.6769 12.6212 51.1532 15.8654C55.6295 19.1096 59.5478 23.2915 62.908 28.4111C66.2682 33.5307 66.7284 38.9728 64.2885 44.7374C61.8487 50.502 58.247 55.2671 53.4836 59.0325C48.7202 62.798 43.3717 64.4842 37.4382 64.0911Z"
        />
        <Path
          weightFactor={-0.5}
          number={1}
          d="M121.585 47.3263C119.971 51.1432 117.653 54.6172 114.633 57.7482C111.613 60.8793 107.95 62.087 103.645 61.3713C99.339 60.6556 95.3622 59.2392 91.7143 57.122C88.0664 55.0048 85.4501 51.8887 83.8653 47.7736C82.2806 43.6585 82.5796 39.767 84.7623 36.0992C86.9451 32.4314 89.6212 29.4941 92.7907 27.2875C95.9602 25.0808 99.6231 23.4557 103.779 22.412C107.936 21.3683 111.643 22.3076 114.902 25.2299C118.162 28.1523 120.494 31.6113 121.899 35.6072C123.305 39.603 123.2 43.5094 121.585 47.3263Z"
        />
        <Path
          weightFactor={0}
          number={2}
          d="M139.797 37.6462C140.738 32.7343 142.59 28.0507 145.353 23.5956C148.116 19.1405 152.116 16.7947 157.352 16.5584C162.588 16.322 167.614 16.9956 172.428 18.5791C177.243 20.1626 181.096 23.1847 183.987 27.6452C186.879 32.1057 187.502 36.7752 185.857 41.6538C184.212 46.5324 181.804 50.6723 178.634 54.0736C175.464 57.4748 171.569 60.3135 166.948 62.5895C162.328 64.8655 157.738 64.6876 153.179 62.0559C148.619 59.4242 145.014 55.9259 142.363 51.5612C139.712 47.1965 138.856 42.5581 139.797 37.6462Z"
        />
      </Svg>
      {!inline && <Message>{message}</Message>}
    </Container>
  );
};

export default Loader;
