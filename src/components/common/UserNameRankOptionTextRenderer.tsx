import { RaRecord as Record } from "react-admin";

const UserNameRankOptionTextRenderer = ({ record }: { record?: Record }) => {
  if (record?.u_rank) return <>{`${record?.u_name} (${record?.u_rank})`}</>;

  return <>{record?.u_name}</>;
};

export default UserNameRankOptionTextRenderer;
