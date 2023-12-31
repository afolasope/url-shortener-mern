import { useMutation, useQuery, useQueryClient } from 'react-query';
import validator from 'validator';
import Cookies from 'universal-cookie';
import { LogoutBtn } from '../component/LogoutBtn';
import { IShortUrls } from '../interface';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { LinkCard } from '../component/LinkCard';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { History } from '../component/History';
import Footer from '../component/Footer';
import { axiosInstance } from '../config/config';
dayjs.extend(relativeTime);

export const Dashboard = () => {
  const cookies = new Cookies();
  const [fullUrlInput, setFullUrlInput] = useState('');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const queryClient = useQueryClient();

  const fetchShortUrls = async () => {
    const token = cookies.get('access_token');
    const res = await axiosInstance.get('/url', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  };

  const { data: urlsData } = useQuery('allUrls', fetchShortUrls);

  const shortenUrl = async (value: { fullUrl: string; customUrl: string }) => {
    const token = cookies.get('access_token');
    const res = await axiosInstance.post('/url', value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.status === 409) {
      console.log('error');
    }

    return res.data;
  };

  const { mutate: mutateShortenUrl } = useMutation({
    mutationFn: shortenUrl,
    onSuccess: () => {
      console.log('success');
      queryClient.invalidateQueries(['allUrls']);
      setFullUrlInput('');
      setCustomUrlInput('');
    },
    onError: (error: any) => {
      toast.error(`${error?.response.data.message}`, {
        duration: 6000,
      });
    },
  });

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (!fullUrlInput) return toast.error('Field cannot be empty');

    const isValidLink = validator.isURL(fullUrlInput);
    if (!isValidLink) {
      return toast.error('Please enter a valid link');
    }

    mutateShortenUrl({ fullUrl: fullUrlInput, customUrl: customUrlInput });
  };

  return (
    <div>
      <div className="flex justify-between p-3 lg:px-24">
        <h1 className="text-3xl">Dashboard</h1>
        <LogoutBtn />
      </div>
      <div className="md:flex gap-12 bg-[#eee] lg:px-24 pt-12">
        <p className="p-6 bg-white md:w-[50%] mb-6 md:mb-0">
          <span>Clicks:</span> <span>{history.length}</span>
        </p>
        <p className="p-6 bg-white md:w-[50%]">
          <span>Links:</span> <span>{urlsData?.length}</span>
        </p>
      </div>
      <div className="max-h-full md:flex items-start gap-6 bg-[#eee] lg:px-24 py-16">
        <div className="md:w-[70%] bg-white p-6">
          <p className="text-3xl mb-6">Create your link</p>
          <div className="flex flex-col mb-4 ">
            <label htmlFor="full-link" className="mb-2">
              Full Link
            </label>
            <input
              type="url"
              name="full-link"
              id="full-link"
              className="border p-3"
              value={fullUrlInput}
              onChange={(e) => setFullUrlInput(e.target.value)}
            />
          </div>
          <div className="flex flex-col mb-8">
            <label htmlFor="custom-link" className="mb-2">
              Custom Link (optional)
            </label>
            <input
              type="url"
              name="custom-link"
              id="custom-link"
              className="border p-3"
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
            />
          </div>
          <button
            className="bg-dark-violet p-3 w-full text-white font-medium"
            onClick={(e) => handleSubmit(e)}
          >
            Create Link Here
          </button>
          <h3 className="text-6xl font-semibold m-6 ml-0">Your links</h3>
          <div className="w-full">
            {urlsData?.length > 0 &&
              urlsData?.map((url: IShortUrls) => {
                return <LinkCard url={url} key={url.shortUrl} />;
              })}
          </div>
        </div>
        <div className="md:w-[30%] bg-white p-6">
          <h3 className="text-4xl">Links history</h3>
          <History />
        </div>
      </div>
      <Footer />
    </div>
  );
};
