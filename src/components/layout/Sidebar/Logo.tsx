import { Image } from '@chakra-ui/react';
import logoSrc from 'assets/logo.png';

type Props = {
  width?: string;
  height?: string;
};

function Logo({ width = '80px', height = '80px' }: Props) {
  return <Image src={logoSrc} w={width} h={height} />;
}

export default Logo;
