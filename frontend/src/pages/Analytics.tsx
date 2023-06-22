/* eslint-disable no-prototype-builtins */
import {
  MdArrowBack,
  MdBrowserUpdated,
  MdDevices,
  MdDevicesOther,
  MdFitScreen,
} from 'react-icons/md';
import { LogoutBtn } from '../component/LogoutBtn';
import { useNavigate, useParams } from 'react-router';
import Cookies from 'universal-cookie';
import axios from 'axios';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import Footer from '../component/Footer';

export const Analytics = () => {
  const params = useParams();
  const { id } = params;
  const cookies = new Cookies();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const getHistoryById = async () => {
    const token = cookies.get('access_token');
    const res = await axios.get(
      'http://localhost:8000/history/:shortUrl'.replace(':shortUrl', id || ''),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  };

  const { data: history } = useQuery(['history', id], getHistoryById);
  const deleteUrl = async (id: string) => {
    const token = cookies.get('access_token');

    const res = axios.delete(
      'http://localhost:8000/url/:shortUrl'.replace(':shortUrl', id),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return (await res).data;
  };
  const { mutate: deleteMutation } = useMutation(deleteUrl, {
    onSuccess: () => {
      queryClient.invalidateQueries(['allUrls']);
      queryClient.invalidateQueries(['history']);
      navigate('/dashboard');
    },
  });
  const handleDelete = (id: string) => {
    return deleteMutation(id);
  };

  const userClient = history?.map((item: any) => {
    return {
      device: item.device,
      browser: item.browser,
      brand: item.brand,
      system: item.os,
      location: item.location,
    };
  });

  const reducedData = userClient?.reduce(
    (result: any, item: any) => {
      // Count browsers
      const browser = item?.browser;
      if (result?.browser.hasOwnProperty(browser)) {
        result.browser[browser]++;
      } else {
        result.browser[browser] = 1;
      }

      // Count devices
      const device = item.device;
      if (result.device.hasOwnProperty(device)) {
        result.device[device]++;
      } else {
        result.device[device] = 1;
      }

      // Count systems
      const system = item.system;
      if (result.system.hasOwnProperty(system)) {
        result.system[system]++;
      } else {
        result.system[system] = 1;
      }

      // Count brands
      const brand = item.brand;
      if (brand !== undefined) {
        if (result.brand.hasOwnProperty(brand)) {
          result.brand[brand]++;
        } else {
          result.brand[brand] = 1;
        }
      }
      // Count location
      const location = item.location;
      if (location !== undefined) {
        if (result.location.hasOwnProperty(location)) {
          result.location[location]++;
        } else {
          result.location[location] = 1;
        }
      }

      return result;
    },
    { browser: {}, device: {}, system: {}, brand: {}, location: {} }
  );

  const result = {
    browser: Object.entries(reducedData?.browser || []).map(
      ([name, count]) => ({
        name,
        count,
      })
    ),
    device: Object.entries(reducedData?.device || []).map(([name, count]) => ({
      name,
      count,
    })),
    system: Object.entries(reducedData?.system || []).map(([name, count]) => ({
      name,
      count,
    })),
    brand: Object.entries(reducedData?.brand || []).map(([name, count]) => ({
      name,
      count,
    })),
    location: Object.entries(reducedData?.location || []).map(
      ([name, count]) => ({
        name,
        count,
      })
    ),
  };

  return (
    <div>
      <div className="flex justify-between border p-3 px-24">
        <h1 className="text-3xl">Analytics</h1>
        <LogoutBtn />
      </div>
      <div className="p-20 pt-6 ">
        <a
          href="/dashboard"
          className="text-blue-400 flex items-center space-x-4 cursor-pointer"
        >
          <span className="border rounded-full block p-4">
            <MdArrowBack />
          </span>
          <span className="text-2xl">Go back to Dashoard</span>
        </a>
        <p className="flex justify-between mt-3">
          <span>Stats: #{id}</span>
          <span className="font-bold text-xl">
            {history ? history.length : 0 + ' '}{' '}
            {history?.length > 1 ? ' clicks' : ' click'}
          </span>
        </p>
      </div>
      {history?.length === 0 ? (
        <div className="flex justify-center items-center h-screen">
          <p className="text-6xl font-bold">You have no visits to this link</p>
        </div>
      ) : (
        <>
          <div className="p-20 pt-6">
            <div className="flex justify-between px-24 ">
              <div>
                <span className="text-8xl">
                  <MdDevices />
                </span>
                <p className="text-xl font-semibold">Device Type</p>
                <p>
                  {result?.device.map((item) => (
                    <li className="flex items-center">
                      <span>{item.name}</span>
                      <span className="block ml-4  rounded-full p-2 bg-[#eee]">
                        {item.count as number}
                      </span>
                    </li>
                  ))}
                </p>
              </div>
              <div>
                <span className="text-8xl">
                  <MdDevicesOther />
                </span>
                <p className="text-xl font-semibold">Device Model</p>
                {result.brand.map((item) => (
                  <li className="flex items-center">
                    <span>{item.name}</span>
                    <span className="block ml-4  rounded-full p-2 bg-[#eee]">
                      {item.count as number}
                    </span>
                  </li>
                ))}
              </div>
              <div>
                <span className="text-8xl">
                  <MdBrowserUpdated />
                </span>
                <p className="text-xl font-semibold">Browser Family</p>
                <ul>
                  {result.browser.map((item) => (
                    <li className="flex items-center">
                      <span>{item.name}</span>
                      <span className="block ml-4  rounded-full p-2 bg-[#eee]">
                        {item.count as number}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="text-8xl">
                  <MdFitScreen />
                </span>
                <p className="text-xl font-semibold">Platform Family</p>
                {result.system.map((item) => (
                  <li className="flex items-center">
                    <span>{item.name}</span>
                    <span className="block ml-4  rounded-full p-2 bg-[#eee]">
                      {item.count as number}
                    </span>
                  </li>
                ))}
              </div>
            </div>
          </div>
          <div className="p-20 pt-6">
            <p className="text-2xl">Location:</p>
            {result.location.map((item) => (
              <li className="flex items-center">
                <span>{item.name}</span>
                <span className="block ml-4  rounded-full p-2 bg-[#eee]">
                  {item.count as number}
                </span>
              </li>
            ))}
          </div>
          <div className="p-36 pt-6">
            <button
              className="bg-red-500 w-full rounded-3xl py-2 font-bold text-white"
              onClick={() => handleDelete(id as string)}
            >
              Delete Link
            </button>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
};
