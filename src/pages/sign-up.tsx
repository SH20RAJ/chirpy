import * as React from 'react';

import { Auth } from '$/blocks/Auth';
import { Link } from '$/components/Link';
import { Text } from '$/components/Text';

export default function SignUp(): JSX.Element {
  return (
    <Auth
      name="Sign up"
      title="Create an account 🎓"
      subtitle={
        <div tw="flex flex-row space-x-1">
          <Text tw="text-gray-500">Already have an account?</Text>
          <Link href="/log-in" variant="nav">
            Log in
          </Link>
        </div>
      }
    />
  );
}
