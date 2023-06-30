import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useState } from 'react';
import { IShortUrls } from '../interface';
import validator from 'validator';
import toast from 'react-hot-toast';
import Cookies from 'universal-cookie';
import { generateNumber } from '../helper/helper';
import { LinkCard } from '../component/LinkCard';
import Footer from '../component/Footer';
import bgboostDesktop from '../assets/images/bg-boost-desktop.svg';
import illustrationWorking from '../assets/images/illustration-working.svg';
import { axiosInstance } from '../config/config';

const uuid = `${generateNumber()}`;
const Home = () => {
  const cookies = new Cookies();
  const [fullUrlInput, setFullUrlInput] = useState('');
  const queryClient = useQueryClient();

  const shortenUrl = async (value: { fullUrl: string }) => {
    const XUserId = cookies.get('x-user-id');
    const res = await axiosInstance.post(`/url`, value, {
      headers: {
        'x-user-id': XUserId ? XUserId : uuid,
      },
    });
    !XUserId && cookies.set('x-user-id', uuid);
    return res.data;
  };

  const fetchShortUrls = async () => {
    const XUserId = cookies.get('x-user-id');
    const res = await axiosInstance.get(`/url`, {
      headers: {
        'x-user-id': XUserId ? XUserId : '',
        // Authorization: `Bearer ${token}`
      },
    });
    return res.data;
  };

  const { data: urlsData } = useQuery(['allUrls'], fetchShortUrls);

  const { mutate: mutateShortenUrl } = useMutation({
    mutationFn: shortenUrl,
    onSuccess: () => {
      queryClient.invalidateQueries(['allUrls']);
      setFullUrlInput('');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fullUrlInput) return toast.error('Field cannot be empty');

    const isValidLink = validator.isURL(fullUrlInput);
    if (!isValidLink) return toast.error('Enter a valid url');

    mutateShortenUrl({ fullUrl: fullUrlInput });
  };

  return (
    <div>
      <div className="flex justify-between py-3 px-6 md:px-32">
        <h1 className="text-3xl"> Scissors</h1>
        <div className="space-x-6">
          <button className="bg-transparent px-4 py-2 text-black rounded-2xl">
            <a href="/login">Login</a>
          </button>
          <button className="bg-cyan px-4 py-2 text-white rounded-2xl">
            <a href="/signup">Signup</a>
          </button>
        </div>
      </div>
      <div className="relative flex items-center">
        <div className="md:flex items-center px-6  py-24 pb-36 lg:pb-36 md:px-32 lg:gap-10">
          <div className="lg:w-1/2">
            <h1 className="text-5xl mb-6 md:text-8xl lg:text-8xl ">
              More than just shorter links.
            </h1>
            <p className="text-xl max-w-xl">
              Build your brand's recognition and get dedicated insights on how
              your links are performing
            </p>
            <a
              href="/signup"
              className="text-center font-semibold text-xl block w-1/2 m-auto mt-6 bg-cyan py-4 px-3 text-white rounded-full lg:w-1/3 lg:ml-0"
            >
              <button>Get started</button>
            </a>
          </div>
          <div className="max-w-lg items-center hidden lg:block lg:w-1/2">
            <img src={illustrationWorking} alt="" />
          </div>
        </div>
        <div className="absolute w-full -bottom-[5rem] px-6 lg:-bottom-[3rem]">
          <form
            className="flex m-auto bg-dark-violet gap-3  px-6 py-5 md:w-3/4 rounded-md lg:py-8"
            style={{ backgroundImage: `url(${bgboostDesktop})` }}
            onSubmit={handleSubmit}
          >
            <div className=" flex w-full gap-5 flex-col lg:flex-row lg:gap-8 ">
              <input
                type="text"
                className="flex-1 rounded focus:ring-0 p-3 w-full lg:w-3/4"
                placeholder="Enter url"
                name="full-url"
                id="full-url"
                value={fullUrlInput}
                onChange={(e) => setFullUrlInput(e.target.value)}
              />

              <button
                className="bg-cyan rounded-md py-3 w-full text-white lg:w-1/4"
                type="submit"
              >
                Shorten it
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="bg-[#eee] pt-20 pb-20">
        <div className=" px-6 lg:px-32 ">
          {urlsData?.length > 0
            ? urlsData?.map((url: IShortUrls) => {
                return <LinkCard url={url} key={url.shortUrl} />;
              })
            : null}
        </div>
        <div className="flex flex-col text-very-dark-blue items-center text-center mt-12">
          <div className="w-3/5 mx-auto text-center">
            <a href="/signup">
              <button className="text-white px-4 py-2 bg-dark-violet rounded-lg">
                Signup
              </button>
            </a>
          </div>
          <p className="mt-6 text-2xl">Sign up to keep your links forever</p>
          <p className="max-w-[30rem] m-4">
            After registration, you will be able to see the statistics of clicks
            on your links, as well as apply additional «Features»
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
