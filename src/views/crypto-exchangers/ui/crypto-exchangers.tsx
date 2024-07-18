export const CryptoExchangersPage = ({ params }: { params: { exchanger: string[] } }) => {
  console.log(params);
  return <div>CryptoPage {JSON.stringify(params)}</div>;
};
