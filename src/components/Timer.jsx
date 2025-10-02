import { Statistic } from 'antd';


export default function Timer({ seconds }) {
  return (
    <Statistic 
      title="Time Remaining" 
      value={seconds} 
      suffix="s"
    />
  );
}