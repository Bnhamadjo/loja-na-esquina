import { TransactionForm } from '../../components/TransactionForm';
import { useAppData } from '../../context/AppDataContext';

export default function PurchasesRoute() {
  const { data, registerPurchase } = useAppData();
  return <TransactionForm type="purchase" products={data.produtos} onSubmit={registerPurchase} />;
}