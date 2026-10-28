import React from "react";
import styled from "styled-components";


interface DashLoaderProps {
  text?: string;
  isRunLoader: boolean;
}

const DashLoader: React.FC<DashLoaderProps> = ({ text, isRunLoader }) => {
  if (!isRunLoader) return null;

  return (
    <StyledWrapper>
      <div className="spinner">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="spinner-blade" />
        ))}
      </div>
      {text && <p className="loader-text">{text}</p>}
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;

  .spinner {
    font-size: 48px;
    position: relative;
    width: 1em;
    height: 1em;
  }

  .spinner .spinner-blade {
    position: absolute;
    left: 0.4629em;
    bottom: 0;
    width: 0.074em;
    height: 0.2777em;
    border-radius: 0.0555em;
    background-color: transparent;
    transform-origin: center -0.2222em;
    animation: spinner-fade9234 1s infinite linear;
  }

  ${Array.from({ length: 12 })
    .map(
      (_, i) => `
      .spinner .spinner-blade:nth-child(${i + 1}) {
        animation-delay: ${(i * 1) / 12}s;
        transform: rotate(${i * 30}deg);
      }
    `
    )
    .join("")}

  .loader-text {
    margin-top: 1rem;
    font-size: 1rem;
    color: #0B234A;
    font-weight: 500;
    text-align: center;
    animation: textPulse 2s infinite ease-in-out;
  }

  @keyframes spinner-fade9234 {
    0% {
      background-color: #0B234A;
    }
    100% {
      background-color: transparent;
    }
  }

  @keyframes textPulse {
    0%, 100% {
      opacity: 0.4;
    }
    50% {
      opacity: 1;
    }
  }
`;

export default DashLoader;
