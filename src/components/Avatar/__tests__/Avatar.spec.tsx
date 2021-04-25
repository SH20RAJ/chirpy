import { render, screen } from '@testing-library/react';
import * as React from 'react';

import { Avatar } from '../Avatar';

describe('Avatar', () => {
  afterEach(() => {
    jest.resetAllMocks();
    // cleanup();
  });

  it('should render avatar', async () => {
    const mockAlt = 'This is a testing avatart alt';
    render(<Avatar src="http://example.com" alt={mockAlt} />);
    expect(screen.getByAltText(mockAlt)).toBeTruthy();
  });
});
