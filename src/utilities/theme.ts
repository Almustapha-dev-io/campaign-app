import {
  theme as baseTheme,
  extendTheme,
  withDefaultColorScheme,
} from '@chakra-ui/react';

const theme = extendTheme(
  {
    fonts: {
      heading: `Open Sans, ${baseTheme.fonts.heading}`,
      body: `Open Sans, ${baseTheme.fonts.body}`,
    },
  },
  withDefaultColorScheme({ colorScheme: 'green' })
);

export default theme;
