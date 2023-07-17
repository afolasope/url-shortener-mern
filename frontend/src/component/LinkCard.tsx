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
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

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

  let parsedUrl;
  if (
    !url.fullUrl.startsWith('http://') &&
    !url.fullUrl.startsWith('https://')
  ) {
    parsedUrl = new URL(`http://${url.fullUrl}`).hostname;
  } else {
    parsedUrl = new URL(url.fullUrl).hostname;
  }

  let pathName: string | boolean = window.location.pathname.split('/')[1];
  if (pathName === '') {
    pathName = false;
  } else {
    pathName = true;
  }
  return (
    <div
      className={`${
        pathName ? '' : 'm-auto'
      } shadow-lg border rounded-lg flex justify-between mb-4 my-6 lg:mb-0 lg:px-6 lg:py-3 `}
      key={url.shortUrl}
    >
      <div className="flex gap-6 items-center lg:w-full">
        <div className="p-1 h-8 w-8">
          <img
            src={`https://www.google.com/s2/favicons?domain=${parsedUrl}`}
            alt=""
            style={{ height: '100%', width: '100%' }}
          />
        </div>
        <div className="lg:w-full">
          <div className="flex space-x-5 items-center lg:space-x-20 lg:w-full">
            <p
              className="flex items-center space-x-1 hover:cursor-pointer hover:bg-[#eee] rounded"
              onClick={() => handleCopy(url?.shortUrl)}
              data-tooltip-id="copy_short_url"
              data-tooltip-content={'Copy short url'}
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
              <span
                onClick={downloadQRCode}
                className="cursor-pointer"
                data-tooltip-id="download_qrcode"
                data-tooltip-content={'Download QR code'}
              >
                <MdQrCode />
              </span>
              <Tooltip id="download_qrcode" place="top" />
              <Tooltip id="copy_short_url" place="top" />
            </div>
          </div>
          <div className="flex items-center ">
            <p
              className={`flex items-center space-x-1 ${
                getToken() ? 'block' : 'hidden'
              }`}
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
              <span className="overflow-ellipsis">
                {url.fullUrl.substring(0, 20) + '...'}
              </span>
            </p>
          </div>
        </div>
      </div>
      <Tooltip id="analytics" place="top" />
      <div className="flex items-center justify-center self-center ">
        {getToken() ? (
          <span
            className="text-2xl cursor-pointer"
            onClick={() => handleAnalytics(url.shortUrl)}
            data-tooltip-id="analytics"
            data-tooltip-content={'Analytics'}
          >
            <MdAnalytics />
          </span>
        ) : null}
      </div>
    </div>
  );
};
