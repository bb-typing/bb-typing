import { useMount } from 'ahooks';
import React from 'react';
import { Link } from 'react-router-dom';
import { tw } from 'twind';

interface WelcomeProps {}

const Welcome: React.FC<WelcomeProps> = () => {
  useMount(() => {});

  return (
    <div className={tw`h-[500px] w-[500px] bg-[#4ae52c]`}>
      <br />
      <Link to="/test">看着温柔的草…美丽的云</Link>
    </div>
  );
};

export default Welcome;
