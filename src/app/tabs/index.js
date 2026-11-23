import { HomeScreen } from '../../screens/homescreen';
import { useAppData } from '../../context/AppDataContext';

export default function DashboardRoute() {
  const { data } = useAppData();
  return <HomeScreen produtos={data.produtos} vendas={data.vendas} />;
}