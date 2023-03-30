import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import renderRooms from './utils/render-rooms.jsx';

const Container = styled.div`
  .nav {
    position: fixed;
    top: 0;
  }
`;

const Calculator = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: row;
  #debug-gui {
    position: absolute;
    top: 0px;
    right: 0px;
    z-index: 10;
  }
`;

const ThreejsView = styled.div`
  height: 100%;
  /* width: 50vw; */
  outline: none;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const LevelButton = styled.div`
  overflow: hidden;
  z-index: 10;
  position: absolute;
  bottom: 5rem;
  background-color: white;
  box-shadow: 0px 30px 70px rgb(60 0 189 / 13%);
  width: 18rem;
  height: 4rem;
  border-radius: 4rem;
  display: flex;
  flex-direction: row;
  .right-arrow,
  .left-arrow {
    border: none;
    outline: none;
    background-color: transparent;
    width: 25%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .left-arrow {
    svg {
      color: ${(props) => (props.section === 5 ? '#EBE9FD' : '#705df2')};
    }
  }
  .right-arrow {
    svg {
      color: ${(props) => (props.section === 1 ? '#EBE9FD' : '#705df2')};
    }
  }
  h3 {
    border-left: 1px solid #f1effe;
    border-right: 1px solid #f1effe;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 50%;
    font-weight: 300;
    letter-spacing: 1px;
    font-size: 1.2rem;
  }
  span {
    text-align: end;
    width: 2rem;
  }
`;

const App = () => {
  const [section, setSection] = useState(1);
  const [levelChange, setLevelChange] = useState(true);
  const [animateY, setAnimateY] = useState(10);

  const levelIncrease = () => {
    if (section < 5) {
      setAnimateY(10);
      setLevelChange(!levelChange);
      setSection(section + 1);
    }
  };
  const levelDecrease = () => {
    if (section > 1) {
      setAnimateY(-10);
      setLevelChange(!levelChange);
      setSection(section - 1);
    } else setAnimateY(10);
  };
  useEffect(() => {
    const rooms = document.querySelector('.canvas #webgl');
    if (!rooms) {
      setTimeout(() => renderRooms(), 500);
    }
  }, []);

  return (
    <>
      {['Light', 'Book', 'Medium', 'SemiBold'].map((font, i) => (
        <link
          key={i}
          rel='preload'
          href={`/static/fonts/hk-grotesk-pro/HKGroteskPro-${font}.woff2`}
          as='font'
          type='font/woff2'
          crossOrigin='anonymous'
        />
      ))}
      <link rel='stylesheet' href='/static/css/theme.min.css' />
      <link rel='stylesheet' href='/static/css/style.css' />
      <Container>
        <Calculator>
          <div id='debug-gui' />
          <ThreejsView>
            <canvas id='webgl' />
            <LevelButton section={section}>
              <button
                id='movefloorup'
                type='button'
                className='left-arrow'
                onClick={levelIncrease}
              >
                <MdKeyboardArrowUp size={25} />
              </button>

              <h3>
                Level
                <span>
                  <AnimatePresence mode='wait'>
                    <motion.div
                      key={section}
                      initial={{ y: -animateY, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: animateY, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      0{section}
                    </motion.div>
                  </AnimatePresence>
                </span>
              </h3>

              <button
                id='movefloordown'
                type='button'
                className='right-arrow'
                onClick={levelDecrease}
              >
                <MdKeyboardArrowDown size={25} />
              </button>
            </LevelButton>
          </ThreejsView>
        </Calculator>
      </Container>
    </>
  );
};

export default App;
