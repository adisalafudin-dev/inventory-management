import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function DashboardPage() {
  const query = useDashboardStats();
  console.log(query);
  return (
    <>
      <div>Dashboard page</div>
      <ul>
        {query.data?.map((data, index) => {
          <li key={index}>{data}</li>;
        })}
      </ul>
    </>
  );
}
