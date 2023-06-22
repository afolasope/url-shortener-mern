import { useQuery } from 'react-query';
import Cookies from 'universal-cookie';
import { IHistory } from '../interface';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { MdTimer } from 'react-icons/md';
import { axiosInstance } from '../config/config';
dayjs.extend(relativeTime);

export const History = () => {
  const cookies = new Cookies();
  const getHistory = async () => {
    const token = cookies.get('access_token');
    const res = await axiosInstance.get(`/url/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };

  const { data: history } = useQuery(['history'], getHistory);

  return (
    <div>
      <p className="mb-6">Access your clicks history</p>
      {history &&
        history?.map((item: IHistory) => {
          const currentDate = new Date();
          const time = dayjs(item.time).from(currentDate);
          return (
            <div
              key={`${item.shortUrl}${item.time}`}
              className="bg-[#eee] mb-3 p-2 rounded-sm"
            >
              <p className="flex items-center text-sm gap-2">
                <span>
                  <MdTimer />
                </span>
                <span>{time}</span>
              </p>
              <p className="flex justify-between text-sm">
                <span>#{item.shortUrl}</span>
                <span>{item.fullUrl.substring(0, 20) + '...'}</span>
              </p>
            </div>
          );
        })}
    </div>
  );
};
