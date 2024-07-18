export const CryptoPage = ({ params }: { params: { exchanger: string } }) => {
  console.log(params);
  return <div>CryptoExchangersPage {params.exchanger}</div>;
};
