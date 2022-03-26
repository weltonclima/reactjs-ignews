import { fireEvent, render, screen } from '@testing-library/react';
import { mocked } from 'jest-mock';
import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { SubscriberButton } from '../../components/SubscribeButton';

jest.mock('next-auth/client');
jest.mock('next/router');

describe('SubscriberButton component', () => {

  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    render(<SubscriberButton />);

    expect(screen.getByText('Subscribe Now')).toBeInTheDocument();
  });


  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn);
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SubscriberButton />);

    const subscribeButton = screen.getByText('Subscribe Now');

    fireEvent.click(subscribeButton);

    expect(signInMocked).toHaveBeenCalled();
  });


  it('redirects to posts when user already has a subscription', () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);
    const pushMock = jest.fn();

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any);

    useSessionMocked.mockReturnValueOnce([
      {
        user: {
          name: 'John Doe',
          email: 'john.doe@example.com'
        },
        activeSubscription: 'fake-activeSubscription',
        expires: 'fake-expires'
      },
      false
    ] as any);

    render(<SubscriberButton />);

    const subscribeButton = screen.getByText('Subscribe Now');

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith('/posts');
  })
})