import {
  MdAdsClick,
  MdAnalytics,
  MdCalendarMonth,
  MdCopyAll,
  MdLink,
  MdQrCode,
} from 'react-icons/md';
import { IShortUrls } from '../interface';
import { toast } from 'react-hot-toast';
import { config } from '../config/config';
import { QRCodeCanvas } from 'qrcode.react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useNavigate } from 'react-router';
import { getToken } from '../helper/authHelper';
dayjs.extend(relativeTime);

type Props = {
  url: IShortUrls;
};

export const LinkCard = ({ url }: Props) => {
  const navigate = useNavigate();
  const currentDate = new Date();
  const dateCreated = dayjs(url?.createdAt).from(currentDate);

  const handleCopy = (value: string) => {
    const host = config.HOST;
    navigator.clipboard.writeText(`${host}/${value}`);
    toast.success('copied to clipboard');
  };

  const handleAnalytics = (id: string) => {
    navigate(`/analytics/${id}`);
  };

  const downloadQRCode = () => {
    const canvas = document.querySelector(
      '#qrcode-canvas'
    ) as HTMLCanvasElement;
    if (!canvas) throw new Error('<canvas> not found in the DOM');

    const pngUrl = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = 'QR code.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const parsedUrl = new URL(url.fullUrl).hostname;

  return (
    <div
      className="border bg-gray-300 rounded-lg flex justify-between mb-4 my-6 lg:mb-0 lg:px-6 lg:py-3"
      key={url.shortUrl}
    >
      <div className="flex gap-6 items-center">
        <div className="p-1  h-8 w-8">
          <img
            src={`https://www.google.com/s2/favicons?domain=${parsedUrl}`}
            alt=""
            style={{ height: '100%', width: '100%' }}
          />
        </div>
        <div>
          <div className="flex space-x-5 items-center">
            <p
              className="flex items-center space-x-1 hover:cursor-pointer hover:bg-[#eee] rounded"
              onClick={() => handleCopy(url?.shortUrl)}
            >
              <span>
                <MdCopyAll />
              </span>
              <span>{url.shortUrl} </span>
            </p>
            <div className="p-3">
              <div className="hidden">
                <QRCodeCanvas
                  id="qrcode-canvas"
                  level="H"
                  size={150}
                  value={url?.fullUrl}
                  bgColor="white"
                  fgColor="blue"
                  includeMargin
                />
              </div>
              <span onClick={downloadQRCode} className="cursor-pointer">
                <MdQrCode />
              </span>
            </div>
          </div>
          <div className="flex items-center ">
            <p
              className={`flex items-center space-x-1 ${getToken() ? 'block' : 'hidden'}`}
            >
              <span>
                <MdCalendarMonth />
              </span>
              <span>{dateCreated}</span>
            </p>
            {getToken() ? (
              <p>
                <MdAdsClick />
              </p>
            ) : null}
            <p className="flex items-center space-x-1 w-full">
              <span>
                <MdLink />
              </span>
              <span className='overflow-ellipsis'>{url.fullUrl.substring(0, 20) + '...'}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center self-center ">
        {getToken() ? (
          <span
            className="text-2xl cursor-pointer"
            onClick={() => handleAnalytics(url.shortUrl)}
          >
            <MdAnalytics />
          </span>
        ) : null}
      </div>
    </div>
  );
};
