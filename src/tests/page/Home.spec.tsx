import { render, screen } from "@testing-library/react";
import { mocked } from "jest-mock";
import Home, { getServerSideProps } from "../../pages";
import { stripe } from "../../services/stripe";

jest.mock('next/router');
jest.mock('next-auth/client', () => {
  return { useSession: () => [null, false] }
});
jest.mock('../../services/stripe');

describe('Home page', () => {
  it('renders correctly', () => {
    render(<Home product={{ priceId: 'fake-price-id', amount: 'R$10,00' }} />);

    expect(screen.getByText('for R$10,00 month')).toBeInTheDocument();
  });


  it('loads initial data', async () => {
    const retriveStripePricesMocked = mocked(stripe.prices.retrieve);

    retriveStripePricesMocked.mockResolvedValueOnce({
      id: 'fake-id',
      unit_amount: 1000,
    } as any);

    const response = await getServerSideProps({} as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: 'fake-id',
            amount: '$10.00'
          }
        }
      })
    );
  });
})