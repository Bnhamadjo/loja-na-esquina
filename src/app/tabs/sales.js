import { TransactionForm } from '../../components/TransactionForm';
import { useAppData } from '../../context/AppDataContext';

export default function SalesRoute() {
  const { data, registerSale } = useAppData();
  return <TransactionForm type="sale" products={data.produtos} onSubmit={registerSale} />;
}